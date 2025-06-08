# Mindseye Game Official Website

This is the official website project for Mindseye game, showcasing game features and mini-games.

## Project Overview

- **Project Name**: Mindseye Game Official Website
- **Deployment URL**: https://www.mindseye.cool/
- **GitHub Repository**: https://github.com/liujialxj2/mindseye

## Technology Stack

- React + TypeScript
- Vite build tool
- Tailwind CSS framework
- Cloudflare Pages deployment

## Project Structure

```
mindseye/
├── public/             # Static assets directory
│   ├── images/         # Image assets
│   │   ├── screenshots/  # Game screenshots
│   │   ├── games/        # Mini-games images
│   │   └── logo.webp     # Website logo
├── src/                # Source code directory
│   ├── components/     # React components
│   ├── App.tsx         # Main application component
│   └── main.tsx        # Entry file
├── dist/               # Build output directory
├── _redirects          # Cloudflare redirect rules
├── deploy.js           # Deployment helper script
├── wrangler.toml       # Cloudflare Wrangler configuration
└── package.json        # Project dependencies configuration
```

## Deployment Configuration

### Cloudflare Pages Configuration

The project uses Cloudflare Pages for deployment with the following configurations:

1. **_redirects file**: Configures routing redirect rules for SPA applications.
2. **wrangler.toml**: Cloudflare Wrangler configuration file specifying the build output directory and custom page rules.
3. **.cloudflare/pages.json**: Cloudflare Pages configuration file containing build settings, response headers, and redirect rules.

### Build & Deployment Process

1. Build the project using Vite: `npm run build`
2. Deploy to Cloudflare Pages: `npm run deploy`

## Image Asset Handling

Image assets in the project are stored in the `public/images` directory and loaded using the following approach:

1. In components, reference images using absolute paths: `/images/screenshots/screenshot1.jpg`
2. Proper MIME types are configured in `.cloudflare/pages.json` to ensure correct image recognition

## Common Issues & Solutions

### MIME Type Errors

**Issue**: Browser cannot load images properly, showing MIME type errors.

**Solution**:
1. Add MIME type configurations for image files in `.cloudflare/pages.json`
2. Ensure wrangler.toml is correctly configured

### Resource Path Issues

**Issue**: Resource path references are incorrect after building.

**Solution**:
1. Modify resource reference paths in `index.html` to use correct relative paths
2. Ensure static assets are correctly placed in the public directory

## Development Guide

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build project
npm run build

# Preview build results
npm run preview

# Deploy to Cloudflare Pages
npm run deploy
```

### Deployment Updates

1. Commit code to GitHub repository
2. Use the deploy script to manually deploy: `npm run deploy`
3. Alternatively, Cloudflare Pages can automatically deploy from your GitHub repository

### Manual Deployment Steps

If you prefer to deploy manually:

1. Install Wrangler CLI: `npm install -g wrangler`
2. Login to Cloudflare: `wrangler login`
3. Deploy: `wrangler pages deploy dist`
