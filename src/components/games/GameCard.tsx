import React from 'react';
import { Game } from '../../types/game';

/**
 * 游戏卡片组件属性
 */
interface GameCardProps {
  /**
   * 游戏数据
   */
  game: Game;
  /**
   * 点击游戏卡片的回调函数
   */
  onClick?: () => void;
}

/**
 * 游戏卡片组件
 * 用于在游戏列表中展示单个游戏的卡片
 */
export default function GameCard({ game, onClick }: GameCardProps) {
  return (
    <div 
      className="bg-gray-900 rounded-xl overflow-hidden transition-transform hover:scale-105 shadow-lg border border-gray-800 cursor-pointer"
      onClick={onClick}
    >
      <div className="aspect-video w-full overflow-hidden">
        <img
          src={game.thumbnailUrl}
          alt={game.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold text-white mb-2">{game.title}</h3>
        <p className="text-gray-400 text-sm line-clamp-2">{game.description}</p>
        
        {/* 游戏标签 */}
        {game.tags && game.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {game.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index}
                className="px-2 py-1 text-xs bg-blue-900/50 text-blue-300 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 