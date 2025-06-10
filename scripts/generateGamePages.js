/**
 * 游戏页面生成脚本
 * 根据games.json数据生成游戏路由配置
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateGamePages() {
  console.log('开始生成游戏页面...');
  
  try {
    // 读取游戏数据
    const dataPath = path.join(__dirname, '../src/data/games.json');
    const gamesData = JSON.parse(await fs.readFile(dataPath, 'utf8'));
    
    console.log(`找到 ${gamesData.length} 个游戏数据，开始生成页面配置...`);
    
    // 准备路由配置数组
    const routes = gamesData.map(game => ({
      path: `/games/${game.slug}`,
      component: 'GameDetail',
      props: { gameId: game.id }
    }));
    
    // 确保目录存在
    const routesDir = path.join(__dirname, '../src/routes');
    try {
      await fs.mkdir(routesDir, { recursive: true });
    } catch (error) {
      console.log('路由目录已存在');
    }
    
    // 将路由配置写入文件
    const routesFilePath = path.join(routesDir, 'gameRoutes.json');
    await fs.writeFile(
      routesFilePath,
      JSON.stringify(routes, null, 2)
    );
    
    console.log(`路由配置已生成: ${routesFilePath}`);
    
    // 生成游戏索引文件
    const gameIndexPath = path.join(__dirname, '../src/data/gameIndex.ts');
    const gameIndexContent = `/**
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
export const lastUpdated = '${new Date().toISOString()}';
`;
    
    await fs.writeFile(gameIndexPath, gameIndexContent);
    console.log(`游戏索引文件已生成: ${gameIndexPath}`);
    
    console.log('游戏页面生成完成!');
  } catch (error) {
    console.error('生成游戏页面时发生错误:', error);
    process.exit(1);
  }
}

// 执行生成
generateGamePages().catch(console.error); 