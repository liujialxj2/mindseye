/**
 * GameDistribution 游戏适配器
 * 此脚本帮助解决第三方cookie和iframe权限问题
 */

(function() {
  // 创建虚拟localStorage，用于iframe不能访问真正localStorage时
  window.virtualStorage = {};
  
  // 虚拟localStorage实现
  const virtualLocalStorage = {
    getItem: function(key) {
      return window.virtualStorage[key] || null;
    },
    setItem: function(key, value) {
      try {
        window.virtualStorage[key] = value.toString();
        // 同时尝试使用真实localStorage
        try { localStorage.setItem(key, value); } catch(e) {}
        return true;
      } catch(e) {
        return false;
      }
    },
    removeItem: function(key) {
      delete window.virtualStorage[key];
      try { localStorage.removeItem(key); } catch(e) {}
    },
    clear: function() {
      window.virtualStorage = {};
      try { localStorage.clear(); } catch(e) {}
    }
  };
  
  // 当iframe加载时执行
  window.addEventListener('message', function(event) {
    // 只处理来自GameDistribution的消息
    if (event.origin.includes('gamedistribution.com')) {
      try {
        // 解析来自游戏的消息
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        
        // 处理游戏事件
        if (data && data.type) {
          switch(data.type) {
            case 'game_loaded':
              console.log('Game has been loaded successfully');
              break;
            case 'game_start':
              console.log('Game has started');
              break;
            case 'game_pause':
              console.log('Game has been paused');
              break;
            case 'game_resume':
              console.log('Game has been resumed');
              break;
            case 'game_error':
              console.error('Game error:', data.message);
              break;
            // 处理localStorage请求
            case 'localStorage_get':
              if (data.key) {
                const value = virtualLocalStorage.getItem(data.key);
                event.source.postMessage(JSON.stringify({
                  type: 'localStorage_response',
                  action: 'get',
                  key: data.key,
                  value: value
                }), '*');
              }
              break;
            case 'localStorage_set':
              if (data.key && data.value !== undefined) {
                const success = virtualLocalStorage.setItem(data.key, data.value);
                event.source.postMessage(JSON.stringify({
                  type: 'localStorage_response',
                  action: 'set',
                  key: data.key,
                  success: success
                }), '*');
              }
              break;
          }
        }
      } catch(e) {
        // 忽略解析错误
      }
    }
  });
  
  // 尝试解决第三方cookie问题
  function attemptCookieAccess() {
    try {
      // 通知父页面我们试图访问cookie
      window.parent.postMessage({
        type: 'cookie_access_attempt',
        timestamp: Date.now()
      }, '*');
      
      // 尝试存储一个测试cookie
      document.cookie = "gd_test_cookie=1; path=/; SameSite=None; Secure";
      
      return document.cookie.indexOf("gd_test_cookie=1") !== -1;
    } catch(e) {
      console.log('Cookie access failed:', e);
      return false;
    }
  }
  
  // 显示cookie状态
  if (attemptCookieAccess()) {
    console.log('Third-party cookies are enabled');
  } else {
    console.log('Third-party cookies are blocked, using virtual storage');
  }
  
  // 监听localStorage错误
  window.addEventListener('storage_error', function(e) {
    console.log('Storage error caught, using virtual storage');
  });
  
  // 重写console.error以捕获游戏错误
  const originalError = console.error;
  console.error = function() {
    // 调用原始函数
    originalError.apply(console, arguments);
    
    // 查找GameDistribution错误
    const errorString = Array.from(arguments).join(' ');
    if (errorString.includes('GameDistribution') || errorString.includes('GD_OPTIONS')) {
      console.log('Attempting to recover from GameDistribution error...');
      
      // 尝试重新初始化
      setTimeout(function() {
        if (window.GD_OPTIONS && typeof window.gdsdk === 'undefined') {
          // 重新加载SDK
          const script = document.createElement('script');
          script.src = 'https://html5.api.gamedistribution.com/main.min.js';
          document.head.appendChild(script);
        }
      }, 2000);
    } else if (errorString.includes('localStorage') || errorString.includes('Storage')) {
      // 触发自定义事件，通知使用虚拟存储
      const event = new CustomEvent('storage_error', { detail: errorString });
      window.dispatchEvent(event);
    }
  };
  
  console.log('GameDistribution adapter initialized with virtual localStorage');
})(); 