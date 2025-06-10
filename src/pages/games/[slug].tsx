import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { getGameBySlug, getAllGames } from '../../data/gameIndex';
import GameDetail from '../../components/games/GameDetail';
import { Game } from '../../types/game';

/**
 * 游戏详情页面
 * 显示单个游戏的详细信息和游戏界面
 */
export default function GameDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [game, setGame] = useState<Game | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [relatedGames, setRelatedGames] = useState<Game[]>([]);
  
  // 加载游戏数据
  useEffect(() => {
    if (!slug) return;
    
    try {
      const gameData = getGameBySlug(slug);
      if (gameData) {
        setGame(gameData);
        
        // 设置页面标题
        document.title = `${gameData.title} - Mindseye 游戏`;
        
        // 设置页面描述
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
          metaDescription.setAttribute('content', gameData.description.substring(0, 160));
        }
        
        // 获取相关游戏 (同类别或标签的游戏)
        const allGames = getAllGames();
        const related = allGames
          .filter((g: Game) => 
            g.id !== gameData.id && 
            (g.category === gameData.category || 
             g.tags.some((tag: string) => gameData.tags.includes(tag)))
          )
          .sort(() => Math.random() - 0.5) // 随机排序
          .slice(0, 4); // 只取前4个
        
        setRelatedGames(related);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('加载游戏数据失败:', error);
      setIsLoading(false);
    }
  }, [slug]);
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!game) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="text-4xl mb-4">🎮</div>
        <h1 className="text-3xl font-bold text-white mb-4">游戏未找到</h1>
        <p className="text-gray-300 mb-6">
          抱歉，我们找不到您请求的游戏。这个游戏可能被移除或链接错误。
        </p>
        <Link 
          to="/games"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          返回游戏列表
        </Link>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* 面包屑导航 */}
      <nav className="text-sm text-gray-400 mb-6">
        <ol className="flex items-center space-x-1">
          <li>
            <Link to="/" className="hover:text-blue-400">首页</Link>
          </li>
          <li><ChevronRight className="h-4 w-4" /></li>
          <li>
            <Link to="/games" className="hover:text-blue-400">游戏</Link>
          </li>
          <li><ChevronRight className="h-4 w-4" /></li>
          <li className="text-blue-400 truncate max-w-[200px]">{game.title}</li>
        </ol>
      </nav>
      
      {/* 游戏详情 */}
      <GameDetail game={game} />
      
      {/* 相关游戏 */}
      {relatedGames.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-white mb-6">相关游戏</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedGames.map((relatedGame) => (
              <Link key={relatedGame.id} to={`/games/${relatedGame.slug}`}>
                <div className="bg-gray-900 rounded-xl overflow-hidden transition-transform hover:scale-105 shadow-lg border border-gray-800">
                  <div className="aspect-video w-full overflow-hidden">
                    <img
                      src={relatedGame.thumbnailUrl}
                      alt={relatedGame.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-white">{relatedGame.title}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link 
              to="/games"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
            >
              查看更多游戏
            </Link>
          </div>
        </div>
      )}
    </div>
  );
} 