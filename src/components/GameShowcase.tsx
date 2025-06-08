import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Trophy, Users, Maximize, Info } from 'lucide-react';

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

  // 游戏数据 - 使用提供的游戏信息
  const games = [
    {
      title: "Aventador Vice Crime City",
      description: "Experience city driving with four game modes. Navigate realistic traffic and monitor your fuel while exploring busy streets. Enjoy stunning morning city graphics, transforming the city into a spectacle. Pedestrians add unpredictability, and hitting them triggers police chases. Customize your car's appearance and performance. All this chaos is accompanied by your cute dog. Whether evading the cops or just cruising, Aventador Vice Crime City offers a thrilling and visually amazing experience.",
      instructions: "W, A, S, D/Arrow Keys: Drive/Steer/Brake\nLeft Shift Key: Nitro Boost\nC Key: Change Camera View\nG Key: Slow Motion",
      embedUrl: "https://html5.gamedistribution.com/be4f7b9d1f3c4370a27cd86ba14fe15e/?gd_sdk_referrer_url=https://www.example.com/games/aventador",
      thumbnailUrl: "./dist/images/games/01.jpg",
      highScore: "12,745",
      onlinePlayers: "3,256"
    },
    {
      title: "Strykon",
      description: "Strykon is a mobile FPS game with exciting missions and combat. Play different modes like Deathmatch, Team Deathmatch, and Free-For-All where your goal is to survive. Choose from many weapons like pistols, rifles, shotguns, and sniper rifles. Each gun has its own style. Enjoy great graphics, realistic sounds, and simple controls. Earn rewards through battle passes to keep the game interesting. Whether you're completing missions or battling enemies, this shooter game is full of action anywhere, anytime!",
      instructions: "Keyboard: WASD\nG Key: Grenade-Gun\nC Key: Crouch\nR Key: Reload\n1 - Primary Weapon\n2 - Secondary Weapon\nM1: Aim\nM2: Shoot\nSpace: Jump\nESC or TAB: Menu\nScroll Wheel: Change Weapons\nSHIFT + W: Run\nSHIFT + W + C: Slide",
      embedUrl: "https://html5.gamedistribution.com/59361631a2614fc095ef2a1740e02d78/?gd_sdk_referrer_url=https://www.example.com/games/strykon",
      thumbnailUrl: "./dist/images/games/02.jpg",
      highScore: "9,321",
      onlinePlayers: "4,562"
    },
    {
      title: "Feed me Monsters! Idle Battle",
      description: "The fate of the world is in your hands. Will you accept the challenge and become a beacon of hope in a land filled with darkness? Prepare yourself for epic showdowns with a variety of enemies! From fierce beasts lurking in the wilderness to bizarre mutants threatening humanity, each monster poses a unique challenge. Defeating these foes not only earns you coins and experience points but also unlocks new abilities to enhance your combat prowess. Are you ready to embark on this thrilling adventure? Adjust your strategies, overcome each opponent, claim victory, and restore balance to the world!",
      instructions: "Get ready to face various enemies! From fierce beasts lurking in the wild to deformed mutants threatening humanity, each monster brings a unique challenge. Defeating these enemies earns you coins and XP, and unlocks new abilities to enhance your combat skills. Are you ready to start this exciting adventure? Adjust your strategy, defeat each enemy, claim victory, and restore balance to the world!",
      embedUrl: "https://html5.gamedistribution.com/84b087130dcf437a93254e42d2da2268/?gd_sdk_referrer_url=https://www.example.com/games/feed-monsters",
      thumbnailUrl: "./dist/images/games/03.jpg",
      highScore: "15,687",
      onlinePlayers: "2,912"
    }
  ];

  // 处理游戏全屏
  const handleFullscreen = () => {
    const iframe = document.getElementById('game-iframe') as HTMLElement;
    if (iframe) {
      if (!isFullscreen) {
        if (iframe.requestFullscreen) {
          iframe.requestFullscreen();
        } else if (iframe.mozRequestFullScreen) {
          iframe.mozRequestFullScreen();
        } else if (iframe.webkitRequestFullscreen) {
          iframe.webkitRequestFullscreen();
        } else if (iframe.msRequestFullscreen) {
          iframe.msRequestFullscreen();
        }
        setIsFullscreen(true);
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
        setIsFullscreen(false);
      }
    }
  };

  // 监听全屏变化事件
  useEffect(() => {
    const fullscreenChangeHandler = () => {
      setIsFullscreen(
        !!document.fullscreenElement ||
        !!document.mozFullScreenElement ||
        !!document.webkitFullscreenElement ||
        !!document.msFullscreenElement
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
            Experience Mindseye Mini Games
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Immerse yourself in these mini games designed for the Mindseye universe, train your perception abilities, and prepare for the full game experience.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Game Selector */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {games.map((game, index) => (
              <button
                key={index}
                onClick={() => {
                  setActiveGame(index);
                  setIsPlaying(false); // Reset play state when switching games
                  setShowInstructions(false); // Hide instructions
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

          {/* Game Display Area */}
          <div className="bg-gray-900 rounded-2xl p-6 border border-blue-500/30">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">
                {games[activeGame].title}
              </h3>
              <p className="text-gray-300">
                {games[activeGame].description}
              </p>
            </div>

            {/* Instructions */}
            {showInstructions && (
              <div className="bg-gray-800 rounded-xl p-4 mb-6 border border-blue-500/20">
                <h4 className="text-lg font-semibold text-blue-400 mb-2">Instructions</h4>
                <p className="text-gray-300 whitespace-pre-line">
                  {games[activeGame].instructions}
                </p>
              </div>
            )}

            {/* Game Frame */}
            <div className="bg-black rounded-xl overflow-hidden border border-blue-500/20 mb-6">
              {isPlaying ? (
                <div className="aspect-video w-full h-full">
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
                    <h4 className="text-xl font-bold text-white mb-2">Get Ready</h4>
                    <p className="text-gray-400">Click the play button to start your adventure</p>
                  </div>
                </div>
              )}
            </div>

            {/* Game Controls */}
            <div className="flex flex-wrap gap-4 justify-between items-center">
              <div className="flex gap-4">
                <button 
                  className={`flex items-center space-x-2 px-4 py-2 ${isPlaying ? 'bg-gray-700' : 'bg-blue-600'} text-white rounded-lg hover:brightness-110 transition-all`}
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? (
                    <>
                      <RotateCcw className="w-4 h-4" />
                      <span>Restart</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      <span>Start</span>
                    </>
                  )}
                </button>
                
                {isPlaying && (
                  <button 
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    onClick={handleFullscreen}
                  >
                    <Maximize className="w-4 h-4" />
                    <span>Fullscreen</span>
                  </button>
                )}
                
                <button 
                  className={`flex items-center space-x-2 px-4 py-2 ${showInstructions ? 'bg-blue-600' : 'bg-gray-700'} text-white rounded-lg hover:brightness-110 transition-all`}
                  onClick={() => setShowInstructions(!showInstructions)}
                >
                  <Info className="w-4 h-4" />
                  <span>{showInstructions ? 'Hide Instructions' : 'View Instructions'}</span>
                </button>
              </div>
              
              <div className="flex items-center space-x-6 text-gray-300">
                <div className="flex items-center space-x-2">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  <span>High Score: {games[activeGame].highScore}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span>Online Players: {games[activeGame].onlinePlayers}</span>
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