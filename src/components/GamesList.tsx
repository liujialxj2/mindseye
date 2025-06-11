import React, { useState, useEffect } from 'react';
import { Game } from '../types/game';
import GameCard from './GameCard';
import { getAllGames } from '../utils/gameDataFetcher';
import { Search } from 'lucide-react';

const GamesList: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [categories, setCategories] = useState<string[]>(['all']);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [visibleGamesCount, setVisibleGamesCount] = useState<number>(12); // 初始显示12个游戏
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  
  // 初始化游戏数据
  useEffect(() => {
    // 从全局状态获取数据
    const loadedGames = getAllGames();
    setGames(loadedGames);
    
    // 提取所有分类
    const allCategories = ['all', ...Array.from(new Set(loadedGames.map(game => game.category))).sort()];
    setCategories(allCategories);
    
    console.log(`GamesList: 获取到 ${loadedGames.length} 个游戏`);
  }, []);
  
  // 当过滤条件改变时，重新计算过滤后的游戏列表
  useEffect(() => {
    const filtered = games.filter(game => 
      // 分类过滤
      (activeCategory === 'all' || game.category === activeCategory) &&
      // 搜索过滤
      (searchQuery === '' || 
        game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    
    setFilteredGames(filtered);
    console.log(`GamesList: 过滤后有 ${filtered.length} 个游戏`);
  }, [games, activeCategory, searchQuery]);
  
  // 处理游戏点击事件
  const handleGameClick = (gameId: string) => {
    window.location.href = `/games/${gameId}`;
  };
  
  // 加载更多游戏
  const handleLoadMore = () => {
    console.log(`加载更多游戏: ${visibleGamesCount} -> ${visibleGamesCount + 12}`);
    setVisibleGamesCount(prevCount => prevCount + 12);
  };
  
  // 显示的游戏列表
  const visibleGames = filteredGames.slice(0, visibleGamesCount);
  
  return (
    <section id="games" className="py-16 bg-gray-900 relative">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white mb-2">
            Explore More Games
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Try more exciting games, from thrilling racing games to casual puzzle games, there's always something for you.
          </p>
        </div>
        
        {/* 搜索框 */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6 justify-between">
          <div className="relative flex-grow max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800 text-white rounded-lg border border-gray-700 py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Search games..."
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" size={20} />
            </div>
          </div>
        </div>
        
        {/* 分类过滤器 */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeCategory === category
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <span className="font-medium">
                {category === 'all' ? 'All Games' : category}
              </span>
            </button>
          ))}
        </div>
        
        {/* 游戏数量统计 */}
        <div className="text-sm text-gray-400 mb-4">
          Showing {visibleGames.length} of {filteredGames.length} {activeCategory !== 'all' ? activeCategory + ' ' : ''}games
          {searchQuery ? ` (search: "${searchQuery}")` : ''}
        </div>
        
        {/* 游戏卡片网格 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {visibleGames.map((game) => (
            <GameCard 
              key={game.id} 
              game={game} 
              onPlay={() => handleGameClick(game.id)} 
            />
          ))}
        </div>
        
        {filteredGames.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No games found matching your criteria</p>
          </div>
        )}
        
        {/* 加载更多按钮 */}
        {visibleGamesCount < filteredGames.length && (
          <div className="text-center mt-10">
            <button
              onClick={handleLoadMore}
              className="bg-blue-700 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition duration-200 ease-in-out"
            >
              Load More Games ({filteredGames.length - visibleGamesCount} more)
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default GamesList; 