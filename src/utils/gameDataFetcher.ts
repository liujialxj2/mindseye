/**
 * 游戏数据抓取工具
 * 用于从CrazyGames网站抓取游戏数据并进行处理
 */

// 需要安装这些依赖: npm install axios cheerio @types/node
import axios from 'axios';
import { load, type CheerioAPI } from 'cheerio';
import { Game } from '../types/game';

/**
 * 从CrazyGames获取游戏数据
 * @param limit 获取游戏数量
 * @returns 处理后的游戏数据数组
 */
export async function fetchGamesFromCrazyGames(limit: number = 10): Promise<Game[]> {
  try {
    // 获取CrazyGames首页内容
    const response = await axios.get('https://www.crazygames.com/');
    const $ = load(response.data);
    
    const games: Partial<Game>[] = [];
    
    // 查找并解析游戏卡片元素
    $('.game-item, .game-card').slice(0, limit).each((index: number, element) => {
      const $element = $(element);
      
      // 提取游戏信息
      const title = $element.find('.game-title, h3').text().trim();
      const thumbnailUrl = $element.find('img').attr('src') || '';
      const gameUrl = $element.find('a').attr('href') || '';
      const slug = generateSlug(title);
      
      games.push({
        id: `game-${index + 1}`,
        title,
        thumbnailUrl,
        slug,
        embedUrl: '', // 需要访问详情页获取
        description: '', // 需要访问详情页获取
        instructions: '', // 需要访问详情页获取
        highlights: [],
        category: '休闲游戏',
        tags: ['HTML5', '在线游戏'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    });
    
    // 获取每个游戏的详细信息
    const detailedGames = await Promise.all(
      games.map(async (game) => {
        if (!game.title) return game;
        
        try {
          // 构建完整URL
          const fullUrl = game.gameUrl || `https://www.crazygames.com/game/${game.slug}`;
          const detailResponse = await axios.get(fullUrl);
          const detail$ = load(detailResponse.data);
          
          // 提取详细信息
          const description = detail$('.game-description, meta[name="description"]').text().trim() || 
                             detail$('meta[name="description"]').attr('content') || 
                             `体验精彩的${game.title}游戏`;
          
          const instructions = detail$('.game-instructions, .game-controls').text().trim() || 
                              '使用键盘和鼠标控制游戏。具体操作请参见游戏内提示。';
          
          // 提取iframe URL (这需要根据实际网站结构调整)
          let embedUrl = detail$('iframe').attr('src') || '';
          
          // 如果没有直接找到iframe，可能需要通过其他方式构建嵌入URL
          if (!embedUrl) {
            // 提取游戏ID
            const gameId = fullUrl.split('/').pop() || game.slug;
            
            // 构建通用的GameDistribution嵌入URL
            // 浏览器环境
            const origin = typeof window !== 'undefined' ? window.location.origin : 'https://mindseye-88s.pages.dev';
            embedUrl = `https://html5.gamedistribution.com/${gameId}/?gd_sdk_referrer_url=${encodeURIComponent(origin)}`;
          }
          
          // 提取亮点信息
          const highlights = detail$('.game-highlights li, .features li').map((_: number, el) => $(el).text().trim()).get();
          
          return {
            ...game,
            description,
            instructions,
            embedUrl,
            highlights: highlights.length ? highlights : generateDefaultHighlights(game.title || ''),
          };
        } catch (error) {
          console.error(`获取游戏 ${game.title} 详情失败:`, error);
          return game;
        }
      })
    );
    
    return detailedGames as Game[];
  } catch (error) {
    console.error('抓取游戏数据失败:', error);
    return [];
  }
}

/**
 * 生成URL友好的slug
 * @param title 游戏标题
 * @returns slug字符串
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\u4e00-\u9fa5a-z0-9]+/g, '-') // 保留中文、英文字母和数字，其他替换为连字符
    .replace(/^-+|-+$/g, '') // 去除首尾连字符
    .replace(/-+/g, '-'); // 多个连字符替换为单个
}

/**
 * 为没有亮点的游戏生成默认亮点
 * @param title 游戏标题
 * @returns 默认亮点数组
 */
function generateDefaultHighlights(title: string): string[] {
  return [
    `${title}提供流畅的游戏体验`,
    '精美的图形和动画效果',
    '简单易上手的操作',
    '适合所有年龄段的玩家',
    '无需下载，即点即玩'
  ];
}

/**
 * 使用Puppeteer进行高级抓取（需要在Node.js环境中运行）
 * 此功能仅在服务器端脚本中使用，不在浏览器环境中调用
 */
export async function scrapeGamesWithPuppeteer(): Promise<void> {
  console.log('此功能需要在Node.js环境中使用Puppeteer运行');
  // 实际实现请参考scripts/fetchGames.js
}

/**
 * 从本地JSON文件加载游戏数据
 */
export function loadGamesFromLocal(): Game[] {
  try {
    // 在浏览器环境中，动态导入不会像在Node.js中使用require那样工作
    // 这里假设已经有一个导入的JSON数据或者会被webpack等构建工具处理
    // 实际使用时，需要根据构建环境调整导入方式
    const gamesData = [] as Game[]; // 实际项目中应该替换为正确的导入方式
    return gamesData;
  } catch (error) {
    console.error('加载本地游戏数据失败:', error);
    return [];
  }
} 