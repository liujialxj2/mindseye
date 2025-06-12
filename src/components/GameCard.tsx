import React, { useState, useEffect } from 'react';
import { Play, Star, ChevronRight, Award } from 'lucide-react';
import { Game } from '../types/game';
import { Link } from 'react-router-dom';
import { fetchGameRatingDetails } from '../utils/gameRatingFetcher';

interface GameCardProps {
  game: Game;
  onPlay?: (gameId: string) => void;
}

// Category styles with colors and icons
const categoryStyles: Record<string, { color: string, gradient: string }> = {
  'Action': { color: 'from-red-500 to-orange-600', gradient: 'border-l-red-500' },
  'Adventure': { color: 'from-green-500 to-emerald-600', gradient: 'border-l-green-500' },
  'Puzzle': { color: 'from-blue-500 to-indigo-600', gradient: 'border-l-blue-500' },
  'Racing': { color: 'from-yellow-500 to-amber-600', gradient: 'border-l-yellow-500' },
  'Shooter': { color: 'from-purple-500 to-violet-600', gradient: 'border-l-purple-500' },
  'Sports': { color: 'from-blue-400 to-sky-600', gradient: 'border-l-blue-400' },
  'Strategy': { color: 'from-teal-500 to-cyan-600', gradient: 'border-l-teal-500' },
  'Casual': { color: 'from-pink-500 to-rose-600', gradient: 'border-l-pink-500' },
  'Match-3': { color: 'from-violet-500 to-fuchsia-600', gradient: 'border-l-violet-500' },
  'Dress-up': { color: 'from-pink-400 to-fuchsia-500', gradient: 'border-l-pink-400' },
  'Art': { color: 'from-indigo-500 to-purple-600', gradient: 'border-l-indigo-500' }
};

// Default style
const defaultStyle = { color: 'from-gray-500 to-gray-600', gradient: 'border-l-gray-500' };

// Set fixed height constants
const CARD_HEIGHT = 380; // Total card height
const IMAGE_HEIGHT = 180; // Image area height
const CONTENT_HEIGHT = CARD_HEIGHT - IMAGE_HEIGHT; // Content area height

const GameCard: React.FC<GameCardProps> = ({ game, onPlay }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [ratingDetails, setRatingDetails] = useState<{ rating: number, votes: number } | null>(null);
  
  // Get game rating details
  useEffect(() => {
    const loadRatingDetails = async () => {
      try {
        const details = await fetchGameRatingDetails(game.id);
        setRatingDetails(details);
      } catch (error) {
        console.error('Failed to fetch game rating:', error);
      }
    };
    
    loadRatingDetails();
  }, [game.id]);
  
  // Handle game source display
  const isGameDistribution = game.iframeUrl?.includes('gamedistribution.com');
  const isCrazyGames = game.iframeUrl?.includes('crazygames.com');
  
  // Get category style
  const getCategoryStyle = () => {
    return categoryStyles[game.category] || defaultStyle;
  };
  
  // Get game rating, show default if not available
  const displayRating = ratingDetails ? ratingDetails.rating.toFixed(1) : (game.rating ? game.rating.toFixed(1) : '4.0');
  
  // Format vote count
  const formatVotes = (votes: number): string => {
    if (votes >= 1000) {
      return `${(votes / 1000).toFixed(1)}k`;
    }
    return votes.toString();
  };
  
  return (
    <div 
      className="group rounded-xl overflow-hidden relative transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: `linear-gradient(to bottom, rgba(30, 41, 59, ${isHovered ? '0.85' : '0.8'}), rgba(15, 23, 42, ${isHovered ? '0.95' : '0.9'}))`,
        boxShadow: isHovered ? '0 8px 20px rgba(0, 0, 0, 0.15)' : '0 4px 6px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        height: `${CARD_HEIGHT}px`, // Set fixed height
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Border effect - Left color bar */}
      <div 
        className={`absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 opacity-${isHovered ? '100' : '60'}`}
        style={{
          background: `linear-gradient(to bottom, ${getCategoryStyle().gradient.replace('border-l-', 'rgb(')}, rgba(30, 41, 59, 0.3))`,
        }}
      />
        
      {/* Fixed height image container */}
      <div className="relative w-full overflow-hidden" style={{ height: `${IMAGE_HEIGHT}px` }}>
        {/* Thumbnail */}
        <img
          src={game.thumbnailUrl || '/placeholder-game.jpg'}
          alt={`${game.title} thumbnail`}
          className="w-full h-full object-cover transition-transform duration-500"
          style={{
            filter: isHovered ? 'brightness(1.05) contrast(1.05)' : 'brightness(1) contrast(1)',
            transform: isHovered ? 'scale(1.03)' : 'scale(1)',
          }}
          loading="lazy"
        />
        
        {/* Category label */}
        <div className="absolute top-2 left-2 flex gap-1 z-10">
          <span className={`px-2 py-1 text-xs rounded bg-gradient-to-r ${getCategoryStyle().color} text-white shadow-md transition-transform duration-300`}
            style={{
              transform: isHovered ? 'translateY(0)' : 'translateY(0)'
            }}
          >
            {game.category}
          </span>
        </div>
        
        {/* Play button overlay - Gradient appearance */}
        <div 
          className="absolute inset-0 flex items-center justify-center transition-all duration-300 ease-in-out"
          style={{
            background: isHovered 
              ? 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0.1) 80%, rgba(0,0,0,0) 100%)' 
              : 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0) 100%)',
            opacity: isHovered ? 1 : 0.6
          }}
        >
          <div 
            className="w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out"
            style={{
              backdropFilter: 'blur(2px)',
              transform: `translateY(${isHovered ? '0' : '10px'})`,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
            }}
            onClick={() => onPlay && onPlay(game.id)}
          >
            <Play className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
      
      {/* Fixed height content container */}
      <div className="flex-1 p-4 flex flex-col" style={{ height: `${CONTENT_HEIGHT}px` }}>
        <div className="flex justify-between items-start mb-2">
          <Link to={`/games/${game.id}`} className="block group/title">
            <h3 className="text-lg font-bold text-white transition-colors duration-200 line-clamp-1 group-hover/title:text-blue-400">
              {game.title}
            </h3>
          </Link>
          
          {/* Rating */}
          <div 
            className="flex items-center bg-gray-800 rounded-full px-2 py-1 transition-transform duration-200"
            style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
            title={ratingDetails ? `${ratingDetails.rating.toFixed(1)}/5.0 (${ratingDetails.votes} votes)` : ''}
          >
            <Star className="h-3 w-3 text-yellow-500 mr-1" fill="#EAB308" />
            <span className="text-xs font-semibold text-white">{displayRating}</span>
            {ratingDetails && (
              <span className="text-xs text-gray-400 ml-1">({formatVotes(ratingDetails.votes)})</span>
            )}
          </div>
        </div>
        
        {/* Game description - Fixed height */}
        <p className="text-gray-400 text-sm mb-3 line-clamp-3" style={{ minHeight: '60px' }}>
          {game.description}
        </p>
        
        {/* Game tags - Fixed height area */}
        <div className="flex flex-wrap gap-1 mb-3" style={{ minHeight: '26px', overflow: 'hidden' }}>
          {game.tags && game.tags.slice(0, 3).map((tag: string, index: number) => (
            <span 
              key={index} 
              className="text-xs px-2 py-0.5 bg-gray-800/80 text-gray-300 rounded-full transition-all duration-200"
              style={{ 
                transform: isHovered ? 'translateY(0)' : 'translateY(0)',
                opacity: isHovered ? 1 : 0.8
              }}
            >
              {tag}
            </span>
          ))}
        </div>
        
        {/* Button area - Fixed at bottom */}
        <div className="flex justify-between items-center mt-auto">
          <button 
            onClick={() => onPlay && onPlay(game.id)}
            className="px-3 py-1.5 text-sm rounded-lg flex items-center justify-center transition-all duration-300 w-24"
            style={{ 
              background: isHovered 
                ? 'linear-gradient(to right, rgb(37, 99, 235), rgb(124, 58, 237))' 
                : 'rgb(37, 99, 235)',
              color: 'white',
              transform: isHovered ? 'translateY(0)' : 'translateY(0)'
            }}
          >
            <Play className="h-3 w-3 mr-1" /> Play
          </button>
          
          <Link 
            to={`/games/${game.id}`}
            className="px-3 py-1.5 text-sm bg-gray-800/70 text-gray-300 hover:text-white rounded-lg transition-all duration-200 flex items-center justify-center w-24"
            style={{ backdropFilter: 'blur(3px)' }}
          >
            Details <ChevronRight className="h-3 w-3 ml-1 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GameCard; 