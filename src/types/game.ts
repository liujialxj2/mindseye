/**
 * Game data type definition
 */

export interface Game {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  iframeUrl: string;
  controls: string;
  highlights: string[];
  originalUrl: string;
  category: string;
  slug?: string;
  tags?: string[];
  createdAt?: number; // Game creation/addition timestamp
  rating?: number; // Game rating
}

export type GamesList = Game[]; 