# Mindseye 多游戏系统设计方案

## 项目概述

本文档描述了如何为 Mindseye 游戏官方网站实现一个可扩展的多游戏系统，实现从 CrazyGames 自动抓取游戏信息，并批量管理多个游戏内页的解决方案。

## 系统架构

### 整体架构

```
mindseye/
├── src/
│   ├── components/
│   │   ├── games/
│   │   │   ├── GameCard.tsx         # 游戏卡片组件（用于主页展示）
│   │   │   ├── GameDetail.tsx       # 游戏详情页面组件
│   │   │   ├── GameControls.tsx     # 游戏控制组件
│   │   │   └── GameInstructions.tsx # 游戏说明组件
│   ├── pages/
│   │   ├── games/
│   │   │   ├── index.tsx            # 游戏列表页面
│   │   │   └── [slug].tsx           # 动态游戏详情页面
│   ├── utils/
│   │   ├── gameDataFetcher.ts       # 游戏数据抓取工具
│   │   └── gameDataProcessor.ts     # 游戏数据处理工具
│   ├── data/
│   │   └── games.json               # 游戏元数据存储
└── scripts/
    ├── fetchGames.js                # 游戏数据抓取脚本
    └── generateGamePages.js         # 游戏页面批量生成脚本
```

## 数据抓取方案

### 自动化抓取脚本

1. 创建一个 Node.js 脚本，使用 Puppeteer 或 Playwright 从 CrazyGames 网站抓取游戏数据：

```javascript
// scripts/fetchGames.js
const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

async function scrapeGames() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  // 访问 CrazyGames 网站
  await page.goto('https://www.crazygames.com/', { waitUntil: 'networkidle2' });
  
  // 获取游戏数据
  const games = await page.evaluate(() => {
    const gameElements = document.querySelectorAll('.game-item'); // 根据实际 DOM 结构调整
    return Array.from(gameElements).map(game => ({
      title: game.querySelector('.game-title').textContent.trim(),
      description: game.querySelector('.game-description')?.textContent.trim() || '',
      thumbnailUrl: game.querySelector('img').src,
      gameUrl: game.querySelector('a').href,
      // 其他需要的数据
    }));
  });
  
  // 对于每个游戏，抓取详细信息
  const detailedGames = [];
  for (const game of games) {
    await page.goto(game.gameUrl, { waitUntil: 'networkidle2' });
    
    const details = await page.evaluate(() => ({
      instructions: document.querySelector('.game-instructions')?.textContent.trim() || '使用键盘和鼠标控制游戏',
      iframeUrl: document.querySelector('iframe')?.src || '',
      highlights: Array.from(document.querySelectorAll('.game-highlights li')).map(h => h.textContent.trim()),
      // 其他详细信息
    }));
    
    detailedGames.push({
      ...game,
      ...details,
      slug: game.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    });
  }
  
  await browser.close();
  
  // 保存数据到 JSON 文件
  await fs.writeFile(
    path.join(__dirname, '../src/data/games.json'),
    JSON.stringify(detailedGames, null, 2)
  );
  
  console.log(`成功抓取 ${detailedGames.length} 个游戏数据`);
}

scrapeGames().catch(console.error);
```

### 数据处理和存储

1. 创建一个 TypeScript 接口定义游戏数据结构：

```typescript
// src/types/game.ts
export interface Game {
  id: string;
  title: string;
  description: string;
  instructions: string;
  thumbnailUrl: string;
  embedUrl: string;
  slug: string;
  highlights: string[];
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}
```

2. 游戏数据处理工具：

```typescript
// src/utils/gameDataProcessor.ts
import { Game } from '../types/game';
import games from '../data/games.json';

// 获取所有游戏数据
export function getAllGames(): Game[] {
  return games;
}

// 根据 slug 获取单个游戏数据
export function getGameBySlug(slug: string): Game | undefined {
  return games.find(game => game.slug === slug);
}

// 根据类别筛选游戏
export function getGamesByCategory(category: string): Game[] {
  return games.filter(game => game.category === category);
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
```

## 页面模板系统

### 游戏列表页面

```tsx
// src/pages/games/index.tsx
import React, { useState } from 'react';
import { getAllGames } from '../../utils/gameDataProcessor';
import GameCard from '../../components/games/GameCard';

export default function GamesListPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  
  const allGames = getAllGames();
  
  // 筛选游戏
  const filteredGames = allGames.filter(game => {
    // 类别筛选
    if (activeCategory !== 'all' && game.category !== activeCategory) {
      return false;
    }
    
    // 搜索筛选
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        game.title.toLowerCase().includes(query) ||
        game.description.toLowerCase().includes(query)
      );
    }
    
    return true;
  });
  
  // 获取所有类别
  const categories = ['all', ...Array.from(new Set(allGames.map(game => game.category)))];
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Mindseye 小游戏集合
      </h1>
      
      {/* 搜索和筛选 */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-4 mb-4">
          <input
            type="text"
            placeholder="搜索游戏..."
            className="px-4 py-2 rounded-lg border border-gray-300 flex-grow"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-3 py-1 rounded-md ${
                activeCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {category === 'all' ? '全部' : category}
            </button>
          ))}
        </div>
      </div>
      
      {/* 游戏卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredGames.map(game => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  );
}
```

### 游戏卡片组件

```tsx
// src/components/games/GameCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Game } from '../../types/game';

interface GameCardProps {
  game: Game;
}

export default function GameCard({ game }: GameCardProps) {
  return (
    <Link to={`/games/${game.slug}`} className="block">
      <div className="bg-gray-900 rounded-xl overflow-hidden transition-transform hover:scale-105 shadow-lg border border-gray-800">
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={game.thumbnailUrl}
            alt={game.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="text-xl font-bold text-white mb-2">{game.title}</h3>
          <p className="text-gray-400 text-sm line-clamp-2">{game.description}</p>
        </div>
      </div>
    </Link>
  );
}
```

### 游戏详情页模板

```tsx
// src/pages/games/[slug].tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getGameBySlug } from '../../utils/gameDataProcessor';
import GameControls from '../../components/games/GameControls';
import GameInstructions from '../../components/games/GameInstructions';

export default function GameDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  
  const game = getGameBySlug(slug || '');
  
  // SEO 元数据
  useEffect(() => {
    if (game) {
      document.title = `${game.title} - Mindseye 游戏`;
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', game.description.substring(0, 160));
      }
    }
  }, [game]);
  
  if (!game) {
    return <div>游戏不存在</div>;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{game.title}</h1>
      
      {/* 游戏描述 */}
      <div className="mb-6">
        <p className="text-gray-300">{game.description}</p>
      </div>
      
      {/* 游戏亮点 */}
      {game.highlights && game.highlights.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">游戏亮点</h2>
          <ul className="list-disc pl-5 space-y-1">
            {game.highlights.map((highlight, index) => (
              <li key={index}>{highlight}</li>
            ))}
          </ul>
        </div>
      )}
      
      {/* 游戏说明 */}
      {showInstructions && (
        <GameInstructions instructions={game.instructions} />
      )}
      
      {/* 游戏 IFrame */}
      <div className="bg-black rounded-xl overflow-hidden border border-blue-500/20 mb-6">
        {isPlaying ? (
          <div className="aspect-video w-full h-full">
            <iframe 
              id="game-iframe"
              src={game.embedUrl} 
              title={game.title}
              className="w-full h-full"
              allow="fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              frameBorder="0"
              scrolling="no"
            ></iframe>
          </div>
        ) : (
          <div 
            className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center"
            style={{
              backgroundImage: `url(${game.thumbnailUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="text-center p-6 bg-black/70 backdrop-blur-sm rounded-xl">
              <button
                className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4 mx-auto cursor-pointer hover:scale-110 transition-transform"
                onClick={() => setIsPlaying(true)}
              >
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              <h4 className="text-xl font-bold text-white mb-2">准备好了吗？</h4>
              <p className="text-gray-400">点击开始按钮开始游戏</p>
            </div>
          </div>
        )}
      </div>
      
      {/* 游戏控制 */}
      <GameControls 
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        isFullscreen={isFullscreen}
        setIsFullscreen={setIsFullscreen}
        showInstructions={showInstructions}
        setShowInstructions={setShowInstructions}
      />
    </div>
  );
}
```

## 批量管理系统

### 游戏数据管理

创建一个游戏管理界面，用于添加、编辑和删除游戏数据：

1. 创建管理界面组件：

```tsx
// src/pages/admin/games/index.tsx
import React, { useState } from 'react';
import { getAllGames } from '../../../utils/gameDataProcessor';

export default function AdminGamesPage() {
  const games = getAllGames();
  const [selectedGame, setSelectedGame] = useState(null);
  
  // 更多管理功能...
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">游戏管理</h1>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* 游戏列表 */}
        <div className="w-full md:w-1/3">
          <div className="bg-gray-100 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">游戏列表</h2>
            <ul className="space-y-2">
              {games.map(game => (
                <li key={game.id}>
                  <button
                    onClick={() => setSelectedGame(game)}
                    className={`w-full text-left px-3 py-2 rounded-md ${
                      selectedGame?.id === game.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-white hover:bg-gray-200'
                    }`}
                  >
                    {game.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* 游戏编辑表单 */}
        {selectedGame && (
          <div className="w-full md:w-2/3">
            {/* 游戏编辑表单 */}
          </div>
        )}
      </div>
    </div>
  );
}
```

### 自动化脚本

创建批量生成游戏页面的脚本：

```javascript
// scripts/generateGamePages.js
const fs = require('fs').promises;
const path = require('path');

async function generateGamePages() {
  try {
    // 读取游戏数据
    const gamesData = JSON.parse(
      await fs.readFile(path.join(__dirname, '../src/data/games.json'), 'utf8')
    );
    
    console.log(`准备为 ${gamesData.length} 个游戏生成页面...`);
    
    // 更新路由配置
    const routes = gamesData.map(game => ({
      path: `/games/${game.slug}`,
      component: 'GameDetail',
      props: { gameId: game.id }
    }));
    
    // 将路由写入配置文件
    await fs.writeFile(
      path.join(__dirname, '../src/routes/gameRoutes.json'),
      JSON.stringify(routes, null, 2)
    );
    
    console.log('游戏路由生成完成！');
  } catch (error) {
    console.error('生成游戏页面时出错:', error);
  }
}

generateGamePages();
```

## 自动化部署流程

### 更新流程

1. 定期执行抓取脚本，更新游戏数据
2. 生成新的游戏页面
3. 构建并部署应用

### 示例 CI/CD 配置

```yaml
# .github/workflows/update-games.yml
name: Update Games Data

on:
  schedule:
    - cron: '0 0 * * 0'  # 每周日凌晨执行
  workflow_dispatch:     # 允许手动触发

jobs:
  update-games:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Fetch new games
        run: node scripts/fetchGames.js
      
      - name: Generate game pages
        run: node scripts/generateGamePages.js
      
      - name: Commit changes
        uses: stefanzweifel/git-auto-commit-action@v4
        with:
          commit_message: "更新游戏数据 [自动]"
          file_pattern: "src/data/games.json src/routes/gameRoutes.json"
```

## 实施计划

1. **第一阶段（基础架构）**
   - 设置游戏数据模型和接口
   - 创建基本组件（GameCard、GameDetail）
   - 实现动态路由系统

2. **第二阶段（数据抓取）**
   - 开发网页爬虫脚本
   - 实现数据处理和清洗功能
   - 创建数据存储和检索系统

3. **第三阶段（用户界面）**
   - 开发游戏列表页面
   - 实现游戏详情页模板
   - 添加搜索和筛选功能

4. **第四阶段（管理系统）**
   - 开发游戏管理界面
   - 实现批量操作功能
   - 创建自动化部署流程

## 注意事项与挑战

1. **法律合规性**：确保从 CrazyGames 抓取内容时遵循其服务条款和法律要求，建议检查其 API 是否提供合法使用的数据接口。

2. **跨域问题**：嵌入第三方 iframe 时可能遇到跨域限制，需要确保正确设置 iframe 的 sandbox 属性和引用参数。

3. **性能优化**：考虑使用懒加载、图片优化等技术，确保即使有大量游戏也能保持良好的性能。

4. **SEO 考虑**：使用动态生成的页面可能影响 SEO，确保为每个游戏页面生成适当的静态文件或使用服务器端渲染。

5. **维护性**：设计系统时考虑长期维护的便捷性，特别是当游戏数量增加时的管理难度。

## 总结

本设计方案提供了一个全面的解决方案，用于从 CrazyGames 自动抓取游戏数据，并实现多游戏页面的批量管理。通过使用模块化的组件设计和自动化脚本，系统可以高效地管理和展示大量游戏，同时保持用户体验的一致性和良好的性能。 