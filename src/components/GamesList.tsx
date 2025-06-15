import React, { useState, useEffect, useRef } from 'react';
import { Game } from '../types/game';
import GameCard from './GameCard';
import { getAllGames } from '../utils/gameDataFetcher';
import { Search, ChevronRight, ChevronLeft, Filter } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const GamesList: React.FC = () => {
  const { t, i18n } = useTranslation('common');
  const { lang } = useParams<{ lang: string }>();
  const currentLang = lang || i18n.language;
  
  const [games, setGames] = useState<Game[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryGroups, setCategoryGroups] = useState<{ category: string; games: Game[] }[]>([]);
  const [visibleCategories, setVisibleCategories] = useState<string[]>([]);
  const [activeFilters, setActiveFilters] = useState<string[]>(['Popular']);
  const scrollContainerRefs = useRef<{[key: string]: HTMLDivElement | null}>({});
  
  // Initialize game data
  useEffect(() => {
    // Get data from global state
    const loadedGames = getAllGames();
    setGames(loadedGames);
    
    // Extract all categories
    const allCategories = Array.from(new Set(loadedGames.map(game => game.category))).sort();
    
    // Popular games (in a real app, this would be based on metrics like click-through rate)
    const popularGames = [...loadedGames].sort(() => 0.5 - Math.random()).slice(0, 10);
    
    // New games (in a real app, this would be based on release date)
    const newGames = [...loadedGames].sort(() => 0.5 - Math.random()).slice(0, 10);
    
    // Recommended games
    const recommendedGames = [...loadedGames].sort(() => 0.5 - Math.random()).slice(0, 10);
    
    // Create category groups
    const groups = [
      { category: 'Popular', games: popularGames },
      { category: 'New', games: newGames },
      { category: 'Recommended', games: recommendedGames },
      ...allCategories.map(category => ({
        category,
        games: loadedGames.filter(game => game.category === category).slice(0, 10)
      }))
    ];
    
    setCategoryGroups(groups);
    // Show first 5 categories by default
    setVisibleCategories(groups.slice(0, 5).map(g => g.category));
    
    console.log(`GamesList: Loaded ${loadedGames.length} games, ${allCategories.length} categories`);
  }, []);
  
  // Handle game click event
  const handleGameClick = (gameId: string) => {
    window.location.href = `/${currentLang}/games/${gameId}`;
  };
  
  // Scroll control
  const scrollCategory = (category: string, direction: 'left' | 'right') => {
    const container = scrollContainerRefs.current[category];
    if (container) {
      const scrollAmount = container.clientWidth * 0.8;
      const scrollTo = direction === 'left' ? container.scrollLeft - scrollAmount : container.scrollLeft + scrollAmount;
      container.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };
  
  // Toggle category visibility
  const toggleCategoryVisibility = (category: string) => {
    setVisibleCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };
  
  // Toggle filter
  const toggleFilter = (filter: string) => {
    setActiveFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter) 
        : [...prev, filter]
    );
  };
  
  // Translate category names
  const translateCategory = (category: string) => {
    return t(`categories.${category.toLowerCase()}`, category);
  };
  
  return (
    <section id="games" className="py-12 bg-gray-900 relative">
      <div className="container mx-auto px-4 py-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            {t('gamesList.title', 'Explore Game World')}
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {t('gamesList.subtitle', 'From exciting racing games to casual puzzle games, there\'s something for everyone here')}
          </p>
        </div>
        
        {/* Search and filter */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8 justify-between">
          <div className="relative flex-grow max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800 text-white rounded-lg border border-gray-700 py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={t('gamesList.searchPlaceholder', 'Search games...')}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" size={20} />
            </div>
          </div>
          
          {/* Remove quick filter tags area */}
        </div>
        
        {/* Horizontally scrolling game lists grouped by category */}
        {categoryGroups
          .filter(group => 
            // Filter visible categories and those matching search query
            (visibleCategories.includes(group.category) || activeFilters.includes(group.category)) &&
            (searchQuery === '' || group.games.some(game => 
              game.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
              game.description.toLowerCase().includes(searchQuery.toLowerCase())
            ))
          )
          .map(group => {
            // Filter games matching search query
            const filteredGames = searchQuery 
              ? group.games.filter(game => 
                  game.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                  game.description.toLowerCase().includes(searchQuery.toLowerCase())
                )
              : group.games;
              
            // Don't show category if no games after filtering
            if (filteredGames.length === 0) return null;
            
            return (
              <div key={group.category} className="mb-12">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold text-white flex items-center">
                    {translateCategory(group.category)}
                    <span className="text-gray-400 text-sm ml-2">({filteredGames.length})</span>
                  </h3>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => scrollCategory(group.category, 'left')}
                      className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300"
                      aria-label={t('gamesList.scrollLeft', 'Scroll left')}
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={() => scrollCategory(group.category, 'right')}
                      className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300"
                      aria-label={t('gamesList.scrollRight', 'Scroll right')}
                    >
                      <ChevronRight size={20} />
                    </button>
                    <Link 
                      to={`/${currentLang}/games?category=${encodeURIComponent(group.category)}`}
                      className="px-4 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-600 text-white text-sm font-medium flex items-center"
                    >
                      {t('gamesList.viewAll', 'View All')} <ChevronRight size={16} />
                    </Link>
                  </div>
                </div>
        
                <div 
                  ref={el => scrollContainerRefs.current[group.category] = el}
                  className="flex overflow-x-auto gap-4 pb-4 hide-scrollbar snap-x snap-mandatory"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {filteredGames.map((game) => (
                    <div 
                      key={game.id} 
                      className="flex-none snap-start" 
                      style={{ 
                        width: 'min(calc(100% - 16px), calc(480px - 16px))',
                        minWidth: '280px',
                        maxWidth: '320px'
                      }}
                    >
                      <GameCard 
                        game={game} 
                        onPlay={() => handleGameClick(game.id)} 
                      />
                    </div>
                  ))}
                  
                  <Link 
                    to={`/${currentLang}/games?category=${encodeURIComponent(group.category)}`}
                    className="flex-none snap-start flex items-center justify-center w-40 h-full min-h-48 rounded-xl bg-gray-800/30 hover:bg-gray-700/50 border border-dashed border-gray-600 hover:border-blue-500 transition-all"
                  >
                    <div className="text-center">
                      <ChevronRight size={40} className="text-blue-500 mx-auto" />
                      <div className="text-gray-400 text-sm mt-2">{t('gamesList.viewMore', 'View More')}</div>
                    </div>
                  </Link>
                </div>
              </div>
            );
          })}
        
        {/* View all games button */}
        <div className="text-center mt-10 mb-4">
          <Link
            to={`/${currentLang}/games`}
            className="bg-gradient-to-r from-blue-700 to-purple-800 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-3 px-8 rounded-lg transition duration-200 ease-in-out"
          >
            {t('buttons.viewAll', 'View All Games')}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default GamesList; 