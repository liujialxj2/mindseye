import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Maximize, Info } from 'lucide-react';
import { Game } from '../../types/game';
import GameInstructions from './GameInstructions';

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
    const iframe = document.getElementById('game-iframe') as HTMLElement;
    
    if (!iframe) return;
    
    if (!isFullscreen) {
      if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
      } else if ((iframe as any).mozRequestFullScreen) {
        (iframe as any).mozRequestFullScreen();
      } else if ((iframe as any).webkitRequestFullscreen) {
        (iframe as any).webkitRequestFullscreen();
      } else if ((iframe as any).msRequestFullscreen) {
        (iframe as any).msRequestFullscreen();
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
  
  return (
    <div className="bg-gray-900 rounded-2xl p-6 border border-blue-500/30">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">
          {game.title}
        </h1>
        <p className="text-gray-300">
          {game.description}
        </p>
      </div>
      
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
      <div className="bg-black rounded-xl overflow-hidden border border-blue-500/20 mb-6">
        {isPlaying ? (
          <div className="aspect-video w-full h-full relative">
            <iframe 
              id="game-iframe"
              src={game.embedUrl} 
              title={game.title}
              className="w-full h-full"
              allow="fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              frameBorder="0"
              scrolling="no"
            ></iframe>
          </div>
        ) : (
          <div 
            className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center"
            style={{
              backgroundImage: `url(${game.thumbnailUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="text-center p-6 bg-black/70 backdrop-blur-sm rounded-xl">
              <button 
                className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4 mx-auto cursor-pointer hover:scale-110 transition-transform"
                onClick={() => setIsPlaying(true)}
              >
                <Play className="w-12 h-12 text-white" />
              </button>
              <h3 className="text-xl font-bold text-white mb-2">准备好了吗？</h3>
              <p className="text-gray-400">点击开始按钮开始游戏</p>
            </div>
          </div>
        )}
      </div>
      
      {/* 游戏控制 */}
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <div className="flex gap-4">
          <button 
            className={`flex items-center space-x-2 px-4 py-2 ${isPlaying ? 'bg-gray-700' : 'bg-blue-600'} text-white rounded-lg hover:brightness-110 transition-all`}
            onClick={() => setIsPlaying(!isPlaying)}
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
      </div>
    </div>
  );
} 