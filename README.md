# Mindseye游戏官方网站

这是Mindseye游戏的官方网站项目，展示游戏功能和迷你游戏体验。

## 项目概述

- **项目名称**: Mindseye游戏官方网站
- **部署URL**: https://mindseye-88s.pages.dev/
- **GitHub仓库**: https://github.com/liujialxj2/mindseye

## 技术栈

- React + TypeScript
- Vite构建工具
- Tailwind CSS框架
- Cloudflare Pages部署

## 项目特点

- **响应式设计** - 适配各种设备尺寸的流畅用户体验
- **游戏集成** - 与GameDistribution平台整合的在线游戏体验
- **交互式UI** - 动态导航、图片轮播和模态框等用户界面元素
- **优化的性能** - 快速加载和平滑的页面过渡
- **无障碍设计** - 符合现代网页可访问性标准

## 项目结构

```
mindseye/
├── public/             # 静态资源目录
│   ├── images/         # 图片资源
│   │   ├── screenshots/  # 游戏截图
│   │   ├── games/        # 迷你游戏图片
│   │   └── logo.webp     # 网站标志
│   ├── gameDistributionInit.js  # GameDistribution SDK初始化
│   ├── gdgame-adapter.js        # 游戏平台适配器
│   ├── gd-style-fix.css         # 游戏样式修复
│   └── gd-domain-bridge.js      # 域名桥接脚本
├── src/                # 源代码目录
│   ├── components/     # React组件
│   ├── App.tsx         # 主应用组件
│   └── main.tsx        # 入口文件
├── dist/               # 构建输出目录
├── _redirects          # Cloudflare重定向规则
├── deploy.cjs          # 部署辅助脚本
├── wrangler.toml       # Cloudflare Wrangler配置
└── package.json        # 项目依赖配置
```

## 部署配置

### Cloudflare Pages配置

项目使用Cloudflare Pages进行部署，配置如下：

1. **_redirects文件**: 配置SPA应用程序的路由重定向规则
2. **wrangler.toml**: Cloudflare Wrangler配置文件，指定构建输出目录和自定义页面规则
3. **.cloudflare/pages.json**: Cloudflare Pages配置文件，包含构建设置、响应头和重定向规则

### 构建与部署流程

1. 使用Vite构建项目: `npm run build`
2. 部署到Cloudflare Pages: `node deploy.cjs` 或 `npx wrangler pages deploy dist`

## GameDistribution集成

本网站集成了GameDistribution平台的HTML5游戏，主要实现包括：

### 游戏嵌入

- 通过iframe安全嵌入第三方游戏
- 支持全屏模式和响应式布局
- 实现游戏指令和控制说明

### API集成

- 使用GameDistribution SDK进行游戏初始化和加载
- 处理游戏事件和状态管理
- 解决跨域和安全限制问题

### 性能优化

- 延迟加载游戏资源
- 虚拟localStorage实现跨域存储
- CSS样式修复确保一致的视觉体验

## 常见问题与解决方案

### MIME类型错误

**问题**: 浏览器无法正确加载图片，显示MIME类型错误。

**解决方案**:
1. 在`.cloudflare/pages.json`中为图片文件添加MIME类型配置
2. 确保wrangler.toml正确配置

### 资源路径问题

**问题**: 构建后资源引用路径不正确。

**解决方案**:
1. 修改`index.html`中的资源引用路径，使用正确的相对路径
2. 确保静态资源正确放置在public目录中

### 游戏嵌入问题

**问题**: GameDistribution游戏无法正常加载或显示。

**解决方案**:
1. 检查iframe的sandbox属性设置
2. 确保URL包含正确的`gd_sdk_referrer_url`参数
3. 在GameDistribution平台注册您的域名

## 开发指南

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建项目
npm run build

# 预览构建结果
npm run preview

# 部署到Cloudflare Pages
node deploy.cjs
```

### 部署更新

1. 提交代码到GitHub仓库
2. 使用部署脚本手动部署: `node deploy.cjs`
3. 或者，Cloudflare Pages可以从您的GitHub仓库自动部署

### 手动部署步骤

如果您喜欢手动部署：

1. 安装Wrangler CLI: `npm install -g wrangler`
2. 登录Cloudflare: `wrangler login`
3. 部署: `npx wrangler pages deploy dist`

## 最新更新

### 2025年6月更新
- 修复Official Site链接点击问题
- 改进GameDistribution游戏集成
- 添加游戏说明和控制指南
- 优化移动设备上的用户体验

### 2025年5月更新
- 初始项目设置和基础功能实现
- 添加主页和游戏展示组件
- 集成GameDistribution SDK
- 配置Cloudflare Pages部署
