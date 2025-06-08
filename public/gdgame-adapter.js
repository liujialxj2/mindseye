/**
 * GameDistribution 游戏适配器
 * 此脚本帮助解决第三方cookie和iframe权限问题
 */

(function() {
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
    console.log('Third-party cookies are blocked');
  }
  
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
    }
  };
  
  console.log('GameDistribution adapter initialized');
})(); 