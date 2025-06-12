/**
 * Game Rating Fetcher
 * Fetches game ratings from crawled game rating data
 */

import { Game } from '../types/game';
import ratingsData from '../data/game_ratings.json';

// Type definitions
interface GameRating {
  id: string;
  rating: number;
  votes: number;
  source: string;
}

interface RatingsData {
  ratings: GameRating[];
  last_updated: string;
  source: string;
}

// Convert imported JSON data to the correct type
const gameRatings = ratingsData as unknown as RatingsData;

// Cache retrieved game ratings to avoid repeated queries
const ratingCache: Record<string, number> = {};

// Initialize cache
function initializeRatingCache() {
  gameRatings.ratings.forEach(rating => {
    ratingCache[rating.id] = rating.rating;
  });
  console.log(`Loaded ${gameRatings.ratings.length} game ratings from crawled data`);
}

// Initialize cache immediately
initializeRatingCache();

/**
 * Get game rating from crawled data
 * @param gameId Game ID
 * @returns Game rating (1.0-5.0)
 */
export async function fetchGameRating(gameId: string): Promise<number> {
  // If the game rating is already in cache, return directly
  if (ratingCache[gameId]) {
    return ratingCache[gameId];
  }
  
  // Simulate API request delay
  await new Promise(resolve => setTimeout(resolve, 50));
  
  // Find game rating in crawled data
  const gameRating = gameRatings.ratings.find(rating => rating.id === gameId);
  
  if (gameRating) {
    // Cache rating result
    ratingCache[gameId] = gameRating.rating;
    return gameRating.rating;
  } else {
    // If no rating data is found, use fixed rating based on ID
    const rating = generateConsistentRating(gameId);
    ratingCache[gameId] = rating;
    return rating;
  }
}

/**
 * Batch fetch ratings for multiple games
 * @param games Game list
 * @returns Game list with ratings
 */
export async function fetchGameRatings(games: Game[]): Promise<Game[]> {
  // Create a Promise array containing all game rating requests
  const ratingPromises = games.map(async (game) => {
    const rating = await fetchGameRating(game.id);
    return {
      ...game,
      rating
    };
  });
  
  // Fetch all game ratings in parallel
  return Promise.all(ratingPromises);
}

/**
 * Generate a consistent pseudo-random rating based on game ID
 * This function ensures the same game ID always generates the same rating
 * Only used when no crawled data is available
 * @param id Game ID
 * @returns Rating (1.0-5.0)
 */
function generateConsistentRating(id: string): number {
  // Use game ID string to generate a fixed random number
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash) + id.charCodeAt(i);
    hash |= 0; // Convert to 32-bit integer
  }
  
  // Convert hash value to rating between 1.0-5.0
  // Use different algorithm to ensure more reasonable rating distribution
  // Most game ratings are between 3.0-4.5, few excellent games close to 5.0, few poor games below 3.0
  const normalizedHash = Math.abs(hash) / 2147483647; // Normalize to 0-1
  
  // Use normal distribution to simulate more realistic rating distribution
  // Center at 4.0, most ratings concentrated between 3.0-4.5
  let rating = 4.0 + (normalizedHash - 0.5) * 2.0;
  
  // Ensure rating is within 1.0-5.0 range
  rating = Math.max(1.0, Math.min(5.0, rating));
  
  // Round to one decimal place
  return Math.round(rating * 10) / 10;
}

/**
 * Get game rating and vote count
 * @param gameId Game ID
 * @returns Game rating information, including rating and vote count
 */
export async function fetchGameRatingDetails(gameId: string): Promise<{ rating: number, votes: number }> {
  // Find game rating in crawled data
  const gameRating = gameRatings.ratings.find(rating => rating.id === gameId);
  
  if (gameRating) {
    return {
      rating: gameRating.rating,
      votes: gameRating.votes
    };
  } else {
    // If no rating data is found, use fixed rating based on ID and default vote count
    return {
      rating: generateConsistentRating(gameId),
      votes: Math.floor(Math.random() * 200) + 50 // Random vote count between 50-250
    };
  }
}

/**
 * Update game rating cache
 * For testing or manual rating updates
 */
export function updateRatingCache(gameId: string, rating: number): void {
  ratingCache[gameId] = rating;
}

/**
 * Clear rating cache
 */
export function clearRatingCache(): void {
  Object.keys(ratingCache).forEach(key => {
    delete ratingCache[key];
  });
  // Reinitialize cache
  initializeRatingCache();
} 