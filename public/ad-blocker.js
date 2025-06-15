(function() {
  // 仅在本地环境中运行
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') return;
  
  console.log('广告拦截器已启动 - 本地开发环境');
  
  // 拦截广告相关请求
  const originalFetch = window.fetch;
  window.fetch = function(url, options) {
    if (typeof url === 'string' && (
      url.includes('improvedigital.com') || 
      url.includes('azerioncircle.com') || 
      url.includes('doubleclick.net') ||
      url.includes('adtrafficquality.google') ||
      url.includes('pagead2.googlesyndication.com')
    )) {
      console.log(`已拦截广告请求: ${url}`);
      return Promise.resolve(new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }));
    }
    return originalFetch.apply(this, arguments);
  };
  
  // 拦截XHR请求
  const originalOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url) {
    if (typeof url === 'string' && (
      url.includes('improvedigital.com') || 
      url.includes('azerioncircle.com') || 
      url.includes('doubleclick.net') ||
      url.includes('adtrafficquality.google') ||
      url.includes('pagead2.googlesyndication.com')
    )) {
      console.log(`已拦截XHR广告请求: ${url}`);
      this.abort();
      return;
    }
    return originalOpen.apply(this, arguments);
  };
  
  // 修复JSON解析错误
  const originalJSONParse = JSON.parse;
  JSON.parse = function(text) {
    if (text === undefined || text === 'undefined' || text === null) {
      console.log('拦截了无效JSON解析');
      return {};
    }
    try {
      return originalJSONParse.call(this, text);
    } catch (e) {
      console.log('JSON解析错误，返回空对象');
      return {};
    }
  };
  
  // 创建空的广告SDK对象
  window.gdsdk = window.gdsdk || {
    showAd: function() { 
      console.log('模拟广告展示'); 
      return Promise.resolve({ success: true }); 
    },
    preloadAd: function() { 
      console.log('模拟广告预加载'); 
      return Promise.resolve({ success: true }); 
    },
    cancelAd: function() { 
      console.log('模拟广告取消'); 
      return Promise.resolve({ success: true }); 
    },
    showBanner: function() { 
      console.log('模拟横幅展示'); 
      return Promise.resolve({ success: true }); 
    }
  };
  
  // 阻止错误消息弹出
  window.addEventListener('error', function(e) {
    if (e.message && (
      e.message.includes('improvedigital') || 
      e.message.includes('azerioncircle') || 
      e.message.includes('doubleclick') ||
      e.message.includes('adtrafficquality') ||
      e.message.includes('JSON') ||
      e.message.includes('undefined')
    )) {
      console.log('已拦截广告相关错误:', e.message);
      e.preventDefault();
      e.stopPropagation();
      return true;
    }
  }, true);
  
  // 拦截脚本加载
  const originalCreateElement = document.createElement.bind(document);
  document.createElement = function(tagName) {
    const element = originalCreateElement(tagName);
    
    if (tagName.toLowerCase() === 'script') {
      const originalSetAttribute = element.setAttribute;
      element.setAttribute = function(name, value) {
        if (name === 'src' && (
          value && typeof value === 'string' && (
            value.includes('improvedigital.com') || 
            value.includes('azerioncircle.com') || 
            value.includes('doubleclick.net') ||
            value.includes('adtrafficquality.google') ||
            value.includes('pagead2.googlesyndication.com')
          )
        )) {
          console.log(`已拦截广告脚本: ${value}`);
          return element;
        }
        return originalSetAttribute.call(this, name, value);
      };
    }
    
    return element;
  };
  
  // 拦截iframe加载
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes) {
        mutation.addedNodes.forEach(function(node) {
          if (node.tagName === 'IFRAME') {
            const src = node.src;
            if (src && (
              src.includes('doubleclick.net') ||
              src.includes('googlesyndication.com')
            )) {
              console.log(`已拦截广告iframe: ${src}`);
              node.remove();
            }
          }
        });
      }
    });
  });
  
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
  
  console.log('广告拦截器初始化完成');
})(); 