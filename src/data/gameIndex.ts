/**
 * 游戏索引文件
 * 此文件由脚本自动生成，请勿手动修改
 */

import { Game } from '../types/game';
import gamesData from './games.json';

// 类型断言为Game数组
const games = gamesData as unknown as Game[];

// 游戏ID索引
export const gamesById = games.reduce((acc, game) => {
  acc[game.id] = game;
  return acc;
}, {} as Record<string, Game>);

// 游戏Slug索引
export const gamesBySlug = games.reduce((acc, game) => {
  acc[game.slug] = game;
  return acc;
}, {} as Record<string, Game>);

// 游戏分类索引
export const gameCategories = Array.from(
  new Set(games.map(game => game.category))
).sort();

// 游戏标签索引
export const gameTags = Array.from(
  new Set(games.flatMap(game => game.tags))
).sort();

// 获取所有游戏
export function getAllGames(): Game[] {
  return games;
}

// 根据ID获取游戏
export function getGameById(id: string): Game | undefined {
  return gamesById[id];
}

// 根据Slug获取游戏
export function getGameBySlug(slug: string): Game | undefined {
  return gamesBySlug[slug];
}

// 根据分类获取游戏
export function getGamesByCategory(category: string): Game[] {
  return games.filter(game => game.category === category);
}

// 根据标签获取游戏
export function getGamesByTag(tag: string): Game[] {
  return games.filter(game => game.tags.includes(tag));
}

// 搜索游戏
export function searchGames(query: string): Game[] {
  const lowercaseQuery = query.toLowerCase();
  return games.filter(
    game => 
      game.title.toLowerCase().includes(lowercaseQuery) ||
      game.description.toLowerCase().includes(lowercaseQuery) ||
      game.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
}

// 游戏数据生成时间
export const lastUpdated = '2025-06-10T15:36:39.976Z';
