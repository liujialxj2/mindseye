import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GameCard from '../components/GameCard';
import GameDetail from '../components/GameDetail';
import { Game } from '../types/game';
import { getAllGames } from '../utils/gameDataFetcher';
import { Search, Grid3X3, SlidersHorizontal, X } from 'lucide-react';

const HomePage = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Extract game ID from URL if present
  useEffect(() => {
    const path = location.pathname;
    const match = path.match(/\/game\/(.+)/);
    
    if (match && match[1]) {
      setSelectedGameId(match[1]);
    } else {
      setSelectedGameId(null);
    }
  }, [location.pathname]);

  // Load games data
  useEffect(() => {
    const loadGames = async () => {
      const gamesData = await getAllGames();
      setGames(gamesData);
      setFilteredGames(gamesData);
      
      // Extract unique categories
      const uniqueCategories = Array.from(
        new Set(gamesData.map(game => game.category))
      ).filter(Boolean);
      
      setCategories(uniqueCategories as string[]);
    };
    
    loadGames();
  }, []);

  // Filter games based on search and category
  useEffect(() => {
    let result = games;
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(game => 
        game.title.toLowerCase().includes(query) || 
        game.description.toLowerCase().includes(query)
      );
    }
    
    // Apply category filter
    if (selectedCategory) {
      result = result.filter(game => 
        game.category === selectedCategory
      );
    }
    
    setFilteredGames(result);
  }, [searchQuery, selectedCategory, games]);

  // Handle game selection
  const handleGameSelect = (gameId: string) => {
    navigate(`/game/${gameId}`);
  };

  // Handle back from game detail
  const handleBackFromGame = () => {
    navigate('/');
  };

  // Toggle category filter
  const handleCategorySelect = (category: string) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
    }
    setIsFilterMenuOpen(false);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
  };

  // If a game is selected, show game detail
  if (selectedGameId) {
    return (
      <GameDetail 
        gameId={selectedGameId} 
        onBack={handleBackFromGame}
      />
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header/Navigation */}
      <header className="sticky top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-blue-500/20 py-4">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row gap-4">
          <div className="flex items-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Grid3X3 className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">Mindseye Games</h1>
            </div>
          </div>
          
          <div className="flex-1 flex items-center gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search games..."
                className="w-full h-10 rounded-lg bg-gray-800 border border-blue-500/30 text-white px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              {searchQuery && (
                <button 
                  className="absolute right-3 top-2.5"
                  onClick={() => setSearchQuery('')}
                >
                  <X className="w-4 h-4 text-gray-400 hover:text-white" />
                </button>
              )}
            </div>
            
            {/* Filter Button */}
            <div className="relative">
              <button 
                onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg ${selectedCategory ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300'}`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filter</span>
              </button>
              
              {/* Filter Menu */}
              {isFilterMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-gray-900 border border-blue-500/30 rounded-lg shadow-lg shadow-black/50 z-10">
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-lg font-semibold text-white">Categories</h3>
                      <button 
                        className="text-xs text-blue-400 hover:text-blue-300"
                        onClick={clearFilters}
                      >
                        Clear All
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {categories.map(category => (
                        <button
                          key={category}
                          onClick={() => handleCategorySelect(category)}
                          className={`px-3 py-1 text-sm rounded-full ${selectedCategory === category ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Active Filters */}
        {(searchQuery || selectedCategory) && (
          <div className="mb-6 flex flex-wrap gap-2 items-center">
            <span className="text-gray-400">Active filters:</span>
            
            {searchQuery && (
              <div className="flex items-center gap-1 px-3 py-1 bg-gray-800 rounded-full text-sm text-white">
                <span>Search: {searchQuery}</span>
                <button onClick={() => setSearchQuery('')}>
                  <X className="w-3 h-3 text-gray-400 hover:text-white" />
                </button>
              </div>
            )}
            
            {selectedCategory && (
              <div className="flex items-center gap-1 px-3 py-1 bg-blue-600/30 rounded-full text-sm text-blue-300">
                <span>Category: {selectedCategory}</span>
                <button onClick={() => setSelectedCategory(null)}>
                  <X className="w-3 h-3 text-blue-300 hover:text-white" />
                </button>
              </div>
            )}
            
            <button 
              className="text-xs text-blue-400 hover:underline ml-2"
              onClick={clearFilters}
            >
              Clear All
            </button>
          </div>
        )}

        {/* Game grid */}
        {filteredGames.length > 0 ? (
          <>
            <h2 className="text-2xl font-bold text-white mb-6">
              {selectedCategory 
                ? `${selectedCategory} Games` 
                : searchQuery 
                  ? "Search Results" 
                  : "Popular Games"}
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredGames.map(game => (
                <GameCard 
                  key={game.id} 
                  game={game} 
                  onPlay={handleGameSelect} 
                />
              ))}
            </div>
          </>
        ) : (
          <div className="min-h-[60vh] flex flex-col items-center justify-center">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <Search className="w-12 h-12 text-gray-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Games Found</h3>
            <p className="text-gray-400 text-center mb-4">
              We couldn't find any games matching your search criteria.
            </p>
            <button 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-blue-500/20 mt-12 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-400 text-sm">
            <p className="mb-2">
              © 2023 Mindseye Games Platform. All rights reserved.
            </p>
            <p>
              All game assets and content belong to their respective owners. 
              Mindseye Games serves as a platform for discovering and playing browser games.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage; 