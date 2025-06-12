import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Trophy, Users, Maximize, Info } from 'lucide-react';
import GameDistributionFrame from './GameDistributionFrame';

// Extended type definitions for fullscreen API across different browsers
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

  // Get current domain for GameDistribution integration
  const currentDomain = typeof window !== 'undefined' ? window.location.origin : 'https://www.mindseye.cool';

  // Featured games data
  const games = [
    {
      id: 'perception-puzzle',
      title: 'Perception Puzzle',
      description: 'Test your perception abilities in this engaging game. Identify patterns, solve visual puzzles, and enhance your observation skills.',
      instructions: 'Use your mouse to click on matching shapes. Find all matches before time runs out to achieve the highest score.\n\nTip: Focus on the edges first, then move toward the center.',
      thumbnailUrl: 'https://img.gamedistribution.com/62381d033e714230acd2147b60a24550-512x384.jpg',
      embedUrl: 'https://html5.gamedistribution.com/62381d033e714230acd2147b60a24550/',
      highScore: 2840,
      onlinePlayers: 143,
      isGameDistribution: true
    },
    {
      id: 'memory-maze',
      title: 'Memory Maze',
      description: 'A challenging game that tests your spatial memory. Remember paths, avoid obstacles, and find your way to the next level.',
      instructions: 'Use arrow keys or WASD to move. Remember the maze layout and find the exit in dark environments.\n\nDifficulty increases with each level, stay focused!',
      thumbnailUrl: 'https://img.gamedistribution.com/6c82ded251754899bace3d781d03d607-512x384.jpg',
      embedUrl: 'https://html5.gamedistribution.com/6c82ded251754899bace3d781d03d607/',
      highScore: 1560,
      onlinePlayers: 95,
      isGameDistribution: true
    },
    {
      id: 'pattern-recognition',
      title: 'Pattern Recognition',
      description: 'Improve your pattern recognition skills. In this game, you need to identify hidden patterns in constantly changing backgrounds.',
      instructions: 'Observe the pattern shown on screen, then select the matching option from the choices provided.\n\nAs levels progress, patterns become more complex and background interference increases.',
      thumbnailUrl: 'https://img.gamedistribution.com/5ecf233acb5a453bb50dbcb77df39df8-512x384.jpg',
      embedUrl: 'https://html5.gamedistribution.com/5ecf233acb5a453bb50dbcb77df39df8/',
      highScore: 3250,
      onlinePlayers: 128,
      isGameDistribution: true
    }
  ];

  // Handle game loaded event
  const handleGameLoaded = () => {
    console.log('Game loaded successfully');
  };

  // Handle game error event
  const handleGameError = (error: string) => {
    console.error('Game loading error:', error);
  };

  // Handle fullscreen
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

  // Monitor fullscreen change events
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
            Experience Featured Mini-Games
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Immerse yourself in these mini-games designed for the Mindseye universe, train your perception abilities, and prepare for the complete game experience.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Game selector */}
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

          {/* Game display area */}
          <div className="bg-gray-900 rounded-2xl p-6 border border-blue-500/30">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">
                {games[activeGame].title}
              </h3>
              <p className="text-gray-300">
                {games[activeGame].description}
              </p>
            </div>

            {/* Game instructions */}
            {showInstructions && (
              <div className="bg-gray-800 rounded-xl p-4 mb-6 border border-blue-500/20">
                <h4 className="text-lg font-semibold text-blue-400 mb-2">Game Instructions</h4>
                <p className="text-gray-300 whitespace-pre-line">
                  {games[activeGame].instructions}
                </p>
              </div>
            )}

            {/* Game frame */}
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
                    <h4 className="text-xl font-bold text-white mb-2">Ready to play?</h4>
                    <p className="text-gray-400">Click the play button to start your adventure</p>
                  </div>
                </div>
              )}
            </div>

            {/* Game controls */}
            <div className="flex flex-wrap gap-4 justify-between items-center">
              <div className="flex gap-4">
                <button 
                  className={`flex items-center space-x-2 px-4 py-2 ${isPlaying ? 'bg-gray-700' : 'bg-blue-600'} text-white rounded-lg hover:brightness-110 transition-all`}
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? (
                    <>
                      <RotateCcw className="w-4 h-4 mr-2" />
                      <span>Restart</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      <span>Start</span>
                    </>
                  )}
                </button>
                
                {isPlaying && (
                  <button 
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    onClick={handleFullscreen}
                  >
                    <Maximize className="w-4 h-4 mr-2" />
                    <span>Fullscreen</span>
                  </button>
                )}
                
                <button 
                  className={`flex items-center space-x-2 px-4 py-2 ${showInstructions ? 'bg-blue-600' : 'bg-gray-700'} text-white rounded-lg hover:brightness-110 transition-all`}
                  onClick={() => setShowInstructions(!showInstructions)}
                >
                  <Info className="w-4 h-4 mr-2" />
                  <span>{showInstructions ? 'Hide instructions' : 'Show instructions'}</span>
                </button>
              </div>
              
              <div className="flex items-center space-x-6 text-gray-300">
                <div className="flex items-center space-x-2">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  <span>Highest score: {games[activeGame].highScore}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span>Online players: {games[activeGame].onlinePlayers}</span>
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