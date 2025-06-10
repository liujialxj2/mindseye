import React, { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { getAllGames, gameCategories, gameTags } from '../../data/gameIndex';
import GameCard from '../../components/games/GameCard';
import { Game } from '../../types/game';

/**
 * 游戏列表页面
 * 展示所有游戏，支持搜索和筛选
 */
export default function GamesListPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeTag, setActiveTag] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  
  // 加载游戏数据
  useEffect(() => {
    try {
      const allGames = getAllGames();
      setGames(allGames);
      setFilteredGames(allGames);
      setIsLoading(false);
    } catch (error) {
      console.error('加载游戏数据失败:', error);
      setIsLoading(false);
    }
  }, []);
  
  // 过滤游戏
  useEffect(() => {
    // 根据搜索、分类和标签过滤游戏
    const filtered = games.filter(game => {
      // 类别筛选
      if (activeCategory !== 'all' && game.category !== activeCategory) {
        return false;
      }
      
      // 标签筛选
      if (activeTag !== 'all' && !game.tags.includes(activeTag)) {
        return false;
      }
      
      // 搜索筛选
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          game.title.toLowerCase().includes(query) ||
          game.description.toLowerCase().includes(query)
        );
      }
      
      return true;
    });
    
    setFilteredGames(filtered);
  }, [games, searchQuery, activeCategory, activeTag]);
  
  // 处理游戏点击
  const handleGameClick = (game: Game) => {
    // 游戏点击后的导航逻辑
    window.location.href = `/games/${game.slug}`;
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* 页面标题 */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-3 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Mindseye 小游戏集合
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          探索我们精选的HTML5小游戏，在Mindseye宇宙中体验多样化的游戏乐趣
        </p>
      </div>
      
      {/* 搜索和筛选区域 */}
      <div className="bg-gray-900 rounded-xl p-6 mb-8 border border-blue-500/20">
        {/* 搜索框 */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="搜索游戏..."
            className="block w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* 筛选选项 */}
        <div className="space-y-4">
          {/* 分类筛选 */}
          <div>
            <div className="flex items-center mb-2">
              <Filter className="h-4 w-4 text-blue-400 mr-2" />
              <h3 className="text-sm font-medium text-blue-400">按分类筛选</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                key="all-categories"
                onClick={() => setActiveCategory('all')}
                className={`px-3 py-1 text-sm rounded-full transition-all ${
                  activeCategory === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                全部
              </button>
              {gameCategories.map((category: string) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-3 py-1 text-sm rounded-full transition-all ${
                    activeCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          {/* 标签筛选 */}
          <div>
            <div className="flex items-center mb-2">
              <Filter className="h-4 w-4 text-blue-400 mr-2" />
              <h3 className="text-sm font-medium text-blue-400">按标签筛选</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                key="all-tags"
                onClick={() => setActiveTag('all')}
                className={`px-3 py-1 text-sm rounded-full transition-all ${
                  activeTag === 'all'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                全部
              </button>
              {gameTags.slice(0, 15).map((tag: string) => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  className={`px-3 py-1 text-sm rounded-full transition-all ${
                    activeTag === tag
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* 游戏列表 */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredGames.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-4xl mb-4">🔍</div>
          <h2 className="text-2xl font-semibold text-gray-300 mb-2">没有找到符合条件的游戏</h2>
          <p className="text-gray-400">
            请尝试使用其他关键词或清除筛选条件
          </p>
          <button 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
            onClick={() => {
              setSearchQuery('');
              setActiveCategory('all');
              setActiveTag('all');
            }}
          >
            清除筛选条件
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredGames.map((game) => (
            <GameCard 
              key={game.id} 
              game={game} 
              onClick={() => handleGameClick(game)}
            />
          ))}
        </div>
      )}
      
      {/* 结果统计 */}
      {filteredGames.length > 0 && (
        <div className="mt-8 text-center text-gray-400">
          显示 {filteredGames.length} 个游戏（共 {games.length} 个）
        </div>
      )}
    </div>
  );
} 