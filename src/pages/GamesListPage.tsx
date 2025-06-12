import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, ChevronLeft, ChevronRight, X } from 'lucide-react';
import GameCard from '../components/GameCard';
import { Game } from '../types/game';
import { getAllGames } from '../utils/gameDataFetcher';

const GamesListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [games, setGames] = useState<Game[]>([]);
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<string>('popular');
  
  const gamesPerPage = 20;
  
  // URL parameter handling
  useEffect(() => {
    const category = searchParams.get('category') || '';
    const query = searchParams.get('query') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const sort = searchParams.get('sort') || 'popular';
    
    if (category) {
      setActiveFilters([category]);
    }
    
    if (query) {
      setSearchQuery(query);
    }
    
    setCurrentPage(page);
    setSortOption(sort);
  }, [searchParams]);
  
  // Initialize game data
  useEffect(() => {
    // Get data from global state
    const loadedGames = getAllGames();
    setGames(loadedGames);
    
    // Extract all categories
    const allCategories = Array.from(new Set(loadedGames.map(game => game.category))).sort();
    setCategories(allCategories);
    
    // Extract all tags
    const allTags = Array.from(new Set(loadedGames.flatMap(game => game.tags || []))).sort();
    setAvailableTags(allTags);
    
    console.log(`GamesListPage: Loaded ${loadedGames.length} games`);
  }, []);
  
  // Filter games
  useEffect(() => {
    let filtered = [...games];
    
    // Filter by category
    if (activeFilters.length > 0) {
      filtered = filtered.filter(game => activeFilters.includes(game.category));
    }
    
    // Filter by tags
    if (activeTags.length > 0) {
      filtered = filtered.filter(game => 
        game.tags && game.tags.some(tag => activeTags.includes(tag))
      );
    }
    
    // Filter by search term
    if (searchQuery) {
      filtered = filtered.filter(game =>
        game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (game.tags && game.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
      );
    }
    
    // Apply sorting
    filtered = sortGames(filtered, sortOption);
    
    setFilteredGames(filtered);
    
    // Update URL parameters
    const newParams = new URLSearchParams();
    if (activeFilters.length === 1) {
      newParams.set('category', activeFilters[0]);
    }
    if (searchQuery) {
      newParams.set('query', searchQuery);
    }
    if (currentPage > 1) {
      newParams.set('page', currentPage.toString());
    }
    if (sortOption !== 'popular') {
      newParams.set('sort', sortOption);
    }
    setSearchParams(newParams);
    
  }, [games, activeFilters, activeTags, searchQuery, currentPage, sortOption, setSearchParams]);
  
  // Game sorting function
  const sortGames = (gamesArray: Game[], option: string): Game[] => {
    const sorted = [...gamesArray];
    
    switch (option) {
      case 'newest':
        // Assuming there's a createdAt or similar release date field
        return sorted.sort((a, b) => 
          (b.createdAt || 0) - (a.createdAt || 0)
        );
      case 'name':
        return sorted.sort((a, b) => 
          a.title.localeCompare(b.title)
        );
      case 'popular':
      default:
        // Sort by popularity, can be based on rating, play count, etc. (using random rating here for simulation)
        return sorted.sort((a, b) => {
          const ratingA = parseFloat(((Math.random() * 3) + 2).toFixed(1));
          const ratingB = parseFloat(((Math.random() * 3) + 2).toFixed(1));
          return ratingB - ratingA;
        });
    }
  };
  
  // Handle game click event
  const handleGameClick = (gameId: string) => {
    window.location.href = `/games/${gameId}`;
  };
  
  // Toggle category filter
  const toggleFilter = (category: string) => {
    setActiveFilters(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [category]
    );
    setCurrentPage(1);
  };
  
  // Toggle tag filter
  const toggleTag = (tag: string) => {
    setActiveTags(prev => 
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
    setCurrentPage(1);
  };
  
  // Clear all filters
  const clearFilters = () => {
    setActiveFilters([]);
    setActiveTags([]);
    setSearchQuery('');
    setCurrentPage(1);
    setSortOption('popular');
    setSearchParams({});
  };
  
  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };
  
  // Handle sort option change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
    setCurrentPage(1);
  };
  
  // Pagination handling
  const totalPages = Math.ceil(filteredGames.length / gamesPerPage);
  const indexOfLastGame = currentPage * gamesPerPage;
  const indexOfFirstGame = indexOfLastGame - gamesPerPage;
  const currentGames = filteredGames.slice(indexOfFirstGame, indexOfLastGame);
  
  // Page change
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  return (
    <div className="bg-gray-900 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link to="/" className="text-blue-500 hover:text-blue-400 flex items-center">
            <ChevronLeft size={20} />
            <span>Back to Home</span>
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-2">All Games</h1>
        <p className="text-gray-400 mb-8">Browse all available mini-games, use filters to find games that interest you</p>
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filter sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-gray-800/60 rounded-xl p-5 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-semibold">Filters</h3>
                {(activeFilters.length > 0 || activeTags.length > 0 || searchQuery) && (
                  <button 
                    onClick={clearFilters}
                    className="text-xs text-blue-400 hover:text-blue-300 flex items-center"
                  >
                    Clear All <X size={14} className="ml-1" />
                  </button>
                )}
              </div>
              
              {/* Search box */}
              <form onSubmit={handleSearch} className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-700 text-white rounded-lg border border-gray-600 py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Search games..."
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </form>
              
              {/* Active filters */}
              {(activeFilters.length > 0 || activeTags.length > 0) && (
                <div className="mb-6">
                  <h4 className="text-sm text-gray-400 mb-2">Selected Filters</h4>
                  <div className="flex flex-wrap gap-2">
                    {activeFilters.map(filter => (
                      <span 
                        key={`filter-${filter}`} 
                        className="px-2 py-1 bg-blue-600/40 text-blue-200 text-xs rounded-full flex items-center"
                        onClick={() => toggleFilter(filter)}
                      >
                        {filter} <X size={12} className="ml-1 cursor-pointer" />
                      </span>
                    ))}
                    
                    {activeTags.map(tag => (
                      <span 
                        key={`tag-${tag}`} 
                        className="px-2 py-1 bg-purple-600/40 text-purple-200 text-xs rounded-full flex items-center"
                        onClick={() => toggleTag(tag)}
                      >
                        {tag} <X size={12} className="ml-1 cursor-pointer" />
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Categories */}
              <div className="mb-6">
                <h4 className="text-sm text-gray-400 mb-2">Categories</h4>
                <div className="space-y-1">
                  {categories.map(category => (
                    <div 
                      key={category}
                      onClick={() => toggleFilter(category)}
                      className={`px-3 py-2 rounded-lg cursor-pointer flex items-center justify-between ${
                        activeFilters.includes(category) 
                          ? 'bg-blue-600/30 text-blue-200' 
                          : 'text-gray-300 hover:bg-gray-700/50'
                      }`}
                    >
                      <span>{category}</span>
                      {activeFilters.includes(category) && (
                        <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Tags */}
              <div className="mb-6">
                <h4 className="text-sm text-gray-400 mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {availableTags.slice(0, 20).map(tag => (
                    <span 
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-2 py-1 text-xs rounded-full cursor-pointer ${
                        activeTags.includes(tag)
                          ? 'bg-purple-600/40 text-purple-200'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Games grid */}
          <div className="flex-1">
            <div className="bg-gray-800/60 rounded-xl p-5 mb-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div className="mb-4 md:mb-0">
                  <h2 className="text-xl font-bold text-white">
                    {filteredGames.length} Games Found
                  </h2>
                  {(activeFilters.length > 0 || activeTags.length > 0 || searchQuery) && (
                    <p className="text-sm text-gray-400">
                      Filtered results based on your criteria
                    </p>
                  )}
                </div>
                
                <div className="flex items-center">
                  <label className="text-gray-400 mr-2 text-sm">Sort by:</label>
                  <select
                    value={sortOption}
                    onChange={handleSortChange}
                    className="bg-gray-700 text-white rounded-lg border border-gray-600 py-1 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="popular">Popularity</option>
                    <option value="newest">Newest</option>
                    <option value="name">Name</option>
                  </select>
                </div>
              </div>
              
              {currentGames.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {currentGames.map(game => (
                    <GameCard
                      key={game.id}
                      game={game}
                      onPlay={() => handleGameClick(game.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4">
                    <Search className="w-8 h-8 text-gray-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">No Games Found</h3>
                  <p className="text-gray-400 text-center max-w-md">
                    We couldn't find any games matching your criteria. Try adjusting your filters or search term.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => paginate(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className={`p-2 rounded-lg ${
                        currentPage === 1
                          ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                          : 'bg-gray-700 text-white hover:bg-gray-600'
                      }`}
                    >
                      <ChevronLeft size={16} />
                    </button>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      // Logic to show pages around current page
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => paginate(pageNum)}
                          className={`w-8 h-8 flex items-center justify-center rounded-lg ${
                            currentPage === pageNum
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-700 text-white hover:bg-gray-600'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className={`p-2 rounded-lg ${
                        currentPage === totalPages
                          ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                          : 'bg-gray-700 text-white hover:bg-gray-600'
                      }`}
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamesListPage; 