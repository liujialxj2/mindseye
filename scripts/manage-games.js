/**
 * 游戏数据管理脚本
 * 
 * 使用方式:
 * node manage-games.js <命令> [参数...]
 * 
 * 命令:
 * - add <游戏数据JSON字符串>: 添加单个游戏
 * - update <游戏ID> <更新数据JSON字符串>: 更新游戏数据
 * - remove <游戏ID>: 删除游戏
 * - import <类别> <数量>: 批量导入游戏
 * - list: 列出所有游戏
 * 
 * 示例:
 * node manage-games.js add '{"id":"my-game","title":"My Game","description":"Game description"}'
 * node manage-games.js update my-game '{"description":"Updated description"}'
 * node manage-games.js remove my-game
 * node manage-games.js import puzzle 10
 * node manage-games.js list
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 游戏数据文件路径
const gamesFilePath = path.join(__dirname, '../src/data/games.json');

// 读取游戏数据
function readGamesData() {
  try {
    const data = JSON.parse(fs.readFileSync(gamesFilePath, 'utf8'));
    return data.games || [];
  } catch (error) {
    console.error(`读取游戏数据文件失败: ${error.message}`);
    return [];
  }
}

// 写入游戏数据
function writeGamesData(games) {
  try {
    fs.writeFileSync(gamesFilePath, JSON.stringify({ games }, null, 2));
    return true;
  } catch (error) {
    console.error(`写入游戏数据文件失败: ${error.message}`);
    return false;
  }
}

// 添加新游戏
function addGame(gameData) {
  try {
    // 解析游戏数据
    const newGame = typeof gameData === 'string' ? JSON.parse(gameData) : gameData;
    
    // 验证必要字段
    const requiredFields = ['id', 'title', 'description', 'thumbnailUrl', 'iframeUrl'];
    const missingFields = requiredFields.filter(field => !newGame[field]);
    
    if (missingFields.length > 0) {
      console.error(`游戏数据缺少必要字段: ${missingFields.join(', ')}`);
      return false;
    }
    
    // 生成slug如果没有
    if (!newGame.slug) {
      newGame.slug = newGame.id;
    }
    
    // 读取现有游戏数据
    const games = readGamesData();
    
    // 检查ID是否已存在
    if (games.some(game => game.id === newGame.id)) {
      console.error(`ID为 ${newGame.id} 的游戏已经存在`);
      return false;
    }
    
    // 添加游戏
    games.push(newGame);
    
    // 写入文件
    if (writeGamesData(games)) {
      console.log(`成功添加游戏: ${newGame.title} (ID: ${newGame.id})`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`添加游戏失败: ${error.message}`);
    return false;
  }
}

// 更新游戏数据
function updateGame(gameId, updatedData) {
  try {
    // 解析更新数据
    const updates = typeof updatedData === 'string' ? JSON.parse(updatedData) : updatedData;
    
    // 读取现有游戏数据
    const games = readGamesData();
    
    // 查找游戏索引
    const gameIndex = games.findIndex(game => game.id === gameId);
    
    if (gameIndex === -1) {
      console.error(`未找到ID为 ${gameId} 的游戏`);
      return false;
    }
    
    // 更新游戏数据
    games[gameIndex] = { ...games[gameIndex], ...updates };
    
    // 写入文件
    if (writeGamesData(games)) {
      console.log(`成功更新游戏: ${games[gameIndex].title} (ID: ${gameId})`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`更新游戏失败: ${error.message}`);
    return false;
  }
}

// 删除游戏
function removeGame(gameId) {
  try {
    // 读取现有游戏数据
    const games = readGamesData();
    
    // 查找游戏
    const gameToRemove = games.find(game => game.id === gameId);
    
    if (!gameToRemove) {
      console.error(`未找到ID为 ${gameId} 的游戏`);
      return false;
    }
    
    // 过滤掉要删除的游戏
    const filteredGames = games.filter(game => game.id !== gameId);
    
    // 写入文件
    if (writeGamesData(filteredGames)) {
      console.log(`成功删除游戏: ${gameToRemove.title} (ID: ${gameId})`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`删除游戏失败: ${error.message}`);
    return false;
  }
}

// 批量导入游戏
async function importGames(categoryName, count) {
  try {
    // 执行抓取脚本
    console.log(`开始从 CrazyGames 抓取 ${count} 个 ${categoryName} 类别的游戏...`);
    
    execSync(`node ${path.join(__dirname, 'games-scraper.js')} ${categoryName} ${count}`, { 
      stdio: 'inherit'
    });
    
    console.log('游戏导入完成');
    return true;
  } catch (error) {
    console.error(`导入游戏失败: ${error.message}`);
    return false;
  }
}

// 列出所有游戏
function listGames() {
  try {
    const games = readGamesData();
    
    if (games.length === 0) {
      console.log('没有游戏数据');
      return true;
    }
    
    console.log(`共有 ${games.length} 个游戏:`);
    
    // 按类别分组
    const gamesByCategory = {};
    games.forEach(game => {
      const category = game.category || 'uncategorized';
      if (!gamesByCategory[category]) {
        gamesByCategory[category] = [];
      }
      gamesByCategory[category].push(game);
    });
    
    // 输出游戏信息
    Object.keys(gamesByCategory).sort().forEach(category => {
      console.log(`\n类别: ${category} (${gamesByCategory[category].length} 个游戏)`);
      gamesByCategory[category].forEach(game => {
        console.log(`  - ${game.title} (ID: ${game.id})`);
      });
    });
    
    return true;
  } catch (error) {
    console.error(`列出游戏失败: ${error.message}`);
    return false;
  }
}

// 命令行参数处理
const [command, ...args] = process.argv.slice(2);

switch (command) {
  case 'add':
    // 添加单个游戏
    addGame(args[0]);
    break;
    
  case 'update':
    // 更新游戏数据
    if (args.length < 2) {
      console.error('缺少参数: 游戏ID 和 更新数据');
    } else {
      updateGame(args[0], args[1]);
    }
    break;
    
  case 'remove':
    // 删除游戏
    if (!args[0]) {
      console.error('缺少参数: 游戏ID');
    } else {
      removeGame(args[0]);
    }
    break;
    
  case 'import':
    // 批量导入游戏
    importGames(args[0] || 'popular', args[1] || 20);
    break;
    
  case 'list':
    // 列出所有游戏
    listGames();
    break;
    
  default:
    console.log('可用命令: add, update, remove, import, list');
    console.log('使用 "node manage-games.js <命令> --help" 获取更多帮助');
    break;
} 