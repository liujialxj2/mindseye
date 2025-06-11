/**
 * 游戏数据类型定义
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
}

export type GamesList = Game[]; 