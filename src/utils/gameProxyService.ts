/**
 * 游戏代理服务
 * 用于优化游戏iframe加载，处理跨域问题
 */

/**
 * 优化游戏URL，添加必要的参数
 * @param url 原始游戏URL
 * @returns 优化后的URL
 */
export function optimizeGameUrl(url: string): string {
  try {
    const gameUrl = new URL(url);
    
    // 添加通用参数
    gameUrl.searchParams.append('referrer', window.location.origin);
    gameUrl.searchParams.append('origin', window.location.origin);
    
    // 根据不同游戏域名添加特定参数
    if (gameUrl.hostname.includes('gamedistribution.com')) {
      gameUrl.searchParams.set('gd_sdk_referrer_url', window.location.origin);
      gameUrl.searchParams.append('gd_zone_config', 'eyJhZFRpbWVvdXQiOjgwMDAsImRpc2FibGVNcmFpZCI6dHJ1ZSwiZm9yY2VBRCI6ZmFsc2V9');
    }
    
    if (gameUrl.hostname.includes('minecraft')) {
      gameUrl.searchParams.append('allowScripts', 'true');
      gameUrl.searchParams.append('allowStorage', 'true');
    }
    
    return gameUrl.toString();
  } catch (error) {
    console.error('处理游戏URL时出错:', error);
    return url; // 如果处理失败，返回原始URL
  }
}

/**
 * 配置iframe的沙盒属性
 * @param gameUrl 游戏URL
 * @returns 适合该游戏的沙盒属性值
 */
export function getIframeSandboxAttributes(gameUrl: string): string {
  // 基础沙盒属性
  const baseSandbox = 'allow-scripts allow-same-origin allow-popups allow-forms';
  
  // 根据游戏URL添加特定权限
  if (
    gameUrl.includes('gamedistribution.com') || 
    gameUrl.includes('crazygames.com')
  ) {
    return `${baseSandbox} allow-modals allow-orientation-lock allow-pointer-lock`;
  }
  
  return baseSandbox;
}

/**
 * 生成iframe的allow属性
 * @returns iframe的allow属性值
 */
export function getIframeAllowAttributes(): string {
  return 'fullscreen; microphone; camera; autoplay; clipboard-write; encrypted-media; gyroscope; accelerometer; picture-in-picture';
}

/**
 * 处理iframe加载错误
 * @param error 错误对象
 * @returns 可读的错误信息
 */
export function handleIframeError(error: any): string {
  console.error('游戏加载出错:', error);
  
  if (error?.name === 'SecurityError') {
    return '由于浏览器安全策略限制，无法加载游戏。请尝试使用Chrome浏览器或禁用广告拦截器。';
  }
  
  return '游戏加载失败。请刷新页面重试，或尝试使用其他浏览器。';
}

/**
 * 检查浏览器兼容性
 * @returns 浏览器兼容性问题消息，如果没有问题则返回null
 */
export function checkBrowserCompatibility(): string | null {
  // 检查是否支持localStorage
  try {
    window.localStorage.setItem('test', 'test');
    window.localStorage.removeItem('test');
  } catch (e) {
    return '您的浏览器禁用了localStorage，这可能会影响游戏进度保存。';
  }
  
  // 检查第三方Cookie限制
  const isChrome = navigator.userAgent.indexOf('Chrome') > -1;
  const hasThirdPartyCookieRestriction = 
    isChrome && 
    navigator.cookieEnabled && 
    document.cookie.indexOf('test_third_party=1') === -1;
  
  if (hasThirdPartyCookieRestriction) {
    return '您的浏览器可能限制了第三方Cookie，某些游戏功能可能受限。';
  }
  
  return null;
} 