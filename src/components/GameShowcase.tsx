import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Trophy, Users, Maximize, Info } from 'lucide-react';
import GameDistributionFrame from './GameDistributionFrame';

// 为不同浏览器的全屏API扩展类型定义
declare global {
  interface HTMLElement {
    mozRequestFullScreen?: () => Promise<void>;
    webkitRequestFullscreen?: () => Promise<void>;
    msRequestFullscreen?: () => Promise<void>;
  }

  interface Document {
    mozFullScreenElement?: Element;
    webkitFullscreenElement?: Element;
    msFullscreenElement?: Element;
    mozCancelFullScreen?: () => Promise<void>;
    webkitExitFullscreen?: () => Promise<void>;
    msExitFullscreen?: () => Promise<void>;
  }
}

const GameShowcase = () => {
  const [activeGame, setActiveGame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const gameFrameRef = useRef<HTMLDivElement>(null);

  // 获取当前域名，用于 GameDistribution 集成
  const currentDomain = typeof window !== 'undefined' ? window.location.origin : 'https://www.mindseye.cool';

  // 精选游戏数据
  const games = [
    {
      id: 'perception-puzzle',
      title: '知觉拼图',
      description: '在这款引人入胜的游戏中测试你的知觉能力。识别模式、解决视觉谜题，提升你的观察技巧。',
      instructions: '使用鼠标点击匹配的图形。在时间结束前找出所有匹配项，以获得最高分。\n\n技巧：先专注于边缘部分，再向中心移动。',
      thumbnailUrl: 'https://img.gamedistribution.com/62381d033e714230acd2147b60a24550-512x384.jpg',
      embedUrl: 'https://html5.gamedistribution.com/62381d033e714230acd2147b60a24550/',
      highScore: 2840,
      onlinePlayers: 143,
      isGameDistribution: true
    },
    {
      id: 'memory-maze',
      title: '记忆迷宫',
      description: '一款测试你的空间记忆能力的挑战性游戏。记住路径，避开障碍，找到通往下一关的道路。',
      instructions: '使用方向键或WASD移动。记住迷宫的布局，并在黑暗环境中找到出口。\n\n每一关的难度都会增加，保持专注！',
      thumbnailUrl: 'https://img.gamedistribution.com/6c82ded251754899bace3d781d03d607-512x384.jpg',
      embedUrl: 'https://html5.gamedistribution.com/6c82ded251754899bace3d781d03d607/',
      highScore: 1560,
      onlinePlayers: 95,
      isGameDistribution: true
    },
    {
      id: 'pattern-recognition',
      title: '图案识别',
      description: '提高你的图案识别能力。在这款游戏中，你需要在不断变化的背景中识别隐藏的图案。',
      instructions: '观察屏幕上显示的图案，然后在接下来的选项中选择匹配的一项。\n\n随着关卡的进展，图案会变得更加复杂，背景干扰也会增加。',
      thumbnailUrl: 'https://img.gamedistribution.com/5ecf233acb5a453bb50dbcb77df39df8-512x384.jpg',
      embedUrl: 'https://html5.gamedistribution.com/5ecf233acb5a453bb50dbcb77df39df8/',
      highScore: 3250,
      onlinePlayers: 128,
      isGameDistribution: true
    }
  ];

  // 处理游戏加载事件
  const handleGameLoaded = () => {
    console.log('游戏加载完成');
  };

  // 处理游戏错误事件
  const handleGameError = (error: string) => {
    console.error('游戏加载错误:', error);
  };

  // 处理全屏
  const handleFullscreen = () => {
    if (!gameFrameRef.current) return;
    
    if (!isFullscreen) {
      if (gameFrameRef.current.requestFullscreen) {
        gameFrameRef.current.requestFullscreen();
      } else if ((gameFrameRef.current as any).mozRequestFullScreen) {
        (gameFrameRef.current as any).mozRequestFullScreen();
      } else if ((gameFrameRef.current as any).webkitRequestFullscreen) {
        (gameFrameRef.current as any).webkitRequestFullscreen();
      } else if ((gameFrameRef.current as any).msRequestFullscreen) {
        (gameFrameRef.current as any).msRequestFullscreen();
      }
      setIsFullscreen(true);
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
      setIsFullscreen(false);
    }
  };

  // 监听全屏变化事件
  useEffect(() => {
    const fullscreenChangeHandler = () => {
      setIsFullscreen(
        !!document.fullscreenElement ||
        !!(document as any).mozFullScreenElement ||
        !!(document as any).webkitFullscreenElement ||
        !!(document as any).msFullscreenElement
      );
    };

    document.addEventListener('fullscreenchange', fullscreenChangeHandler);
    document.addEventListener('mozfullscreenchange', fullscreenChangeHandler);
    document.addEventListener('webkitfullscreenchange', fullscreenChangeHandler);
    document.addEventListener('MSFullscreenChange', fullscreenChangeHandler);

    return () => {
      document.removeEventListener('fullscreenchange', fullscreenChangeHandler);
      document.removeEventListener('mozfullscreenchange', fullscreenChangeHandler);
      document.removeEventListener('webkitfullscreenchange', fullscreenChangeHandler);
      document.removeEventListener('MSFullscreenChange', fullscreenChangeHandler);
    };
  }, []);

  return (
    <section id="games" className="py-20 bg-black relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            体验精选小游戏
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            沉浸在这些为 Mindseye 宇宙设计的小游戏中，训练你的感知能力，为完整的游戏体验做好准备。
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* 游戏选择器 */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {games.map((game, index) => (
              <button
                key={index}
                onClick={() => {
                  setActiveGame(index);
                  setIsPlaying(false); // 切换游戏时重置播放状态
                  setShowInstructions(false); // 隐藏说明
                }}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  activeGame === index
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {game.title}
              </button>
            ))}
          </div>

          {/* 游戏显示区域 */}
          <div className="bg-gray-900 rounded-2xl p-6 border border-blue-500/30">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">
                {games[activeGame].title}
              </h3>
              <p className="text-gray-300">
                {games[activeGame].description}
              </p>
            </div>

            {/* 游戏说明 */}
            {showInstructions && (
              <div className="bg-gray-800 rounded-xl p-4 mb-6 border border-blue-500/20">
                <h4 className="text-lg font-semibold text-blue-400 mb-2">游戏说明</h4>
                <p className="text-gray-300 whitespace-pre-line">
                  {games[activeGame].instructions}
                </p>
              </div>
            )}

            {/* 游戏框架 */}
            <div ref={gameFrameRef} className="bg-black rounded-xl overflow-hidden border border-blue-500/20 mb-6">
              {isPlaying ? (
                <div className="aspect-video w-full h-full">
                  {games[activeGame].isGameDistribution ? (
                    <GameDistributionFrame
                      gameId={games[activeGame].id}
                      gameUrl={games[activeGame].embedUrl}
                      title={games[activeGame].title}
                      onGameLoaded={handleGameLoaded}
                      onGameError={handleGameError}
                    />
                  ) : (
                    <iframe 
                      id="game-iframe"
                      src={games[activeGame].embedUrl} 
                      title={games[activeGame].title}
                      className="w-full h-full"
                      allow="fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      frameBorder="0"
                      scrolling="no"
                    ></iframe>
                  )}
                </div>
              ) : (
                <div 
                  className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center"
                  style={{
                    backgroundImage: `url(${games[activeGame].thumbnailUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  <div className="text-center p-6 bg-black/70 backdrop-blur-sm rounded-xl">
                    <div 
                      className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4 mx-auto cursor-pointer hover:scale-110 transition-transform"
                      onClick={() => setIsPlaying(true)}
                    >
                      <Play className="w-12 h-12 text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2">准备好了吗？</h4>
                    <p className="text-gray-400">点击播放按钮开始你的冒险</p>
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
                      <RotateCcw className="w-4 h-4 mr-2" />
                      <span>重新开始</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      <span>开始</span>
                    </>
                  )}
                </button>
                
                {isPlaying && (
                  <button 
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    onClick={handleFullscreen}
                  >
                    <Maximize className="w-4 h-4 mr-2" />
                    <span>全屏</span>
                  </button>
                )}
                
                <button 
                  className={`flex items-center space-x-2 px-4 py-2 ${showInstructions ? 'bg-blue-600' : 'bg-gray-700'} text-white rounded-lg hover:brightness-110 transition-all`}
                  onClick={() => setShowInstructions(!showInstructions)}
                >
                  <Info className="w-4 h-4 mr-2" />
                  <span>{showInstructions ? '隐藏说明' : '查看说明'}</span>
                </button>
              </div>
              
              <div className="flex items-center space-x-6 text-gray-300">
                <div className="flex items-center space-x-2">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  <span>最高分: {games[activeGame].highScore}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span>在线玩家: {games[activeGame].onlinePlayers}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GameShowcase;