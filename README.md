# Mindseye 游戏网站

这是一个使用React、TypeScript和Tailwind CSS构建的游戏展示网站，展示Mindseye游戏的特性和Mini Games。

## 功能特点

- 响应式设计，适配各种设备（桌面端、平板、手机）
- 游戏截图电影胶片式横向滚动展示
- 三款可玩的小游戏：Aventador Vice Crime City、Strykon和Feed me Monsters!
- 游戏特性展示与详细说明
- 真实玩家评价展示
- 官方版本发布倒计时功能
- 全屏游戏体验支持

## 技术栈

- **前端框架**: React 18 + TypeScript
- **样式**: Tailwind CSS
- **构建工具**: Vite
- **部署**: Cloudflare Pages

## 如何运行

### 本地开发
1. 克隆仓库: `git clone https://github.com/liujialxj2/mindseye.git`
2. 安装依赖: `npm install`
3. 启动开发服务器: `npm run dev`
4. 访问: `http://localhost:5173`

### 构建项目
1. 执行构建命令: `npm run build`
2. 构建产物将输出到 `dist` 目录

## 部署说明

本项目使用Cloudflare Pages部署，配置文件包括:

- `.cloudflare/pages.json`: Cloudflare Pages的主要配置
- `_headers`: 控制HTTP头部和MIME类型
- `_redirects`: 管理页面重定向规则

### Cloudflare Pages配置

项目使用`.cloudflare/pages.json`配置Cloudflare Pages部署，该文件指定:
- 输出目录为`dist` 
- JavaScript和CSS文件的正确MIME类型
- 基本重定向规则

## 项目结构

```
mindseye/
├── dist/              # 构建输出目录
├── public/            # 静态资源文件
│   ├── images/        # 图片资源
├── src/               # 源代码
│   ├── components/    # React组件
│   ├── App.tsx        # 主应用组件
│   └── main.tsx       # 应用入口点
└── .cloudflare/       # Cloudflare配置
```

## 在线访问

访问 [https://www.mindseye.cool](https://www.mindseye.cool) 查看网站。
