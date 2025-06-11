/**
 * Mindseye网站部署脚本
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 定义颜色
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  red: '\x1b[31m'
};

// 打印彩色日志
function log(message, color = '') {
  console.log(`${color}${message}${colors.reset}`);
}

// 执行命令并返回输出
function execCommand(command) {
  try {
    log(`执行命令: ${command}`, colors.dim);
    return execSync(command, { encoding: 'utf8', stdio: 'inherit' });
  } catch (error) {
    log(`命令执行失败: ${error.message}`, colors.red);
    process.exit(1);
  }
}

// 主函数
async function deploy() {
  try {
    // 显示欢迎消息
    log('\n🚀 Mindseye网站部署开始...', colors.bright + colors.green);
    
    // 1. 清理构建目录
    log('\n📦 第1步：清理构建目录...', colors.bright + colors.blue);
    if (fs.existsSync('dist')) {
      execCommand('rm -rf dist');
    }
    
    // 2. 构建项目
    log('\n🔨 第2步：构建项目...', colors.bright + colors.blue);
    execCommand('npm run build');
    
    // 3. 优化构建结果
    log('\n🔍 第3步：优化构建结果...', colors.bright + colors.blue);
    
    // 3.1 确保public文件被复制到dist
    log('  - 复制public文件到dist...', colors.cyan);
    const publicFiles = [
      'gameDistributionInit.js',
      'gdgame-adapter.js',
      'gd-style-fix.css',
      'gd-domain-bridge.js',
      'game-compatibility.js',
      'game-frame-proxy.html'
    ];
    
    publicFiles.forEach(file => {
      if (fs.existsSync(`public/${file}`)) {
        if (!fs.existsSync('dist')) {
          fs.mkdirSync('dist');
        }
        fs.copyFileSync(`public/${file}`, `dist/${file}`);
        log(`    ✓ 复制了 ${file}`, colors.green);
      } else {
        log(`    ! 未找到 ${file}`, colors.yellow);
      }
    });
    
    // 3.2 复制游戏数据文件
    log('  - 复制游戏数据文件...', colors.cyan);
    const dataDir = path.join('dist', 'src', 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    if (fs.existsSync('src/data/games.json')) {
      fs.copyFileSync('src/data/games.json', path.join(dataDir, 'games.json'));
      log(`    ✓ 复制了 games.json 数据文件`, colors.green);
    } else {
      log(`    ! 未找到 games.json 数据文件`, colors.yellow);
    }
    
    // 4. 部署到Cloudflare Pages
    log('\n🚀 第4步：部署到Cloudflare Pages...', colors.bright + colors.blue);
    
    // 使用wrangler进行部署
    try {
      log('  - 正在部署...', colors.cyan);
      execCommand('npx wrangler pages deploy dist --project-name=mindseye-88s');
      log('  ✓ 部署完成！', colors.green);
    } catch (error) {
      log(`  ✗ 部署失败: ${error.message}`, colors.red);
      process.exit(1);
    }
    
    // 5. 部署后清理
    log('\n🧹 第5步：清理临时文件...', colors.bright + colors.blue);
    // 这里可以添加部署后的清理工作
    
    // 显示成功消息
    log('\n✅ 部署成功完成！', colors.bright + colors.green);
    log('您的网站已经成功部署到 Cloudflare Pages。', colors.green);
    log('网址: https://mindseye-88s.pages.dev', colors.green);
    
  } catch (error) {
    log(`\n❌ 部署过程中出错: ${error.message}`, colors.bright + colors.red);
    process.exit(1);
  }
}

// 执行部署
deploy(); 