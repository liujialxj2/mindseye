/**
 * 游戏数据抓取脚本
 * 用于从CrazyGames网站抓取游戏数据，并保存为JSON文件
 */

import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 主要抓取函数
 */
async function scrapeGames() {
  console.log('开始抓取游戏数据...');
  
  // 启动浏览器
  const browser = await puppeteer.launch({ 
    headless: 'new', // 使用新的无头模式
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });
  
  try {
    const page = await browser.newPage();
    
    // 设置视口
    await page.setViewport({ width: 1920, height: 1080 });
    
    // 设置用户代理
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    // 访问CrazyGames首页
    console.log('正在访问CrazyGames首页...');
    await page.goto('https://www.crazygames.com/', { 
      waitUntil: 'networkidle2',
      timeout: 60000
    });
    
    // 等待游戏卡片加载
    await page.waitForSelector('.card-game-wrapper, .game-item', { timeout: 30000 });
    
    // 获取游戏列表
    console.log('正在提取游戏列表...');
    const games = await page.evaluate(() => {
      // 查找所有游戏卡片元素
      const gameElements = document.querySelectorAll('.card-game-wrapper, .game-item');
      
      // 提取游戏数据
      return Array.from(gameElements).slice(0, 20).map(gameElement => {
        // 找到标题、图片和链接
        const title = gameElement.querySelector('.card-game-name, .game-title')?.textContent?.trim() || 'Unknown Game';
        const imgElement = gameElement.querySelector('img');
        const thumbnailUrl = imgElement?.src || imgElement?.dataset?.src || '';
        const link = gameElement.querySelector('a')?.href || '';
        
        return {
          title,
          thumbnailUrl,
          gameUrl: link,
          slug: title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
        };
      });
    });
    
    console.log(`找到 ${games.length} 个游戏，开始获取详细信息...`);
    
    // 获取每个游戏的详细信息
    const detailedGames = [];
    
    for (let i = 0; i < games.length; i++) {
      const game = games[i];
      console.log(`处理游戏 ${i + 1}/${games.length}: ${game.title}`);
      
      try {
        // 访问游戏页面
        await page.goto(game.gameUrl, { 
          waitUntil: 'networkidle2',
          timeout: 30000
        });
        
        // 提取详细信息
        const details = await page.evaluate(() => {
          // 游戏描述
          const description = document.querySelector('.game-description')?.textContent?.trim() || 
                             document.querySelector('meta[name="description"]')?.content || 
                             '体验这款精彩的在线游戏';
          
          // 游戏说明
          const instructions = document.querySelector('.game-instructions')?.textContent?.trim() || 
                              document.querySelector('.game-controls, .controls')?.textContent?.trim() || 
                              '使用键盘和鼠标控制游戏。具体操作请参见游戏内提示。';
          
          // 尝试获取iframe URL
          let iframeUrl = document.querySelector('iframe')?.src || '';
          
          // 如果找不到iframe，尝试从script标签获取
          if (!iframeUrl) {
            const scripts = Array.from(document.querySelectorAll('script'));
            for (const script of scripts) {
              if (script.textContent && script.textContent.includes('iframe') && script.textContent.includes('src=')) {
                const match = script.textContent.match(/src=["']([^"']+)["']/);
                if (match && match[1]) {
                  iframeUrl = match[1];
                  break;
                }
              }
            }
          }
          
          // 游戏类别
          const category = document.querySelector('.tag')?.textContent?.trim() || '休闲游戏';
          
          // 游戏标签
          const tags = Array.from(document.querySelectorAll('.tag, .category')).map(tag => tag.textContent.trim());
          
          // 游戏亮点
          const highlights = Array.from(document.querySelectorAll('.game-features li, .features li')).map(el => el.textContent.trim());
          
          return {
            description,
            instructions,
            embedUrl: iframeUrl,
            category,
            tags: [...new Set(tags)], // 去重
            highlights
          };
        });
        
        // 如果没有找到嵌入URL，构造一个
        if (!details.embedUrl) {
          const gameId = game.gameUrl.split('/').pop() || game.slug;
          details.embedUrl = `https://html5.gamedistribution.com/${gameId}/?gd_sdk_referrer_url=https://mindseye-88s.pages.dev`;
        }
        
        // 合并基本信息和详细信息
        detailedGames.push({
          id: `game-${i + 1}`,
          ...game,
          ...details,
          // 确保有亮点
          highlights: details.highlights.length > 0 ? details.highlights : [
            `${game.title}提供流畅的游戏体验`,
            '精美的图形和动画效果',
            '简单易上手的操作',
            '适合所有年龄段的玩家',
            '无需下载，即点即玩'
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        
      } catch (error) {
        console.error(`获取游戏 ${game.title} 详情时出错:`, error.message);
        
        // 即使出错也添加基本信息
        detailedGames.push({
          id: `game-${i + 1}`,
          ...game,
          description: `体验精彩的${game.title}游戏`,
          instructions: '使用键盘和鼠标控制游戏。具体操作请参见游戏内提示。',
          embedUrl: `https://html5.gamedistribution.com/${game.slug}/?gd_sdk_referrer_url=https://mindseye-88s.pages.dev`,
          category: '休闲游戏',
          tags: ['HTML5', '在线游戏'],
          highlights: [
            `${game.title}提供流畅的游戏体验`,
            '精美的图形和动画效果',
            '简单易上手的操作',
            '适合所有年龄段的玩家',
            '无需下载，即点即玩'
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
      
      // 短暂暂停，避免请求过于频繁
      await page.waitForTimeout(1000);
    }
    
    // 确保目录存在
    const dataDir = path.join(__dirname, '../src/data');
    try {
      await fs.mkdir(dataDir, { recursive: true });
    } catch (error) {
      console.log('数据目录已存在');
    }
    
    // 保存到JSON文件
    const filePath = path.join(dataDir, 'games.json');
    await fs.writeFile(
      filePath,
      JSON.stringify(detailedGames, null, 2)
    );
    
    console.log(`抓取完成! 成功获取 ${detailedGames.length} 个游戏数据，保存到 ${filePath}`);
  } catch (error) {
    console.error('抓取过程中出现错误:', error);
  } finally {
    await browser.close();
  }
}

// 执行抓取
scrapeGames().catch(error => {
  console.error('脚本执行失败:', error);
  process.exit(1);
}); 