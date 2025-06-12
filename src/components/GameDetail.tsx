import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Maximize, Info, RotateCcw, Play } from 'lucide-react';
import { getGameById } from '../utils/gameDataFetcher';
import { Game } from '../types/game';
import GameDistributionFrame from './GameDistributionFrame';
import { Link } from 'react-router-dom';
import { IoArrowBack, IoPlayCircle, IoEye, IoEyeOff, IoExpand, IoContract, IoRefresh } from 'react-icons/io5';

interface GameDetailProps {
  gameId: string;
  onBack?: () => void;
}

const GameDetail: React.FC<GameDetailProps> = ({ gameId, onBack }) => {
  const [game, setGame] = useState<Game | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const gameFrameRef = useRef<HTMLDivElement>(null);

  // Get current domain for GameDistribution integration
  const currentDomain = typeof window !== 'undefined' ? window.location.origin : '';
  
  // Get game data
  useEffect(() => {
    const gameData = getGameById(gameId);
    if (gameData) {
      setGame(gameData);
      
      // Set page title and meta description
      document.title = `${gameData.title} - Mindseye Games`;
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', gameData.description.substring(0, 160));
      }
    }
  }, [gameId]);

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

  // Monitor fullscreen changes
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

  if (!game) {
    return (
      <div className="h-96 flex items-center justify-center">
        <p className="text-white text-xl">Loading game...</p>
      </div>
    );
  }

  // Handle game load event
  const handleGameLoad = () => {
    console.log("Game loaded successfully");
  };

  // Handle game error event
  const handleGameError = (error: string) => {
    console.error("Game loading error:", error);
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      {/* Back button */}
      <div className="mb-6">
        <Link
          to="/"
          className="text-blue-400 hover:text-blue-300 flex items-center group"
        >
          <IoArrowBack className="mr-1 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Games</span>
        </Link>
      </div>

      <main className="container mx-auto px-4 pt-20 pb-12">
        <div className="bg-gray-900 rounded-2xl p-6 border border-blue-500/30 mb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">
              {game.title}
            </h2>
            <p className="text-gray-300">
              {game.description}
            </p>
          </div>

          {/* Game instructions */}
          {showInstructions && (
            <div className="bg-gray-800 rounded-xl p-4 mb-6 border border-blue-500/20">
              <h3 className="text-lg font-semibold text-blue-400 mb-2">Game Controls</h3>
              <p className="text-gray-300 whitespace-pre-line">
                {game.controls}
              </p>
            </div>
          )}

          {/* Game frame */}
          <div ref={gameFrameRef} className="bg-black rounded-xl overflow-hidden border border-blue-500/20 mb-6">
            {isPlaying ? (
              <div className="aspect-video w-full h-full">
                <GameDistributionFrame
                  gameId={game.id}
                  gameUrl={game.iframeUrl}
                  title={game.title}
                  onGameLoaded={handleGameLoad}
                  onGameError={handleGameError}
                />
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
                  <div 
                    className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4 mx-auto cursor-pointer hover:scale-110 transition-transform"
                    onClick={() => setIsPlaying(true)}
                  >
                    <Play className="w-12 h-12 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">Ready to play?</h4>
                  <p className="text-gray-400">Click the play button to start the game</p>
                </div>
              </div>
            )}
          </div>

          {/* Game controls */}
          <div className="flex flex-col items-center mt-8 space-y-6">
            <div className="flex justify-center items-center space-x-4">
              {isPlaying ? (
                <div className="flex flex-wrap gap-3 justify-center">
                  <button
                    onClick={() => setIsPlaying(false)}
                    className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg flex items-center transition-colors"
                  >
                    <IoRefresh className="mr-1" />
                    <span>Restart</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsPlaying(true)}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center transition-colors"
                >
                  <IoPlayCircle className="mr-2 text-xl" />
                  <span>Start Game</span>
                </button>
              )}

              <button
                onClick={handleFullscreen}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center transition-colors"
              >
                {isFullscreen ? <IoContract className="mr-1" /> : <IoExpand className="mr-1" />}
                <span>Fullscreen</span>
              </button>

              <button
                onClick={() => setShowInstructions(!showInstructions)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg flex items-center transition-colors"
              >
                {showInstructions ? <IoEyeOff className="mr-1" /> : <IoEye className="mr-1" />}
                <span>{showInstructions ? 'Hide Instructions' : 'Game Instructions'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Game highlights */}
        {game.highlights && game.highlights.length > 0 && (
          <div className="mt-8 bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">Game Highlights</h3>
            <div className="space-y-3">
              {game.highlights.map((highlight, index) => (
                <div key={index} className="flex">
                  <div className="text-blue-400 font-semibold mb-1">Highlight {index + 1}</div>
                  <div className="text-gray-300 ml-4">{highlight}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default GameDetail;