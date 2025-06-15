/**
 * GameDistribution 游戏适配器
 * 此脚本帮助解决第三方cookie和iframe权限问题
 */

(function() {
  // 虚拟localStorage，用于在第三方Cookie被禁用时提供备选存储
  let virtualStorage = {};
  
  // 检测第三方Cookie是否可用
  function checkThirdPartyCookies() {
    return new Promise((resolve) => {
      const testKey = 'gd_cookie_test';
      const testValue = 'test_value_' + Date.now();
      
      try {
        // 尝试设置cookie
        document.cookie = `${testKey}=${testValue}; path=/; SameSite=None; Secure`;
        
        // 检查cookie是否被设置
        const cookieSet = document.cookie.indexOf(testKey) !== -1;
        
        // 清除测试cookie
        document.cookie = `${testKey}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=None; Secure`;
        
        resolve(cookieSet);
      } catch (e) {
        console.warn('Cookie测试失败:', e);
        resolve(false);
      }
    });
  }
  
  // 初始化虚拟存储系统
  function initVirtualStorage() {
    // 尝试从sessionStorage恢复数据
    try {
      const savedData = sessionStorage.getItem('gd_virtual_storage');
      if (savedData) {
        virtualStorage = JSON.parse(savedData);
      }
    } catch (e) {
      console.warn('无法从sessionStorage恢复虚拟存储:', e);
    }
    
    // 创建虚拟localStorage API
    window.gdVirtualStorage = {
      getItem: function(key) {
        return virtualStorage[key] || null;
      },
      setItem: function(key, value) {
        virtualStorage[key] = String(value);
        // 尝试保存到sessionStorage
        try {
          sessionStorage.setItem('gd_virtual_storage', JSON.stringify(virtualStorage));
        } catch (e) {
          console.warn('无法保存虚拟存储到sessionStorage:', e);
        }
      },
      removeItem: function(key) {
        delete virtualStorage[key];
        // 更新sessionStorage
        try {
          sessionStorage.setItem('gd_virtual_storage', JSON.stringify(virtualStorage));
        } catch (e) {
          console.warn('无法更新sessionStorage中的虚拟存储:', e);
        }
      },
      clear: function() {
        virtualStorage = {};
        // 清除sessionStorage
        try {
          sessionStorage.removeItem('gd_virtual_storage');
        } catch (e) {
          console.warn('无法清除sessionStorage中的虚拟存储:', e);
        }
      }
    };
  }

  // 初始化GameDistribution适配器
  async function initGameDistributionAdapter() {
    // 检查第三方Cookie支持
    const cookiesEnabled = await checkThirdPartyCookies();
    console.log('第三方Cookie ' + (cookiesEnabled ? '已启用' : '已禁用'));
    
    // 如果第三方Cookie被禁用，初始化虚拟存储
    if (!cookiesEnabled) {
      initVirtualStorage();
      console.log('GameDistribution适配器已初始化，使用虚拟localStorage');
      
      // 显示Cookie警告
      setTimeout(() => {
        const cookieWarning = document.createElement('div');
        cookieWarning.style.position = 'fixed';
        cookieWarning.style.bottom = '0';
        cookieWarning.style.left = '0';
        cookieWarning.style.right = '0';
        cookieWarning.style.padding = '10px';
        cookieWarning.style.backgroundColor = 'rgba(0,0,0,0.8)';
        cookieWarning.style.color = 'white';
        cookieWarning.style.textAlign = 'center';
        cookieWarning.style.zIndex = '9999';
        cookieWarning.style.fontSize = '14px';
        cookieWarning.innerHTML = '第三方Cookie在Chrome中被阻止，可能影响游戏保存功能。请在浏览器设置中允许第三方Cookie以获得最佳体验。<button style="margin-left:10px;padding:5px 10px;background:#4a90e2;border:none;color:white;border-radius:4px;cursor:pointer" onclick="this.parentNode.style.display=\'none\'">我知道了</button>';
        document.body.appendChild(cookieWarning);
      }, 2000);
    } else {
      console.log('GameDistribution适配器已初始化，使用虚拟localStorage');
    }
    
    // 监听GameDistribution API错误
    window.addEventListener('message', function(event) {
      try {
        if (event.data && typeof event.data === 'string') {
          const data = JSON.parse(event.data);
          
          // 检测GameDistribution错误
          if (data.type === 'error' || (data.message && data.message.includes('error'))) {
            console.error('GameDistribution错误:', data);
            handleGameDistributionError(data);
          }
        }
      } catch (e) {
        // 忽略非JSON消息
      }
    });
    
    // 处理window.gdsdk对象
    const originalGdsdkGetter = Object.getOwnPropertyDescriptor(window, 'gdsdk');
    if (originalGdsdkGetter) {
      Object.defineProperty(window, 'gdsdk', {
        get: function() {
          const originalSdk = originalGdsdkGetter.get ? originalGdsdkGetter.get.call(window) : originalGdsdkGetter.value;
          
          // 如果SDK不存在或不完整，提供一个模拟版本
          if (!originalSdk || typeof originalSdk !== 'object') {
            return createFallbackSdk();
          }
          
          // 增强现有SDK
          return enhanceSdk(originalSdk);
        },
        configurable: true
      });
    }
  }
  
  // 处理GameDistribution错误
  function handleGameDistributionError(error) {
    console.error('GameDistribution错误:', error);
    console.log('尝试从GameDistribution错误中恢复...');
    
    // 尝试恢复策略
    // 1. 检查iframe是否存在
    const gameFrames = document.querySelectorAll('iframe[src*="gamedistribution"], iframe[src*="html5.api"]');
    if (gameFrames.length > 0) {
      console.log('找到游戏iframe，尝试刷新...');
      gameFrames.forEach(frame => {
        try {
          // 保存当前src
          const currentSrc = frame.src;
          
          // 添加时间戳参数以避免缓存
          const refreshedSrc = currentSrc.includes('?') 
            ? `${currentSrc}&refresh=${Date.now()}` 
            : `${currentSrc}?refresh=${Date.now()}`;
          
          // 刷新iframe
          setTimeout(() => {
            frame.src = refreshedSrc;
          }, 1000);
        } catch (e) {
          console.error('刷新iframe失败:', e);
        }
      });
    }
    
    // 2. 检查是否需要重新加载SDK
    if (window.GD_OPTIONS && typeof window.GD_OPTIONS === 'object') {
      console.log('尝试重新加载GameDistribution SDK...');
      
      // 移除旧的SDK脚本
      const oldScripts = document.querySelectorAll('script[src*="gamedistribution"], script[src*="main.min.js"]');
      oldScripts.forEach(script => {
        script.parentNode.removeChild(script);
      });
      
      // 重新加载SDK
      setTimeout(() => {
        const gdScript = document.createElement('script');
        gdScript.src = 'https://html5.api.gamedistribution.com/main.min.js';
        document.head.appendChild(gdScript);
      }, 1500);
    }
  }
  
  // 创建备用SDK
  function createFallbackSdk() {
    return {
      showAd: function(adType) {
        console.log('备用SDK: 显示广告请求被拦截 -', adType);
        return new Promise((resolve) => {
          // 模拟广告完成
          setTimeout(() => {
            resolve({ adType: adType, success: true });
          }, 500);
        });
      },
      showBanner: function() {
        console.log('备用SDK: 显示横幅请求被拦截');
        return new Promise((resolve) => {
          resolve({ success: true });
        });
      },
      preloadAd: function(adType) {
        console.log('备用SDK: 预加载广告请求被拦截 -', adType);
        return new Promise((resolve) => {
          resolve({ adType: adType, success: true });
        });
      },
      cancelAd: function() {
        console.log('备用SDK: 取消广告请求被拦截');
        return new Promise((resolve) => {
          resolve({ success: true });
        });
      },
      openConsole: function() {
        console.log('备用SDK: 打开控制台请求被拦截');
      }
    };
  }
  
  // 增强现有SDK
  function enhanceSdk(originalSdk) {
    // 创建一个代理，拦截所有方法调用
    return new Proxy(originalSdk, {
      get: function(target, prop) {
        const original = target[prop];
        
        // 如果是函数，包装它以添加错误处理
        if (typeof original === 'function') {
          return function(...args) {
            try {
              const result = original.apply(target, args);
              
              // 如果返回Promise，添加错误处理
              if (result && typeof result.then === 'function') {
                return result.catch(error => {
                  console.error(`GameDistribution SDK错误 (${prop}):`, error);
                  
                  // 为特定方法提供备用行为
                  if (prop === 'showAd') {
                    console.log('广告显示失败，提供备用行为');
                    return { adType: args[0] || 'rewarded', success: true };
                  }
                  
                  throw error;
                });
              }
              
              return result;
            } catch (error) {
              console.error(`GameDistribution SDK错误 (${prop}):`, error);
              throw error;
            }
          };
        }
        
        return original;
      }
    });
  }
  
  // 启动适配器
  window.addEventListener('DOMContentLoaded', function() {
    initGameDistributionAdapter().catch(error => {
      console.error('GameDistribution适配器初始化失败:', error);
    });
  });
})(); 