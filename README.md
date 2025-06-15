# Mindseye 游戏平台

一个现代化的HTML5游戏平台，提供各种类型的免费在线游戏。

## 项目特点

- 响应式设计，适配所有设备
- 无需下载，即点即玩
- 多种游戏类别
- 多语言支持
- 用户友好界面

## 项目说明

Mindseye是一个基于浏览器的游戏平台，提供各种免费的HTML5游戏。玩家可以在不同设备上享受游戏，无需下载或安装任何内容。

### 主要功能

- **多样化游戏集合**：从动作和冒险到益智和策略的多种游戏类型
- **即时游戏**：所有游戏直接在浏览器中加载，几秒钟内启动
- **跨平台兼容**：在桌面、平板和移动设备上提供一致的游戏体验
- **用户评价系统**：玩家可以评价和查看游戏评分
- **游戏分类**：通过类别、标签和搜索功能轻松找到游戏

## 多语言支持

本项目支持多种语言，使用i18next框架实现国际化。

### 支持的语言

- 英语 (en)
- 简体中文 (zh-CN)
- 繁体中文 (zh-TW)
- 日语 (ja)
- 韩语 (ko)
- 德语 (de)
- 法语 (fr)
- 西班牙语 (es)
- 葡萄牙语 (pt)
- 俄语 (ru)

### 翻译文件结构

翻译文件位于 `public/locales` 目录下，按语言代码组织，每种语言包含多个命名空间：

```
/public
  /locales
    /en          # 英语（基准语言）
      common.json
      faq.json
      games.json
      ...
    /zh-CN       # 简体中文
      common.json
      faq.json
      games.json
      ...
    /zh-TW       # 繁体中文
      common.json
      faq.json
      games.json
      ...
```

### 翻译工具

我们提供了几个实用工具来帮助管理翻译：

- `npm run check-translations` - 检查所有语言的翻译文件是否包含相同的键
- `npm run create-translation-template` - 从基准语言生成翻译模板
- `npm run extract-hardcoded-text` - 检查组件中可能存在的硬编码文本
- `npm run i18n-check` - 运行所有检查

### 使用方法

在组件中使用翻译：

```jsx
import TranslatedText from '@/components/common/TranslatedText';

function MyComponent() {
  return (
    <div>
      <h1>
        <TranslatedText i18nKey="myComponent.title" />
      </h1>
      <p>
        <TranslatedText 
          i18nKey="myComponent.description" 
          ns="features" 
          values={{ name: 'Mindseye' }} 
        />
      </p>
    </div>
  );
}
```

在属性中使用翻译：

```jsx
import { useTranslatedText } from '@/components/common/TranslatedText';

function MyComponent() {
  const placeholderText = useTranslatedText('myComponent.searchPlaceholder');
  
  return (
    <input 
      type="text" 
      placeholder={placeholderText} 
    />
  );
}
```

- 英语 (English)
- 简体中文 (Chinese Simplified)
- 繁体中文 (Chinese Traditional)
- 日语 (Japanese)
- 韩语 (Korean)
- 西班牙语 (Spanish)
- 葡萄牙语 (Portuguese)
- 俄语 (Russian)
- 德语 (German)
- 法语 (French)

### 多语言实现方式

项目使用 `i18next` 和 `react-i18next` 实现多语言支持：

1. 翻译文件存储在 `public/locales/{语言代码}/{命名空间}.json` 中
2. 使用语言检测自动选择用户语言
3. 支持通过URL路径切换语言 (例如: `/en/games`, `/zh-CN/games`)
4. 提供语言切换器组件

### 翻译命名空间

项目使用以下翻译命名空间：

- **common.json**: 通用翻译，包括页眉、页脚、按钮等
- **games.json**: 游戏相关翻译，包括游戏详情、控制说明等
- **faq.json**: 常见问题解答
- **hero.json**: 首页英雄区域
- **features.json**: 特色功能介绍
- **testimonials.json**: 用户评价
- **terms.json**: 服务条款
- **privacy.json**: 隐私政策
- **contact.json**: 联系我们页面

### 添加新语言

要添加新语言支持：

1. 在 `src/i18n/languageConfig.ts` 中添加语言配置
2. 在 `public/locales` 下创建新语言的文件夹
3. 为每个命名空间创建翻译文件 (common.json, games.json, faq.json 等)

## 技术栈

- React
- TypeScript
- Tailwind CSS
- Vite
- i18next

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

## 项目结构

```
/
├── public/               # 静态资源
│   ├── images/           # 图片资源
│   └── locales/          # 多语言翻译文件
│       ├── en/           # 英语
│       ├── zh-CN/        # 简体中文
│       └── ...           # 其他语言
├── src/
│   ├── components/       # React组件
│   ├── i18n/             # 国际化配置
│   ├── pages/            # 页面组件
│   ├── types/            # TypeScript类型定义
│   └── utils/            # 工具函数
└── ...
```

## 贡献

欢迎提交Pull Request或Issue来改进项目。

## 许可证

MIT