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

## Game Data Structure

Game data is stored in the `src/data/games.json` file, with each game object containing the following fields:

```json
{
  "id": "Unique game ID",
  "title": "Game title",
  "description": "Game description",
  "thumbnailUrl": "Thumbnail URL",
  "iframeUrl": "Game iframe embedding URL",
  "controls": "Game control instructions",
  "highlights": ["Game highlight 1", "Game highlight 2", "Game highlight 3"],
  "category": "Game category",
  "tags": ["Tag 1", "Tag 2", "Tag 3"]
}
```

## GameDistribution Integration

This website integrates HTML5 games from the GameDistribution platform, with the main implementation including:

### Game Embedding
- Securely embedding third-party games via iframe
- Support for fullscreen mode and responsive layout
- Providing game control guides

### API Integration
- Using GameDistribution SDK for game initialization and loading
- Handling game events and state management
- Solving cross-domain and security restriction issues

### Cross-Domain Solutions
- Implementing domain bridge script
- Virtual localStorage for cross-domain storage
- Handling third-party cookie restrictions

## Development Guide

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build project
npm run build

# Preview build result
npm run preview
```

### Adding New Games

1. Add new game data in the `src/data/games.json` file
2. Ensure all necessary fields are provided: id, title, description, thumbnailUrl, iframeUrl, controls, highlights, category, and tags
3. If you need to add game screenshots, place them in the `public/images/screenshots/` directory
4. Rebuild and deploy the project

### Deployment Steps

1. Build the project using Vite: `npm run build`
2. Run the deployment script: `node deploy.cjs` or `npx wrangler pages deploy dist`

## Browser Compatibility

- Latest Chrome version
- Latest Firefox version
- Latest Safari version
- Latest Edge version
- Mobile device browsers: iOS Safari, Android Chrome

## Design Philosophy

- **Simplicity**: Minimalist interface design, highlighting game content
- **Modern**: Stylish visual elements and effects
- **Intuitive**: Easy-to-understand navigation and operation
- **Immersive**: Dark theme providing an immersive gaming experience
- **Adaptability**: Optimized for different devices and screen sizes

## Future Plans

- Add user account system
- Game rating and comment functionality
- More game categories and tags
- Game collection and history
- Achievement system and leaderboards

## SEO Optimization

- Optimized meta tags for better search engine visibility
- Structured data for rich search results
- Performance optimization for better page speed scores
- Mobile-friendly responsive design
- Keyword optimization based on search volume data:
  - Primary keywords: mindseye game, adventure games, puzzle games
  - Secondary keywords: mindseye release date, mindseye gameplay, perception games
  - Long-tail keywords: mindseye open world, mindseye app, mindseye steam

## Common Issues and Solutions

### Game Loading Issues

**Issue**: Some games show white screen or fail to load.

**Solution**:
1. Check if third-party cookies are enabled in the browser
2. Try using a different browser
3. Ensure network connection is stable

### Game Control Issues

**Issue**: Game controls not responding or behaving abnormally.

**Solution**:
1. Check the control instructions on the game detail page
2. On desktop devices, ensure keyboard and mouse are working properly
3. On mobile devices, ensure touchscreen is clean and responsive

### Slow Page Loading

**Issue**: Website loads slowly.

**Solution**:
1. Check network connection
2. Clear browser cache
3. Close other applications using bandwidth

## Contact and Support

If you have any questions or suggestions, please contact us through:
- Email: support@mindseye-game.com
- Official Website: https://mindseye-game.com
- Social Media: @mindseyegame
