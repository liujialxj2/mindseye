/**
 * 游戏直接加载器
 * 通过直接加载游戏而不是使用iframe来解决跨域问题
 */

import { Game } from '../types/game';

/**
 * 定义内置游戏列表
 * 为常见的HTML5游戏提供直接访问URL
 */
const BUILT_IN_GAMES: Record<string, string> = {
  '2048': 'https://play2048.co/',
  'slope': 'https://slope-game.com/',
  'cookie-clicker': 'https://orteil.dashnet.org/cookieclicker/',
  'minecraft-classic': 'https://classic.minecraft.net/?bypass=true',
  'tower-defense': 'https://www.crazygames.com/game/tower-defense',
  'basketball-stars': 'https://www.crazygames.com/game/basketball-stars'
};

/**
 * 定义备用游戏
 * 当远程游戏加载失败时使用
 */
const BACKUP_GAMES: Record<string, string> = {
  '2048': '/backup-games/2048.html',
  'default': '/backup-games/2048.html'
};

/**
 * 检测URL中的游戏服务供应商
 * @param url 游戏URL
 * @returns 检测到的服务供应商名称
 */
function detectGameProvider(url: string): string {
  if (!url) return 'unknown';
  
  if (url.includes('crazygames.com')) return 'crazygames';
  if (url.includes('gamedistribution.com')) return 'gamedistribution';
  if (url.includes('poki.com')) return 'poki';
  if (url.includes('y8.com')) return 'y8';
  if (url.includes('miniclip.com')) return 'miniclip';
  if (url.includes('kongregate.com')) return 'kongregate';
  
  return 'unknown';
}

/**
 * 处理CrazyGames链接
 * @param url 原始URL
 * @returns 处理后的URL
 */
function handleCrazyGamesUrl(url: string): string {
  // 提取游戏ID
  const gameIdMatch = url.match(/game\/([a-zA-Z0-9-]+)/);
  if (gameIdMatch && gameIdMatch[1]) {
    const gameId = gameIdMatch[1];
    return `https://www.crazygames.com/embed/${gameId}`;
  }
  return url;
}

/**
 * 处理GameDistribution链接
 * @param url 原始URL
 * @returns 处理后的URL
 */
function handleGameDistributionUrl(url: string): string {
  // 确保是嵌入版本
  if (url.includes('html5.gamedistribution.com')) {
    return url;
  }
  
  // 提取游戏ID
  const gameIdMatch = url.match(/[?&]gd_sdk_referrer_url=([^&]+)/);
  if (gameIdMatch && gameIdMatch[1]) {
    const decodedUrl = decodeURIComponent(gameIdMatch[1]);
    return decodedUrl;
  }
  
  return url;
}

/**
 * 获取游戏的直接加载URL
 * @param game 游戏数据
 * @returns 可用于直接加载的URL
 */
export function getGameDirectUrl(game: Game): string {
  // 检查是否有内置版本
  if (BUILT_IN_GAMES[game.slug]) {
    return BUILT_IN_GAMES[game.slug];
  }

  // 获取游戏提供商
  const provider = detectGameProvider(game.embedUrl);
  
  // 根据不同提供商处理URL
  let url = game.embedUrl;
  
  switch (provider) {
    case 'crazygames':
      url = handleCrazyGamesUrl(url);
      break;
    case 'gamedistribution':
      url = handleGameDistributionUrl(url);
      break;
    default:
      // 为其他提供商添加参数
      try {
        const urlObj = new URL(url);
        urlObj.searchParams.append('embed', 'true');
        urlObj.searchParams.append('allowfullscreen', 'true');
        url = urlObj.toString();
      } catch {
        // 无法解析URL，使用原始URL
      }
      break;
  }
  
  return url;
}

/**
 * 获取备用游戏URL
 * 当游戏加载失败时可以使用备用游戏
 * @param slug 游戏标识
 * @returns 备用游戏URL
 */
export function getBackupGameUrl(slug: string): string {
  return BACKUP_GAMES[slug] || BACKUP_GAMES.default;
}

/**
 * 使用iframe代理加载游戏
 * @param container 游戏容器元素
 * @param game 游戏数据
 */
export function loadGameInProxy(container: HTMLElement, game: Game): void {
  // 创建iframe
  const iframe = document.createElement('iframe');
  
  // 设置iframe属性
  iframe.src = getGameDirectUrl(game);
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.border = 'none';
  iframe.style.backgroundColor = '#000';
  iframe.allow = 'fullscreen; microphone; camera; autoplay; clipboard-write; encrypted-media; gyroscope; accelerometer; picture-in-picture';
  iframe.allowFullscreen = true;
  
  // 使用最少的sandbox限制
  iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts allow-popups allow-forms allow-modals allow-pointer-lock allow-downloads allow-top-navigation');
  
  // 设置referrer policy
  iframe.referrerPolicy = 'origin';
  
  // 清空容器并添加iframe
  container.innerHTML = '';
  container.appendChild(iframe);
}

/**
 * 直接注入游戏到容器中
 * 通过创建一个新的HTML页面来加载游戏，避免iframe限制
 * @param container 游戏容器元素
 * @param game 游戏数据
 */
export function loadGameDirect(container: HTMLElement, game: Game): void {
  // 创建新的HTML内容
  const gameHtml = `
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${game.title}</title>
      <style>
        body, html { 
          margin: 0; 
          padding: 0; 
          width: 100%; 
          height: 100%; 
          overflow: hidden; 
          background-color: #000;
        }
        iframe {
          width: 100%;
          height: 100%;
          border: none;
        }
        .game-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        .loading {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.8);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: white;
          z-index: 100;
        }
        .progress {
          width: 200px;
          height: 8px;
          background-color: #333;
          border-radius: 4px;
          margin-bottom: 10px;
          overflow: hidden;
        }
        .progress-bar {
          height: 100%;
          background: linear-gradient(to right, #3182CE, #805AD5);
          width: 0%;
          transition: width 0.3s;
        }
      </style>
    </head>
    <body>
      <div class="game-container">
        <iframe 
          src="${getGameDirectUrl(game)}"
          allow="fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
          referrerpolicy="origin"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals allow-pointer-lock">
        </iframe>
      </div>
      <div class="loading" id="loading">
        <div class="progress">
          <div class="progress-bar" id="progress-bar"></div>
        </div>
        <div id="loading-text">游戏加载中... 0%</div>
      </div>
      <script>
        // 模拟加载进度
        let progress = 0;
        const progressBar = document.getElementById('progress-bar');
        const loadingText = document.getElementById('loading-text');
        const loading = document.getElementById('loading');
        
        const interval = setInterval(() => {
          progress += Math.random() * 15;
          if (progress >= 100) {
            clearInterval(interval);
            progress = 100;
            setTimeout(() => {
              loading.style.display = 'none';
            }, 500);
          }
          progressBar.style.width = progress + '%';
          loadingText.textContent = '游戏加载中... ' + Math.floor(progress) + '%';
        }, 300);
        
        // 模拟localStorage
        const originalGetItem = Storage.prototype.getItem;
        const originalSetItem = Storage.prototype.setItem;
        const virtualStorage = {};
        
        Storage.prototype.getItem = function(key) {
          try {
            return originalGetItem.call(this, key);
          } catch (e) {
            return virtualStorage[key] || null;
          }
        };
        
        Storage.prototype.setItem = function(key, value) {
          try {
            originalSetItem.call(this, key, value);
          } catch (e) {
            virtualStorage[key] = value;
          }
        };
        
        // 拦截广告请求
        const originalFetch = window.fetch;
        window.fetch = function(input, init) {
          const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input instanceof Request ? input.url : '';
          if (url.includes('ads') || url.includes('ad.') || url.includes('analytics') || url.includes('tracker')) {
            return Promise.resolve(new Response(JSON.stringify({ success: true }), { status: 200 }));
          }
          return originalFetch.apply(window, [input, init]);
        };
      </script>
    </body>
    </html>
  `;
  
  // 使用blob URL作为iframe源
  const blob = new Blob([gameHtml], { type: 'text/html' });
  const blobUrl = URL.createObjectURL(blob);
  
  // 创建iframe
  const iframe = document.createElement('iframe');
  iframe.src = blobUrl;
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.border = 'none';
  iframe.style.backgroundColor = '#000';
  iframe.allow = 'fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
  iframe.allowFullscreen = true;
  
  // 清空容器并添加iframe
  container.innerHTML = '';
  container.appendChild(iframe);
  
  // 在iframe加载完成后释放blob URL
  iframe.onload = () => {
    URL.revokeObjectURL(blobUrl);
  };
}

/**
 * 尝试下载并保存嵌入式游戏资源
 * @param game 游戏数据
 */
export async function downloadEmbeddedGame(game: Game): Promise<string> {
  try {
    // 获取游戏HTML
    const response = await fetch(game.embedUrl);
    const html = await response.text();
    
    // 创建blob
    const blob = new Blob([html], { type: 'text/html' });
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('下载游戏资源失败:', error);
    return game.embedUrl;
  }
} 