#!/usr/bin/env node

/**
 * 游戏数据自动更新脚本
 * 
 * 此脚本会运行游戏爬虫更新游戏数据，并可以被设置为定时任务
 * 
 * 使用方法:
 * node update-games.js [pages=5]
 * 
 * 参数:
 * - pages: 要爬取的页数，默认为5页
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// 脚本配置
const CONFIG = {
  // 默认爬取页数
  defaultPages: 5,
  
  // Python爬虫脚本路径
  crawlerScript: path.join(__dirname, 'gamedistribution-scraper.py'),
  
  // 游戏数据文件
  gamesDataFile: path.join(__dirname, '../src/data/games.json'),
  
  // 游戏数据备份目录
  backupDir: path.join(__dirname, '../src/data/backups'),
  
  // 日志文件
  logFile: path.join(__dirname, '../logs/update-games.log')
};

// 确保日志目录存在
const logDir = path.dirname(CONFIG.logFile);
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// 确保备份目录存在
if (!fs.existsSync(CONFIG.backupDir)) {
  fs.mkdirSync(CONFIG.backupDir, { recursive: true });
}

/**
 * 记录日志
 * @param {string} message - 日志消息
 */
function log(message) {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${message}\n`;
  
  // 输出到控制台
  console.log(logEntry.trim());
  
  // 写入日志文件
  fs.appendFileSync(CONFIG.logFile, logEntry);
}

/**
 * 备份当前游戏数据
 */
function backupGamesData() {
  try {
    if (fs.existsSync(CONFIG.gamesDataFile)) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFile = path.join(CONFIG.backupDir, `games-${timestamp}.json`);
      
      fs.copyFileSync(CONFIG.gamesDataFile, backupFile);
      log(`已备份游戏数据到 ${backupFile}`);
      
      // 清理旧备份，只保留最新的10个
      const backupFiles = fs.readdirSync(CONFIG.backupDir)
        .filter(file => file.startsWith('games-'))
        .sort()
        .reverse();
      
      if (backupFiles.length > 10) {
        backupFiles.slice(10).forEach(file => {
          fs.unlinkSync(path.join(CONFIG.backupDir, file));
          log(`已删除旧备份文件 ${file}`);
        });
      }
      
      return true;
    } else {
      log(`游戏数据文件 ${CONFIG.gamesDataFile} 不存在，跳过备份`);
      return false;
    }
  } catch (error) {
    log(`备份游戏数据失败: ${error.message}`);
    return false;
  }
}

/**
 * 运行游戏爬虫
 * @param {number} pages - 爬取页数
 */
function runCrawler(pages) {
  try {
    log(`开始运行游戏爬虫，爬取 ${pages} 页...`);
    
    // 运行 Python 爬虫脚本
    const pythonPath = process.platform === 'win32' ? 'python' : 'python3';
    const result = execSync(`${pythonPath} "${CONFIG.crawlerScript}" ${pages}`, {
      encoding: 'utf8',
      stdio: 'pipe'
    });
    
    log('爬虫输出:');
    log(result);
    log('爬虫运行完成');
    
    return true;
  } catch (error) {
    log(`运行爬虫失败: ${error.message}`);
    if (error.stdout) {
      log(`标准输出: ${error.stdout}`);
    }
    if (error.stderr) {
      log(`错误输出: ${error.stderr}`);
    }
    return false;
  }
}

/**
 * 主函数
 */
function main() {
  log('开始更新游戏数据');
  
  // 解析命令行参数
  const args = process.argv.slice(2);
  const pages = parseInt(args[0], 10) || CONFIG.defaultPages;
  
  // 备份当前数据
  backupGamesData();
  
  // 运行爬虫
  const success = runCrawler(pages);
  
  if (success) {
    log('游戏数据更新成功');
  } else {
    log('游戏数据更新失败');
  }
}

// 运行主函数
main(); 