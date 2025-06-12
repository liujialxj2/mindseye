# Mindseye Game Official Website

This is the official website project for Mindseye game, showcasing game features and mini-game experiences. The website provides various mini-games for users to enjoy while waiting for the official game release.

## Project Overview

- **Project Name**: Mindseye Game Official Website
- **Deployment URL**: https://mindseye-88s.pages.dev/
- **Main Features**: 
  - Showcase Mindseye brand
  - Provide multiple mini-game experiences
  - Game categorization and search
  - Responsive design, supporting multiple devices

## Technology Stack

- **Frontend Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling Framework**: Tailwind CSS
- **Routing Management**: React Router
- **Deployment Platform**: Cloudflare Pages
- **Game Integration**: GameDistribution SDK

## Recent Updates

- **UI Improvements**: Fixed game card display issues to ensure proper text rendering and button alignment
- **Language Support**: Converted all content from Chinese to English for international audience
- **Deployment Configuration**: Added proper build command configuration in wrangler.toml for Cloudflare Pages
- **SEO Optimization**: Added sitemap and robots.txt for better search engine indexing

## Page Structure

### Home Page
- Top navigation bar (Header component)
- Hero area (Hero component) - Showcases game brand and main information
- Game list area (GamesList component) - Displays playable mini-games
- Feature introduction (Features component) - Showcases main features of the website and games
- User reviews (Testimonials component) - Displays user feedback
- Frequently asked questions (FAQ component) - Answers questions users might have
- Footer information (Footer component) - Contains contact information and copyright

### Game Detail Page
- Game information display (GameDetail component) - Shows game title, description, and control instructions
- Game frame (GameDistributionFrame component) - Embeds and runs the game
- Return button - Allows users to return to the home page

## Project Structure

```
mindseye/
├── public/             # Static resource directory
│   ├── images/         # Image resources
│   │   ├── screenshots/  # Game screenshots
│   │   ├── games/        # Mini-game images
│   │   └── logo.webp     # Website logo
│   ├── gameDistributionInit.js  # GameDistribution SDK initialization
│   ├── gdgame-adapter.js        # Game platform adapter
│   ├── gd-style-fix.css         # Game style fixes
│   ├── gd-domain-bridge.js      # Domain bridge script
│   └── game-compatibility.js    # Game compatibility handling
├── src/                # Source code directory
│   ├── components/     # React components
│   │   ├── Header.tsx        # Website header navigation component
│   │   ├── Hero.tsx         # Homepage hero area component
│   │   ├── GamesList.tsx    # Game list component
│   │   ├── GameCard.tsx     # Single game card component
│   │   ├── GameDetail.tsx   # Game detail component
│   │   ├── GameDistributionFrame.tsx # Game embedding frame component
│   │   ├── Features.tsx     # Feature showcase component
│   │   ├── Testimonials.tsx # User reviews component
│   │   ├── FAQ.tsx          # FAQ component
│   │   └── Footer.tsx       # Footer component
│   ├── pages/          # Page components
│   │   ├── HomePage.tsx     # Home page component
│   │   └── GamePage.tsx     # Game detail page component
│   ├── data/           # Data files
│   │   └── games.json       # Game data file
│   ├── utils/          # Utility tools
│   ├── types/          # TypeScript type definitions
│   ├── App.tsx         # Main application component
│   ├── main.tsx        # Entry file
│   └── index.css       # Global styles
├── dist/               # Build output directory
├── _redirects          # Cloudflare redirect rules
├── _headers            # Cloudflare response header configuration
├── wrangler.toml       # Cloudflare Wrangler configuration
├── deploy.cjs          # Deployment helper script
├── vite.config.ts      # Vite configuration file
├── tailwind.config.js  # Tailwind configuration file
└── package.json        # Project dependency configuration
```

## Features

### Responsive Design
- Adaptive layout, perfectly supporting desktop, tablet, and mobile devices
- User interface elements optimized for different screen sizes
- Mobile-friendly interaction methods

### Game Integration
- Seamless integration with GameDistribution platform
- Support for various types of HTML5 games
- Game control guides and category display
- Game search and filtering functionality

### User Experience
- Fast-loading page design
- Clear and intuitive navigation system
- Smooth page transition animations
- Dark theme, providing good contrast for game content

### Performance Optimization
- Resource preloading strategy
- Image lazy loading
- Optimized loading of CSS and JavaScript
- Cross-origin resource sharing solutions

## Deployment Configuration

### Cloudflare Pages Setup

The website is deployed using Cloudflare Pages with the following configuration in `wrangler.toml`:

```toml
# Cloudflare Pages configuration
name = "mindseye"
compatibility_date = "2025-06-08"
pages_build_output_dir = "dist" 

# Build configuration
[build]
command = "npm run build"
```

### Deployment Process

1. Build the project locally: `npm run build`
2. Commit the updated `dist` directory to the repository
3. Push changes to GitHub
4. Cloudflare automatically detects changes and deploys the website

Alternatively, you can configure Cloudflare Pages to build the project automatically:
1. In the Cloudflare Pages dashboard, set the build command to `npm run build`
2. Set the build output directory to `dist`
3. Push changes to GitHub without building locally

### Troubleshooting Deployment Issues

If the deployed website doesn't match your local development version:
1. Check if the build command is properly configured in Cloudflare Pages
2. Ensure the `dist` directory contains the latest build files
3. Verify that all necessary assets are included in the build
4. Check the deployment logs for any errors

## Game Data Structure

Game data is stored in the `