# Mindseye 游戏官网

这是Mindseye游戏的官方网站项目，展示游戏特性和迷你游戏。

## 项目说明

- **项目名称**：Mindseye游戏官网
- **部署地址**：https://www.mindseye.cool/
- **GitHub仓库**：https://github.com/liujialxj2/mindseye

## 技术栈

- React + TypeScript
- Vite 构建工具
- Tailwind CSS 样式框架
- Cloudflare Pages 部署

## 项目结构

```
mindseye/
├── public/             # 静态资源目录
│   ├── images/         # 图片资源
│   │   ├── screenshots/  # 游戏截图
│   │   ├── games/        # 迷你游戏图片
│   │   └── logo.webp     # 网站logo
├── src/                # 源代码目录
│   ├── components/     # React组件
│   ├── App.tsx         # 应用主组件
│   └── main.tsx        # 入口文件
├── dist/               # 构建输出目录
├── _headers            # Cloudflare自定义响应头配置
├── _redirects          # Cloudflare重定向规则
├── copy-assets.cjs     # 资源复制脚本
├── wrangler.toml       # Cloudflare Wrangler配置
└── package.json        # 项目依赖配置
```

## 部署配置

### Cloudflare Pages配置

项目使用Cloudflare Pages进行部署，主要配置包括：

1. **_headers文件**：配置各种文件类型的MIME类型，确保浏览器正确识别文件类型。
2. **_redirects文件**：配置SPA应用的路由重定向规则。
3. **wrangler.toml**：Cloudflare Wrangler配置文件，指定构建输出目录和自定义页面规则。
4. **.cloudflare/pages.json**：Cloudflare Pages的配置文件，包含构建配置、响应头设置和重定向规则。

### 构建流程

1. 使用Vite进行项目构建：`vite build`
2. 使用自定义脚本`copy-assets.cjs`复制静态资源到dist目录
3. 部署到Cloudflare Pages

## 图片资源处理

项目中的图片资源存放在`public/images`目录下，通过以下方式确保正确加载：

1. 在构建过程中，使用`copy-assets.cjs`脚本将图片复制到`dist/images`目录
2. 在`_headers`文件中配置正确的MIME类型，确保图片文件被正确识别
3. 在组件中使用绝对路径引用图片：`/images/screenshots/screenshot1.jpg`

## 常见问题解决

### MIME类型错误

**问题**：浏览器无法正确加载图片，提示MIME类型错误。

**解决方案**：
1. 在`_headers`文件中添加图片文件的MIME类型配置
2. 在`.cloudflare/pages.json`中添加图片文件的MIME类型配置
3. 创建`wrangler.toml`文件，添加自定义页面规则

### 资源路径问题

**问题**：构建后的资源路径引用错误。

**解决方案**：
1. 修改`index.html`中的资源引用路径，使用正确的相对路径
2. 使用`copy-assets.cjs`脚本确保静态资源被正确复制到构建目录

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
```

### 部署更新

1. 提交代码到GitHub仓库
2. Cloudflare Pages会自动从GitHub仓库拉取最新代码并部署
