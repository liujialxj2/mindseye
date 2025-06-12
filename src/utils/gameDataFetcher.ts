/**
 * Game data fetching and processing utilities
 */

import { Game, GamesList } from '../types/game';
import { fetchGameRatings } from './gameRatingFetcher';

// Simulate reading game data from local JSON file
let cachedGames: GamesList = [];
let hasLoadedRatings = false;

/**
 * Get all game data
 */
export function getAllGames(): GamesList {
  // If ratings haven't been loaded yet, try to load them asynchronously
  if (!hasLoadedRatings) {
    loadGameRatings();
  }
  return cachedGames;
}

/**
 * Asynchronously load game ratings
 */
async function loadGameRatings(): Promise<void> {
  try {
    hasLoadedRatings = true;
    // Asynchronously get rating data and update cache
    const gamesWithRatings = await fetchGameRatings(cachedGames);
    cachedGames = gamesWithRatings;
    console.log('Game rating data loaded successfully');
  } catch (error) {
    console.error('Failed to load game rating data:', error);
  }
}

/**
 * Get a single game by ID
 */
export function getGameById(id: string): Game | undefined {
  return cachedGames.find(game => game.id === id);
}

/**
 * Get a single game by slug
 */
export function getGameBySlug(slug: string): Game | undefined {
  return cachedGames.find(game => game.slug === slug);
}

/**
 * Get games by category
 */
export function getGamesByCategory(category: string): GamesList {
  return cachedGames.filter(game => game.category === category);
}

/**
 * Set game data (loaded from JSON file during application initialization)
 */
export function setGamesData(games: GamesList): void {
  cachedGames = games.map(game => ({
    ...game,
    // Generate slug from title if not provided
    slug: game.slug || generateSlug(game.title)
  }));
  
  // Reset rating load status to load ratings next time games are fetched
  hasLoadedRatings = false;
}

/**
 * Generate slug from title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/--+/g, '-'); // Replace multiple hyphens with a single one
}

/**
 * Add a new game to the dataset
 */
export function addGame(game: Game): void {
  const newGame = {
    ...game,
    slug: game.slug || generateSlug(game.title)
  };
  cachedGames.push(newGame);
}

/**
 * Update game data
 */
export function updateGame(id: string, updatedData: Partial<Game>): boolean {
  const index = cachedGames.findIndex(game => game.id === id);
  if (index !== -1) {
    cachedGames[index] = { 
      ...cachedGames[index], 
      ...updatedData,
      slug: updatedData.title 
        ? generateSlug(updatedData.title) 
        : cachedGames[index].slug
    };
    return true;
  }
  return false;
}

/**
 * Remove a game
 */
export function removeGame(id: string): boolean {
  const initialLength = cachedGames.length;
  cachedGames = cachedGames.filter(game => game.id !== id);
  return cachedGames.length !== initialLength;
} 