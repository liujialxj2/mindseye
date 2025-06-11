import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Maximize, Info, AlertCircle } from 'lucide-react';
import { Game } from '../../types/game';
import GameInstructions from './GameInstructions.tsx';
import {
  optimizeGameUrl,
  getIframeSandboxAttributes,
  getIframeAllowAttributes,
  checkBrowserCompatibility
} from '../../utils/gameProxyService';
import { initAdAndCookieHandler } from '../../utils/adBlockHandler';
import { getGameDirectUrl, getBackupGameUrl } from '../../utils/gameLoader';

/**
 * 游戏详情组件属性
 */
interface GameDetailProps {
  /**
   * 游戏数据
   */
  game: Game;
}

/**
 * 游戏详情组件
 * 用于展示游戏的详细信息和游戏界面
 */
export default function GameDetail({ game }: GameDetailProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [compatibilityWarning, setCompatibilityWarning] = useState<string | null>(null);
  const [gameError, setGameError] = useState<string | null>(null);
  const [usingBackupGame, setUsingBackupGame] = useState(false);
  
  // 游戏容器引用
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  
  // 初始化广告和Cookie处理程序
  useEffect(() => {
    if (isPlaying) {
      initAdAndCookieHandler();
    }
  }, [isPlaying]);
  
  // 检查浏览器兼容性
  useEffect(() => {
    const warning = checkBrowserCompatibility();
    setCompatibilityWarning(warning);
  }, []);
  
  // 监听全屏状态变化
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(
        Boolean(
          document.fullscreenElement ||
          document.webkitFullscreenElement ||
          document.mozFullScreenElement ||
          document.msFullscreenElement
        )
      );
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);
  
  // 处理全屏切换
  const handleFullscreen = () => {
    const gameContainer = document.getElementById('game-container') as HTMLElement;
    
    if (!gameContainer) return;
    
    if (!isFullscreen) {
      if (gameContainer.requestFullscreen) {
        gameContainer.requestFullscreen();
      } else if ((gameContainer as any).mozRequestFullScreen) {
        (gameContainer as any).mozRequestFullScreen();
      } else if ((gameContainer as any).webkitRequestFullscreen) {
        (gameContainer as any).webkitRequestFullscreen();
      } else if ((gameContainer as any).msRequestFullscreen) {
        (gameContainer as any).msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).mozCancelFullScreen) {
        (document as any).mozCancelFullScreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
    }
  };

  // 清理旧的iframe，避免DOM冲突
  const cleanupOldIframe = () => {
    if (gameContainerRef.current) {
      const existingIframes = gameContainerRef.current.querySelectorAll('iframe');
      existingIframes.forEach(iframe => {
        if (iframe !== iframeRef.current) {
          iframe.remove();
        }
      });
    }
  };
  
  // 加载备用游戏
  const loadBackupGame = () => {
    cleanupOldIframe();
    
    if (!gameContainerRef.current) return;
    
    try {
      // 创建新的iframe元素用于加载备用游戏
      const iframe = document.createElement('iframe');
      iframe.src = getBackupGameUrl(game.slug);
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.border = 'none';
      iframe.style.backgroundColor = '#000';
      iframe.allow = 'fullscreen; autoplay; clipboard-write; encrypted-media; gyroscope; accelerometer; picture-in-picture';
      iframe.allowFullscreen = true;
      
      // 保存引用
      iframeRef.current = iframe;
      
      // 清空容器并添加iframe
      gameContainerRef.current.innerHTML = '';
      gameContainerRef.current.appendChild(iframe);
      
      // 设置标志
      setUsingBackupGame(true);
      setIsLoading(false);
      
      // 监听加载事件
      iframe.onload = () => {
        setIsLoading(false);
      };
    } catch (error) {
      console.error('加载备用游戏失败:', error);
      setIsLoading(false);
      setGameError('无法加载游戏，请刷新页面重试');
    }
  };
  
  // 直接加载游戏
  const loadGameDirectly = () => {
    cleanupOldIframe();
    
    if (!gameContainerRef.current) return;
    
    try {
      // 创建新的iframe元素
      const iframe = document.createElement('iframe');
      iframe.src = getGameDirectUrl(game);
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.border = 'none';
      iframe.style.backgroundColor = '#000';
      iframe.allow = 'fullscreen; autoplay; clipboard-write; encrypted-media; gyroscope; accelerometer; picture-in-picture';
      iframe.allowFullscreen = true;
      
      // 不使用sandbox属性，避免过多限制
      // iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts allow-popups allow-forms allow-modals allow-pointer-lock allow-downloads allow-top-navigation');
      
      // 设置referrer policy
      iframe.referrerPolicy = 'origin';
      
      // 保存引用
      iframeRef.current = iframe;
      
      // 清空容器并添加iframe
      gameContainerRef.current.innerHTML = '';
      gameContainerRef.current.appendChild(iframe);
      
      // 监听加载事件
      iframe.onload = () => {
        setIsLoading(false);
      };
      
      // 监听错误事件
      iframe.onerror = () => {
        console.log('尝试加载备用游戏...');
        loadBackupGame();
      };

      // 设置加载超时，如果5秒后仍未加载完成，尝试备用游戏
      setTimeout(() => {
        if (isLoading) {
          console.log('游戏加载超时，切换到备用游戏');
          loadBackupGame();
        }
      }, 5000);
    } catch (error) {
      console.error('加载游戏失败:', error);
      loadBackupGame();
    }
  };
  
  // 开始游戏
  const startGame = () => {
    setIsPlaying(true);
    setIsLoading(true);
    setLoadingProgress(0);
    setGameError(null);
    setUsingBackupGame(false);
    
    // 模拟加载进度
    const loadingInterval = setInterval(() => {
      setLoadingProgress(prev => {
        const newProgress = prev + Math.random() * 15;
        if (newProgress >= 100) {
          clearInterval(loadingInterval);
          setTimeout(() => {
            loadGameDirectly();
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 300);
  };

  // 重新开始游戏
  const restartGame = () => {
    setIsPlaying(false);
    setGameError(null);
    setUsingBackupGame(false);
    
    // 清理旧iframe
    cleanupOldIframe();
    
    setTimeout(() => {
      startGame();
    }, 300);
  };
  
  // 组件卸载时清理
  useEffect(() => {
    return () => {
      cleanupOldIframe();
    };
  }, []);
  
  return (
    <div className="bg-gray-900 rounded-2xl p-6 border border-blue-500/30">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">
          {game.title} {usingBackupGame && <span className="text-yellow-500 text-sm">(备用版本)</span>}
        </h1>
        <p className="text-gray-300">
          {game.description}
        </p>
      </div>
      
      {/* 兼容性警告 */}
      {compatibilityWarning && (
        <div className="mb-4 p-3 bg-yellow-900/30 border border-yellow-600/50 rounded-lg flex items-start">
          <AlertCircle className="w-5 h-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
          <p className="text-yellow-200 text-sm">{compatibilityWarning}</p>
        </div>
      )}
      
      {/* 游戏亮点 */}
      {game.highlights && game.highlights.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-400 mb-2">游戏亮点</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {game.highlights.map((highlight, index) => (
              <li key={index} className="flex items-start">
                <div className="mr-2 mt-1 text-green-400">✓</div>
                <div className="text-gray-300">{highlight}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* 游戏说明 */}
      {showInstructions && (
        <GameInstructions instructions={game.instructions} />
      )}
      
      {/* 游戏区域 */}
      <div 
        id="game-container"
        ref={gameContainerRef}
        className="bg-black rounded-xl overflow-hidden border border-blue-500/20 mb-6 aspect-video w-full relative"
      >
        {isPlaying ? (
          /* 游戏加载中显示进度条 */
          isLoading && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
              <div className="w-64 h-3 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-300"
                  style={{ width: `${loadingProgress}%` }}
                ></div>
              </div>
              <p className="text-white mt-3">游戏加载中...{Math.floor(loadingProgress)}%</p>
            </div>
          )
        ) : (
          <div 
            className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center"
            style={{
              backgroundImage: `url(${game.thumbnailUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="text-center p-6 bg-black/70 backdrop-blur-sm rounded-xl">
              <button 
                className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4 mx-auto cursor-pointer hover:scale-110 transition-transform"
                onClick={startGame}
              >
                <Play className="w-12 h-12 text-white" />
              </button>
              <h3 className="text-xl font-bold text-white mb-2">准备好了吗？</h3>
              <p className="text-gray-400">点击开始按钮开始游戏</p>
            </div>
          </div>
        )}
        
        {/* 错误提示 */}
        {gameError && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 p-4">
            <div className="bg-red-900/50 border border-red-500/50 rounded-lg p-4 max-w-md text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-white mb-2">游戏加载失败</h3>
              <p className="text-gray-300 mb-4">{gameError}</p>
              <div className="flex justify-center gap-4">
                <button 
                  onClick={restartGame}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  重试
                </button>
                <button 
                  onClick={loadBackupGame}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  加载备用版本
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* 游戏控制 */}
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <div className="flex flex-wrap gap-4">
          <button 
            className={`flex items-center space-x-2 px-4 py-2 ${isPlaying ? 'bg-gray-700' : 'bg-blue-600'} text-white rounded-lg hover:brightness-110 transition-all`}
            onClick={isPlaying ? restartGame : startGame}
          >
            {isPlaying ? (
              <>
                <RotateCcw className="w-4 h-4" />
                <span>重新开始</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>开始游戏</span>
              </>
            )}
          </button>
          
          {isPlaying && (
            <button 
              className="flex items-center space-x-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              onClick={handleFullscreen}
            >
              <Maximize className="w-4 h-4" />
              <span>全屏</span>
            </button>
          )}
          
          <button 
            className={`flex items-center space-x-2 px-4 py-2 ${showInstructions ? 'bg-blue-600' : 'bg-gray-700'} text-white rounded-lg hover:brightness-110 transition-all`}
            onClick={() => setShowInstructions(!showInstructions)}
          >
            <Info className="w-4 h-4" />
            <span>{showInstructions ? '隐藏说明' : '查看说明'}</span>
          </button>
        </div>
        
        <div>
          <p className="text-xs text-gray-500">
            {usingBackupGame ? 
              '当前使用备用游戏版本。这是一个简化版，可能与原版功能有所不同。' : 
              '注意：游戏可能需要一些时间加载。如果遇到问题，请尝试刷新页面或更换浏览器。'
            }
          </p>
        </div>
      </div>
    </div>
  );
} 