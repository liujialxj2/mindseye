# Mindseye 游戏网站多语言实施方案
# Mindseye Game Website Multilanguage Implementation Plan

## 概述 | Overview

本文档概述了将 Mindseye 游戏网站转换为支持多语言的实施方案。该方案旨在提供无缝的多语言体验，使全球用户能够以他们的首选语言访问网站内容。

This document outlines the implementation plan for converting the Mindseye game website into a multilingual platform. The plan aims to provide a seamless multilingual experience, allowing global users to access website content in their preferred language.

## 目标 | Goals

1. 支持多种语言，包括：
   - 第一阶段（核心语言）：英文（默认）、中文（简体）、中文（繁体）、日文、韩文、西班牙语、葡萄牙语、俄语、德语、法语
   - 第二阶段（扩展语言）：意大利语、阿拉伯语、土耳其语、波兰语、荷兰语、印尼语、泰语、越南语
2. 提供简单的语言切换机制
3. 保持一致的用户体验，无论选择哪种语言
4. 确保所有动态内容和静态内容都可翻译
5. 优化性能，避免因多语言支持而导致的加载时间延长

1. Support multiple languages, including:
   - Phase 1 (Core languages): English (default), Chinese (Simplified), Chinese (Traditional), Japanese, Korean, Spanish, Portuguese, Russian, German, French
   - Phase 2 (Extended languages): Italian, Arabic, Turkish, Polish, Dutch, Indonesian, Thai, Vietnamese
2. Provide a simple language switching mechanism
3. Maintain consistent user experience regardless of language choice
4. Ensure all dynamic and static content is translatable
5. Optimize performance to avoid increased loading times due to multilingual support

## 游戏网站语言优先级 | Game Website Language Priority

根据全球游戏市场分析和主要游戏平台（如 Steam、Epic Games、PlayStation Store 等）的语言支持情况，我们确定了以下语言优先级：

Based on global gaming market analysis and language support from major gaming platforms (such as Steam, Epic Games, PlayStation Store, etc.), we have determined the following language priorities:

### 第一阶段（核心语言）| Phase 1 (Core Languages)

1. **英语 (English)** - 全球通用语言，游戏行业标准
2. **简体中文 (Simplified Chinese)** - 全球最大游戏市场之一，移动游戏特别流行
3. **繁体中文 (Traditional Chinese)** - 台湾、香港等地区使用
4. **日语 (Japanese)** - 成熟的游戏市场，高消费能力
5. **韩语 (Korean)** - 电子竞技强国，高度发达的游戏文化
6. **西班牙语 (Spanish)** - 覆盖西班牙和拉丁美洲大量用户
7. **葡萄牙语 (Portuguese)** - 巴西是拉美最大游戏市场
8. **俄语 (Russian)** - 东欧重要游戏市场
9. **德语 (German)** - 欧洲最大游戏市场之一
10. **法语 (French)** - 覆盖法国、加拿大魁北克和非洲法语区

1. **English** - Global lingua franca, gaming industry standard
2. **Simplified Chinese** - One of the largest gaming markets globally, especially popular for mobile games
3. **Traditional Chinese** - Used in Taiwan, Hong Kong, etc.
4. **Japanese** - Mature gaming market with high spending power
5. **Korean** - Strong esports nation with highly developed gaming culture
6. **Spanish** - Covers Spain and large Latin American user base
7. **Portuguese** - Brazil is the largest gaming market in Latin America
8. **Russian** - Important gaming market in Eastern Europe
9. **German** - One of the largest gaming markets in Europe
10. **French** - Covers France, Quebec in Canada, and French-speaking Africa

### 第二阶段（扩展语言）| Phase 2 (Extended Languages)

11. **意大利语 (Italian)** - 欧洲重要游戏市场
12. **阿拉伯语 (Arabic)** - 中东和北非地区快速增长的游戏市场
13. **土耳其语 (Turkish)** - 快速发展的游戏市场
14. **波兰语 (Polish)** - 东欧重要游戏市场
15. **荷兰语 (Dutch)** - 西欧高消费能力市场
16. **印尼语 (Indonesian)** - 东南亚最大市场
17. **泰语 (Thai)** - 东南亚重要游戏市场
18. **越南语 (Vietnamese)** - 快速增长的移动游戏市场

11. **Italian** - Important gaming market in Europe
12. **Arabic** - Rapidly growing gaming market in the Middle East and North Africa
13. **Turkish** - Fast-developing gaming market
14. **Polish** - Important gaming market in Eastern Europe
15. **Dutch** - High-spending market in Western Europe
16. **Indonesian** - Largest market in Southeast Asia
17. **Thai** - Important gaming market in Southeast Asia
18. **Vietnamese** - Rapidly growing mobile gaming market

### 语言选择依据 | Language Selection Criteria

我们的语言优先级基于以下因素：

1. **市场规模** - 该语言区域的游戏玩家数量和市场价值
2. **消费能力** - 该地区玩家的平均消费水平
3. **增长潜力** - 市场的预期增长率
4. **本地化难度** - 翻译和适应该语言的复杂性
5. **竞争状况** - 该语言市场中竞争对手的本地化程度

Our language priorities are based on the following factors:

1. **Market Size** - Number of gamers and market value in the language region
2. **Spending Power** - Average spending level of players in the region
3. **Growth Potential** - Expected growth rate of the market
4. **Localization Difficulty** - Complexity of translating and adapting to the language
5. **Competitive Landscape** - Level of localization among competitors in the language market

## 技术方案 | Technical Approach

### 1. 国际化框架选择 | Internationalization Framework Selection

我们将使用 **react-i18next** 作为主要的国际化框架，因为它：
- 与 React 生态系统完全兼容
- 提供高性能的翻译功能
- 支持命名空间，便于组织大型翻译文件
- 具有丰富的插件生态系统
- 支持按需加载语言包
- 能够处理复杂的多语言需求，包括RTL（从右到左）语言如阿拉伯语

We will use **react-i18next** as the primary internationalization framework because it:
- Is fully compatible with the React ecosystem
- Provides high-performance translation capabilities
- Supports namespaces for organizing large translation files
- Has a rich plugin ecosystem
- Supports on-demand loading of language packs
- Can handle complex multilingual requirements, including RTL (right-to-left) languages like Arabic

### 2. 项目结构 | Project Structure

```
src/
├── i18n/
│   ├── index.ts                 # i18n 配置
│   ├── locales/                 # 翻译文件目录
│   │   ├── en/                  # 英文翻译
│   │   │   ├── common.json      # 通用翻译
│   │   │   ├── home.json        # 首页翻译
│   │   │   ├── games.json       # 游戏相关翻译
│   │   │   └── ...
│   │   ├── zh-CN/               # 简体中文翻译
│   │   ├── zh-TW/               # 繁体中文翻译
│   │   ├── ja/                  # 日文翻译
│   │   ├── ko/                  # 韩文翻译
│   │   ├── es/                  # 西班牙语翻译
│   │   ├── pt/                  # 葡萄牙语翻译
│   │   ├── ru/                  # 俄语翻译
│   │   ├── de/                  # 德语翻译
│   │   ├── fr/                  # 法语翻译
│   │   └── ...                  # 其他语言
│   ├── languageDetector.ts      # 语言检测逻辑
│   └── languageConfig.ts        # 语言配置（支持的语言、显示名称等）
├── components/
│   ├── LanguageSwitcher.tsx     # 语言切换组件
│   └── ...
└── ...
```

### 3. 实施步骤 | Implementation Steps

#### 步骤 1: 设置 i18n | Step 1: Set up i18n

1. 安装必要的依赖：
   ```bash
   npm install i18next react-i18next i18next-browser-languagedetector i18next-http-backend
   ```

2. 创建语言配置文件 (`src/i18n/languageConfig.ts`):
   ```typescript
   // 第一阶段支持的语言
   export const PHASE_ONE_LANGUAGES = [
     { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', rtl: false },
     { code: 'zh-CN', name: 'Chinese (Simplified)', nativeName: '简体中文', flag: '🇨🇳', rtl: false },
     { code: 'zh-TW', name: 'Chinese (Traditional)', nativeName: '繁體中文', flag: '🇹🇼', rtl: false },
     { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', rtl: false },
     { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', rtl: false },
     { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', rtl: false },
     { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷', rtl: false },
     { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', rtl: false },
     { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', rtl: false },
     { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', rtl: false },
   ];

   // 第二阶段支持的语言
   export const PHASE_TWO_LANGUAGES = [
     { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', rtl: false },
     { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', rtl: true },
     { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷', rtl: false },
     { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱', rtl: false },
     { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱', rtl: false },
     { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩', rtl: false },
     { code: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭', rtl: false },
     { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳', rtl: false },
   ];

   // 所有支持的语言
   export const ALL_LANGUAGES = [...PHASE_ONE_LANGUAGES, ...PHASE_TWO_LANGUAGES];

   // 获取当前支持的语言（根据开发阶段）
   export const getCurrentlySupportedLanguages = (includePhaseTwo = false) => {
     return includePhaseTwo ? ALL_LANGUAGES : PHASE_ONE_LANGUAGES;
   };

   // 获取语言代码列表
   export const getSupportedLanguageCodes = (includePhaseTwo = false) => {
     const languages = getCurrentlySupportedLanguages(includePhaseTwo);
     return languages.map(lang => lang.code);
   };

   // 根据代码获取语言信息
   export const getLanguageByCode = (code: string) => {
     return ALL_LANGUAGES.find(lang => lang.code === code) || ALL_LANGUAGES[0];
   };
   ```

3. 创建 i18n 配置文件 (`src/i18n/index.ts`)：
   ```typescript
   import i18n from 'i18next';
   import { initReactI18next } from 'react-i18next';
   import LanguageDetector from 'i18next-browser-languagedetector';
   import Backend from 'i18next-http-backend';
   import { getSupportedLanguageCodes } from './languageConfig';

   // 获取当前支持的语言代码
   const supportedLngs = getSupportedLanguageCodes(process.env.NODE_ENV === 'development');

   i18n
     .use(Backend)
     .use(LanguageDetector)
     .use(initReactI18next)
     .init({
       fallbackLng: 'en',
       supportedLngs,
       interpolation: {
         escapeValue: false,
       },
       detection: {
         order: ['path', 'localStorage', 'navigator', 'htmlTag'],
         lookupFromPathIndex: 0,
         caches: ['localStorage'],
       },
       backend: {
         loadPath: '/locales/{{lng}}/{{ns}}.json',
       },
       react: {
         useSuspense: true,
       },
       // 处理RTL语言
       load: 'languageOnly', // 仅加载语言代码，不包括区域
       // 特殊处理阿拉伯语等RTL语言
       preload: ['ar'],
     });

   // 监听语言变化，处理RTL方向
   i18n.on('languageChanged', (lng) => {
     const language = lng.split('-')[0]; // 获取主语言代码
     const dir = language === 'ar' ? 'rtl' : 'ltr';
     document.documentElement.dir = dir;
     document.documentElement.lang = lng;
   });

   export default i18n;
   ```

4. 在应用入口点导入 i18n 配置：
   ```typescript
   // src/main.tsx
   import './i18n';
   import React from 'react';
   import ReactDOM from 'react-dom/client';
   import App from './App';
   import './index.css';

   ReactDOM.createRoot(document.getElementById('root')!).render(
     <React.StrictMode>
       <React.Suspense fallback={<div className="loading-screen">Loading...</div>}>
         <App />
       </React.Suspense>
     </React.StrictMode>
   );
   ```

#### 步骤 2: 创建翻译文件 | Step 2: Create Translation Files

为每种语言创建翻译文件。例如，英文通用翻译文件 (`public/locales/en/common.json`)：

```json
{
  "header": {
    "home": "Home",
    "games": "Games",
    "faq": "FAQ"
  },
  "footer": {
    "copyright": "© {{year}} Mindseye Game. All rights reserved.",
    "terms": "Terms of Service",
    "privacy": "Privacy Policy",
    "contact": "Contact"
  },
  "languageSwitcher": {
    "language": "Language",
    "en": "English",
    "zh": "中文",
    "ja": "日本語"
  }
}
```

中文通用翻译文件 (`public/locales/zh/common.json`)：

```json
{
  "header": {
    "home": "首页",
    "games": "游戏",
    "faq": "常见问题"
  },
  "footer": {
    "copyright": "© {{year}} Mindseye 游戏。保留所有权利。",
    "terms": "服务条款",
    "privacy": "隐私政策",
    "contact": "联系我们"
  },
  "languageSwitcher": {
    "language": "语言",
    "en": "English",
    "zh": "中文",
    "ja": "日本語"
  }
}
```

#### 步骤 3: 创建语言切换组件 | Step 3: Create Language Switcher Component

```tsx
// src/components/LanguageSwitcher.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { getCurrentlySupportedLanguages, getLanguageByCode } from '../i18n/languageConfig';

const LanguageSwitcher: React.FC = () => {
  const { t, i18n } = useTranslation('common');
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // 获取当前环境下支持的语言
  const isDev = process.env.NODE_ENV === 'development';
  const languages = getCurrentlySupportedLanguages(isDev);
  
  // 当前语言信息
  const currentLang = getLanguageByCode(i18n.language);
  
  // 根据搜索过滤语言
  const filteredLanguages = languages.filter(lang => 
    lang.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // 处理语言切换
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
    setSearchQuery('');
    
    // 更新 URL 路径中的语言代码
    const currentPath = window.location.pathname;
    const pathParts = currentPath.split('/').filter(Boolean);
    
    // 检查第一部分是否是语言代码
    const isLangInPath = languages.some(lang => lang.code === pathParts[0]);
    
    if (isLangInPath) {
      // 替换路径中的语言代码
      pathParts[0] = lng;
      window.history.pushState({}, '', `/${pathParts.join('/')}`);
    } else {
      // 在路径前添加语言代码
      window.history.pushState({}, '', `/${lng}${currentPath}`);
    }
  };
  
  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        className="flex items-center space-x-2 text-gray-300 hover:text-blue-400 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={t('languageSwitcher.selectLanguage')}
      >
        <Globe className="w-5 h-5" />
        <span className="hidden sm:inline">{currentLang.nativeName}</span>
        <span className="inline sm:hidden">{currentLang.flag}</span>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 max-h-96 overflow-y-auto bg-gray-900 border border-blue-500/20 rounded-lg shadow-lg z-50">
          {/* 搜索框 */}
          <div className="p-2 border-b border-gray-800">
            <input
              type="text"
              placeholder={t('languageSwitcher.search')}
              className="w-full bg-gray-800 text-gray-200 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          </div>
          
          {/* 语言列表 */}
          <div className="py-1">
            {filteredLanguages.length > 0 ? (
              filteredLanguages.map((lang) => (
                <button
                  key={lang.code}
                  className={`flex items-center w-full text-left px-4 py-2 hover:bg-gray-800 ${
                    i18n.language === lang.code ? 'text-blue-400 bg-gray-800/50' : 'text-gray-300'
                  }`}
                  onClick={() => changeLanguage(lang.code)}
                >
                  <span className="mr-2">{lang.flag}</span>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{lang.nativeName}</span>
                    <span className="text-xs text-gray-400">{lang.name}</span>
                  </div>
                  {i18n.language === lang.code && (
                    <span className="ml-auto text-blue-400">✓</span>
                  )}
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-gray-400 text-center">
                {t('languageSwitcher.noResults')}
              </div>
            )}
          </div>
          
          {/* 第二阶段语言提示 */}
          {!isDev && (
            <div className="px-4 py-2 text-xs text-gray-500 border-t border-gray-800">
              {t('languageSwitcher.moreLangComing')}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
```

#### 步骤 4: 集成语言切换组件 | Step 4: Integrate Language Switcher

将语言切换组件添加到 Header 组件中：

```tsx
// src/components/Header.tsx
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation('common');

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-blue-500/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src="/images/logo.webp" 
              alt="Mindseye Logo" 
              className="w-10 h-10 object-contain" 
            />
            <span className="text-2xl font-bold text-white">MINDSEYE</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-gray-300 hover:text-blue-400 transition-colors">{t('header.home')}</a>
            <a href="#games" className="text-gray-300 hover:text-blue-400 transition-colors">{t('header.games')}</a>
            <a href="#faq" className="text-gray-300 hover:text-blue-400 transition-colors">{t('header.faq')}</a>
            <LanguageSwitcher />
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white"
            aria-label={isMenuOpen ? t('header.closeMenu') : t('header.openMenu')}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-blue-500/20">
            <nav className="flex flex-col space-y-4 mt-4">
              <a href="#home" className="text-gray-300 hover:text-blue-400 transition-colors">{t('header.home')}</a>
              <a href="#games" className="text-gray-300 hover:text-blue-400 transition-colors">{t('header.games')}</a>
              <a href="#faq" className="text-gray-300 hover:text-blue-400 transition-colors">{t('header.faq')}</a>
              <LanguageSwitcher />
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
```

#### 步骤 5: 应用翻译到组件 | Step 5: Apply Translations to Components

使用 `useTranslation` hook 在所有组件中应用翻译：

```tsx
// 示例：Footer.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const Footer = () => {
  const { t } = useTranslation('common');
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 border-t border-blue-900/30">
      {/* ... */}
      <div className="border-t border-gray-800 mt-8 pt-8 text-center">
        <p className="text-gray-500">
          {t('footer.copyright', { year: currentYear })}
        </p>
        <div className="flex justify-center space-x-4 mt-4">
          <Link to="/privacy" className="text-gray-500 hover:text-blue-400 transition-colors text-sm">
            {t('footer.privacy')}
          </Link>
          <Link to="/terms" className="text-gray-500 hover:text-blue-400 transition-colors text-sm">
            {t('footer.terms')}
          </Link>
          <Link to="/contact" className="text-gray-500 hover:text-blue-400 transition-colors text-sm">
            {t('footer.contact')}
          </Link>
        </div>
      </div>
      {/* ... */}
    </footer>
  );
};
```

#### 步骤 6: 处理动态内容 | Step 6: Handle Dynamic Content

对于游戏数据等动态内容，我们需要在数据结构中添加多语言支持：

```typescript
// src/types/game.ts
export interface Game {
  id: string;
  thumbnailUrl: string;
  gameUrl: string;
  gdGameId: string;
  categories: string[];
  difficulty: string;
  featured: boolean;
  popularity: number;
  title: {
    en: string;
    zh: string;
    ja: string;
  };
  description: {
    en: string;
    zh: string;
    ja: string;
  };
  controls: {
    desktop: {
      en: string;
      zh: string;
      ja: string;
    };
    mobile: {
      en: string;
      zh: string;
      ja: string;
    };
  };
}
```

在组件中使用当前语言显示相应内容：

```tsx
// src/components/GameCard.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Game } from '../types/game';

interface GameCardProps {
  game: Game;
}

const GameCard: React.FC<GameCardProps> = ({ game }) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language.split('-')[0]; // 处理 'en-US' 等格式
  
  // 如果没有当前语言的翻译，回退到英文
  const title = game.title[currentLang as keyof typeof game.title] || game.title.en;
  const description = game.description[currentLang as keyof typeof game.description] || game.description.en;
  
  return (
    <div className="game-card">
      <img src={game.thumbnailUrl} alt={title} />
      <h3>{title}</h3>
      <p>{description}</p>
      {/* ... */}
    </div>
  );
};
```

#### 步骤 7: 处理路由和 URL | Step 7: Handle Routes and URLs

可以考虑在 URL 中包含语言代码，例如 `/zh/games` 或 `/en/privacy`。这需要修改路由配置：

```tsx
// src/App.tsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import GamePage from './pages/GamePage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  const { i18n } = useTranslation();
  
  // 语言路由处理
  const LanguageRoute = ({ element }: { element: React.ReactNode }) => {
    const currentLang = i18n.language.split('-')[0];
    const supportedLangs = ['en', 'zh', 'ja'];
    
    if (!supportedLangs.includes(currentLang)) {
      return <Navigate to={`/en${window.location.pathname}`} />;
    }
    
    return <>{element}</>;
  };
  
  return (
    <Router>
      <Routes>
        {/* 默认重定向到当前语言 */}
        <Route path="/" element={<Navigate to={`/${i18n.language.split('-')[0]}`} />} />
        
        {/* 语言特定路由 */}
        <Route path="/:lang" element={<LanguageRoute element={<HomePage />} />} />
        <Route path="/:lang/games/:gameId" element={<LanguageRoute element={<GamePage />} />} />
        <Route path="/:lang/privacy" element={<LanguageRoute element={<PrivacyPage />} />} />
        <Route path="/:lang/terms" element={<LanguageRoute element={<TermsPage />} />} />
        <Route path="/:lang/contact" element={<LanguageRoute element={<ContactPage />} />} />
        
        {/* 404 页面 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
```

#### 步骤 8: SEO 优化 | Step 8: SEO Optimization

为每种语言版本添加适当的 meta 标签：

```tsx
// src/components/LanguageMeta.tsx
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

interface LanguageMetaProps {
  title?: string;
  description?: string;
}

const LanguageMeta: React.FC<LanguageMetaProps> = ({ title, description }) => {
  const { i18n } = useTranslation();
  const location = useLocation();
  const currentLang = i18n.language.split('-')[0];
  
  // 构建当前 URL 和替代语言 URL
  const baseUrl = 'https://mindseye-88s.pages.dev';
  const currentUrl = `${baseUrl}${location.pathname}`;
  
  // 获取不包含语言代码的路径
  const pathWithoutLang = location.pathname.replace(new RegExp(`^/${currentLang}`), '');
  
  // 支持的语言列表
  const supportedLangs = ['en', 'zh', 'ja'];
  
  return (
    <Helmet>
      <html lang={currentLang} />
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      
      {/* 规范链接 */}
      <link rel="canonical" href={currentUrl} />
      
      {/* 替代语言链接 */}
      {supportedLangs.map(lang => (
        lang !== currentLang && (
          <link 
            key={lang} 
            rel="alternate" 
            hrefLang={lang} 
            href={`${baseUrl}/${lang}${pathWithoutLang}`} 
          />
        )
      ))}
      
      {/* 默认语言链接 */}
      <link rel="alternate" hrefLang="x-default" href={`${baseUrl}/en${pathWithoutLang}`} />
    </Helmet>
  );
};

export default LanguageMeta;
```

在页面组件中使用：

```tsx
// src/pages/HomePage.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import LanguageMeta from '../components/LanguageMeta';

const HomePage: React.FC = () => {
  const { t } = useTranslation('home');
  
  return (
    <>
      <LanguageMeta 
        title={t('meta.title')} 
        description={t('meta.description')} 
      />
      {/* 页面内容 */}
    </>
  );
};
```

### 4. 性能优化 | Performance Optimization

1. **按需加载翻译文件**：只加载当前选择的语言文件，减少初始加载时间。

2. **缓存翻译**：使用 localStorage 缓存翻译数据，减少重复请求。

3. **代码分割**：按语言对代码进行分割，确保用户只下载他们需要的语言资源。

4. **预加载常用语言**：在空闲时预加载最常用的语言包。

5. **图片本地化**：为特定语言提供优化的图片资源。

### 5. 测试策略 | Testing Strategy

1. **单元测试**：测试翻译键是否正确应用。

2. **集成测试**：测试语言切换功能和 URL 路由。

3. **端到端测试**：在不同语言设置下测试完整用户流程。

4. **翻译覆盖率检查**：确保所有文本都有相应的翻译键。

5. **视觉回归测试**：确保不同语言下的布局正确。

## 实施时间线 | Implementation Timeline

1. **第 1 周**：设置 i18n 框架和基本配置
2. **第 2 周**：提取所有文本到翻译文件并完成英文版本
3. **第 3 周**：完成中文翻译并实现语言切换功能
4. **第 4 周**：完成日文翻译并添加 URL 路由支持
5. **第 5 周**：进行 SEO 优化和性能调优
6. **第 6 周**：测试和修复问题
7. **第 7 周**：发布多语言版本并监控性能

## 未来扩展 | Future Extensions

1. **添加更多语言**：根据用户分布，考虑添加西班牙语、法语、德语等。

2. **自动翻译集成**：集成 Google Translate API 或 DeepL API，为尚未手动翻译的内容提供自动翻译。

3. **翻译管理系统**：实现在线翻译管理系统，允许非技术人员更新翻译。

4. **A/B 测试**：针对不同语言用户进行 A/B 测试，优化用户体验。

5. **地区特定内容**：根据语言/地区提供定制化内容和游戏推荐。

## 讨论记录 | Discussion Log

### 2023-07-01: 初始需求讨论

**需求**：
- 网站需要支持多语言，初始阶段为英文和中文
- 用户应能轻松切换语言
- 所有内容（包括游戏描述）都需要多语言支持
- URL 应反映当前语言选择

**决定**：
- 使用 react-i18next 作为国际化解决方案
- 在 URL 中包含语言代码
- 翻译文件按功能区域分隔

### 2023-07-15: 技术方案评审

**讨论要点**：
- 评估了不同的国际化库（react-i18next vs. react-intl）
- 考虑了翻译文件的组织方式
- 讨论了动态内容（如游戏数据）的翻译策略

**决定**：
- 确认使用 react-i18next
- 将翻译文件按页面/功能区域组织
- 游戏数据结构将支持多语言字段

### 2023-07-30: 实施进度评审

**完成项**：
- i18n 基础设置
- 英文翻译文件提取
- 语言切换组件原型

**待解决问题**：
- 路由策略需要进一步讨论
- 需要确定翻译工作流程
- 性能优化策略需要细化

**决定**：
- 采用 /:lang/* 路由模式
- 设置翻译审核流程
- 实施按需加载翻译文件以优化性能

### 2023-08-10: 语言支持范围扩展讨论

**讨论要点**：
- 评估了全球游戏市场的语言分布情况
- 分析了主要游戏平台（Steam、Epic、PlayStation Store等）的语言支持
- 考虑了翻译成本和投资回报率
- 讨论了分阶段实施多语言支持的策略

**决定**：
- 将语言支持扩展为两个阶段：
  - 第一阶段（核心语言）：英文、简体中文、繁体中文、日文、韩文、西班牙语、葡萄牙语、俄语、德语、法语
  - 第二阶段（扩展语言）：意大利语、阿拉伯语、土耳其语、波兰语、荷兰语、印尼语、泰语、越南语
- 优先完成第一阶段语言，然后根据用户数据和市场反馈决定第二阶段的实施顺序
- 为阿拉伯语等RTL（从右到左）语言添加特殊支持

### 2023-08-25: 语言切换UI设计评审

**讨论要点**：
- 评估了不同的语言切换界面设计方案
- 讨论了语言名称的显示方式（本地名称vs英文名称）
- 考虑了移动设备上的语言切换体验
- 讨论了添加国旗图标的利弊

**决定**：
- 采用下拉菜单式语言切换器，包含搜索功能
- 同时显示语言的本地名称和英文名称
- 在移动设备上使用国旗图标节省空间
- 添加视觉指示器显示当前选择的语言
- 在开发环境中显示所有计划支持的语言，在生产环境中仅显示已完成翻译的语言

### 2023-09-15: 翻译工作流程确定

**讨论要点**：
- 评估了不同的翻译管理系统和工具
- 讨论了翻译质量控制流程
- 考虑了自动翻译工具的应用场景
- 讨论了翻译更新和版本控制策略

**决定**：
- 采用 Lokalise 作为翻译管理系统
- 建立三步翻译流程：机器翻译初稿 → 专业翻译修订 → 本地玩家审核
- 为常见游戏术语建立多语言术语库
- 实施持续翻译流程，与代码开发并行
- 使用 GitHub Actions 自动同步翻译文件

## 结论 | Conclusion

通过实施这个多语言方案，Mindseye 游戏网站将能够为全球用户提供本地化体验，扩大受众范围，并提高用户满意度。该方案注重性能优化和可扩展性，确保随着网站的发展，多语言支持能够无缝扩展。

By implementing this multilingual plan, the Mindseye game website will be able to provide a localized experience for global users, expand its audience reach, and increase user satisfaction. The plan emphasizes performance optimization and scalability, ensuring that multilingual support can seamlessly expand as the website grows. 