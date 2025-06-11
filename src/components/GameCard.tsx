import React from 'react';
import { Play } from 'lucide-react';
import { Game } from '../types/game';
import { Link } from 'react-router-dom';

interface GameCardProps {
  game: Game;
  onPlay?: (gameId: string) => void;
}

const GameCard: React.FC<GameCardProps> = ({ game, onPlay }) => {
  // 处理游戏来源显示
  const isGameDistribution = game.iframeUrl?.includes('gamedistribution.com');
  const isCrazyGames = game.iframeUrl?.includes('crazygames.com');
  
  // 获取游戏来源标签
  const getSourceTag = () => {
    if (isGameDistribution) return 'GD';
    if (isCrazyGames) return 'CG';
    return 'WEB';
  };
  
  return (
    <div className="group rounded-xl bg-gray-800/30 backdrop-blur-md border border-blue-500/20 overflow-hidden hover:border-blue-400/50 transition-all hover:shadow-lg hover:shadow-blue-500/10">
      <div className="relative aspect-video w-full overflow-hidden">
        {/* 缩略图 */}
        <img
          src={game.thumbnailUrl || '/placeholder-game.jpg'}
          alt={`${game.title} thumbnail`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* 分类和来源标签 */}
        <div className="absolute top-2 left-2 flex gap-1">
          <span className="px-2 py-1 text-xs rounded bg-black/60 text-white border border-blue-500/30 backdrop-blur-md">
            {game.category}
          </span>
          <span className={`px-2 py-1 text-xs rounded text-white backdrop-blur-md ${
            isGameDistribution ? 'bg-purple-600/80' : 
            isCrazyGames ? 'bg-orange-600/80' : 'bg-blue-600/80'
          }`}>
            {getSourceTag()}
          </span>
        </div>
        
        {/* 播放按钮覆盖层 */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100">
          <div 
            className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center transform scale-50 group-hover:scale-100 transition-all cursor-pointer"
            onClick={() => onPlay && onPlay(game.id)}
          >
            <Play className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <Link to={`/games/${game.id}`} className="block">
          <h3 className="text-lg font-semibold text-white truncate group-hover:text-blue-400 transition-colors">
            {game.title}
          </h3>
          
          <p className="text-gray-400 text-sm line-clamp-2 h-10 mt-1">
            {game.description}
          </p>
        </Link>
        
        <div className="mt-4 flex justify-between items-center">
          <div className="flex space-x-2">
            <button 
              onClick={() => onPlay && onPlay(game.id)}
              className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
            >
              Play Game
            </button>
            <Link 
              to={`/games/${game.id}`}
              className="px-4 py-1.5 text-sm bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Details
            </Link>
          </div>
          
          {/* 游戏亮点指示器 */}
          {game.highlights && game.highlights.length > 0 && (
            <div className="flex">
              <div className="text-xs px-2 py-1 bg-blue-900/30 text-blue-300 rounded border border-blue-500/20">
                {game.highlights.length} Highlights
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameCard; 