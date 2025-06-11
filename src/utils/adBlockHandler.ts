/**
 * 广告拦截和第三方资源处理工具
 * 用于处理游戏中的广告加载错误和第三方资源限制问题
 */

/**
 * 检测是否安装了广告拦截器
 * @returns Promise<boolean> 是否检测到广告拦截器
 */
export async function detectAdBlocker(): Promise<boolean> {
  try {
    // 尝试加载一个模拟的广告资源
    const response = await fetch('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js', {
      method: 'HEAD',
      mode: 'no-cors',
      cache: 'no-store',
      signal: AbortSignal.timeout(2000) // 2秒超时
    });
    
    // 如果能够加载成功，可能没有广告拦截器
    return false;
  } catch (error) {
    // 如果加载失败，可能存在广告拦截器
    return true;
  }
}

/**
 * 创建一个模拟的广告响应
 * 用于在广告被拦截时提供替代内容，避免游戏加载错误
 */
export function createMockAdResponse() {
  // 拦截游戏广告请求
  if (typeof window !== 'undefined') {
    const originalFetch = window.fetch;
    
    window.fetch = async function(input, init) {
      const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input instanceof Request ? input.url : '';
      
      // 如果是广告相关请求
      if (
        url.includes('ads') || 
        url.includes('ad.') || 
        url.includes('analytics') || 
        url.includes('tracker') ||
        url.includes('monetization')
      ) {
        // 返回一个模拟的成功响应，避免游戏错误
        return new Response(JSON.stringify({ success: true, adDisplayed: false }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      // 对于其他请求，使用原始的fetch
      return originalFetch.apply(window, [input, init]);
    };
    
    // 在控制台中提供一个友好的消息
    console.info(
      '%c🎮 MindSeeye游戏系统 %c已拦截广告请求以提供更流畅的游戏体验',
      'background: #3182CE; color: white; padding: 2px 6px; border-radius: 4px 0 0 4px;',
      'background: #2D3748; color: white; padding: 2px 6px; border-radius: 0 4px 4px 0;'
    );
  }
}

/**
 * 修复第三方Cookie限制
 * 通过模拟第三方Cookie的功能来解决限制问题
 */
export function fixThirdPartyCookieIssues() {
  // 仅在浏览器环境执行
  if (typeof window === 'undefined') return;
  
  // 创建模拟的localStorage作为Cookie替代
  const virtualStorage = new Map<string, string>();
  
  // 模拟第三方Cookie的localStorage接口
  try {
    // 检查是否能访问localStorage
    window.localStorage.getItem('test');
    
    // 如果没有报错，尝试在iframe上下文中提供virtualStorage
    if (window.self !== window.top) {
      // 这是在iframe中
      const originalGetItem = Storage.prototype.getItem;
      const originalSetItem = Storage.prototype.setItem;
      
      // 重写getItem方法
      Storage.prototype.getItem = function(key: string) {
        try {
          return originalGetItem.call(this, key);
        } catch (e) {
          // 如果访问失败，使用虚拟存储
          return virtualStorage.get(key) || null;
        }
      };
      
      // 重写setItem方法
      Storage.prototype.setItem = function(key: string, value: string) {
        try {
          originalSetItem.call(this, key, value);
        } catch (e) {
          // 如果访问失败，使用虚拟存储
          virtualStorage.set(key, value);
        }
      };
      
      console.info(
        '%c🍪 MindSeeye游戏系统 %c已启用虚拟Cookie存储以解决第三方Cookie限制',
        'background: #38A169; color: white; padding: 2px 6px; border-radius: 4px 0 0 4px;',
        'background: #2D3748; color: white; padding: 2px 6px; border-radius: 0 4px 4px 0;'
      );
    }
  } catch (e) {
    // localStorage不可用，使用内存存储
    console.warn('localStorage不可用，使用内存存储作为备用');
    
    // 定义一个全局访问点
    (window as any).__mindseye_storage = virtualStorage;
  }
}

/**
 * 初始化处理程序
 * 设置所有必要的修复和拦截
 */
export function initAdAndCookieHandler() {
  // 创建模拟广告响应
  createMockAdResponse();
  
  // 修复第三方Cookie问题
  fixThirdPartyCookieIssues();
  
  // 检测广告拦截器
  detectAdBlocker().then(hasAdBlocker => {
    if (hasAdBlocker) {
      console.info(
        '%c⚠️ MindSeeye游戏系统 %c检测到广告拦截器，已启用兼容模式',
        'background: #ED8936; color: white; padding: 2px 6px; border-radius: 4px 0 0 4px;',
        'background: #2D3748; color: white; padding: 2px 6px; border-radius: 0 4px 4px 0;'
      );
    }
  });
} 