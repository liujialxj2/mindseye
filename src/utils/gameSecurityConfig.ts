/**
 * 游戏安全配置工具
 * 用于设置正确的Content Security Policy和其他安全相关配置
 */

/**
 * 初始化所有游戏安全配置
 */
export function initGameSecurity(): void {
  // 由于我们已在index.html中设置了最宽松的CSP
  // 这里不再需要额外设置，仅记录一下
  console.log('游戏安全配置已通过HTML头部初始化');
} 