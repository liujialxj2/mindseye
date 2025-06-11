/**
 * 游戏数据抓取和处理工具
 */

import { Game, GamesList } from '../types/game';

// 模拟从本地 JSON 文件读取游戏数据
let cachedGames: GamesList = [];

/**
 * 获取所有游戏数据
 */
export function getAllGames(): GamesList {
  return cachedGames;
}

/**
 * 根据ID获取单个游戏
 */
export function getGameById(id: string): Game | undefined {
  return cachedGames.find(game => game.id === id);
}

/**
 * 根据slug获取单个游戏
 */
export function getGameBySlug(slug: string): Game | undefined {
  return cachedGames.find(game => game.slug === slug);
}

/**
 * 根据分类获取游戏
 */
export function getGamesByCategory(category: string): GamesList {
  return cachedGames.filter(game => game.category === category);
}

/**
 * 设置游戏数据（在应用初始化时从JSON文件加载）
 */
export function setGamesData(games: GamesList): void {
  cachedGames = games.map(game => ({
    ...game,
    // 如果没有slug，根据标题生成
    slug: game.slug || generateSlug(game.title)
  }));
}

/**
 * 根据标题生成slug
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // 移除特殊字符
    .replace(/\s+/g, '-') // 空格替换为连字符
    .replace(/--+/g, '-'); // 多个连字符替换为单个
}

/**
 * 添加新游戏到数据集
 */
export function addGame(game: Game): void {
  const newGame = {
    ...game,
    slug: game.slug || generateSlug(game.title)
  };
  cachedGames.push(newGame);
}

/**
 * 更新游戏数据
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
 * 删除游戏
 */
export function removeGame(id: string): boolean {
  const initialLength = cachedGames.length;
  cachedGames = cachedGames.filter(game => game.id !== id);
  return cachedGames.length !== initialLength;
} 