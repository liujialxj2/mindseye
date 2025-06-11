/**
 * CrazyGames Game Data Scraper
 * 
 * Usage:
 * node games-scraper.js [category] [count]
 * 
 * Parameters:
 * - category: Game category, like trending, action, puzzle, etc. (default: trending)
 * - count: Number of games to scrape (default: 10)
 * 
 * Example:
 * node games-scraper.js trending 10
 */

import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get command line arguments
const args = process.argv.slice(2);
const category = args[0] || 'trending';
const count = parseInt(args[1]) || 10;

console.log(`Starting to scrape ${count} games from CrazyGames in the ${category} category...`);

// Main function to scrape CrazyGames data
async function scrapeGames(category = 'trending', maxCount = 10) {
  try {
    // Get game list page
    const url = `https://www.crazygames.com/t/${category}`;
    console.log(`Accessing ${url} page...`);
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      }
    });
    
    const $ = cheerio.load(response.data);
    
    const games = [];
    // Select game card elements - update selector based on current site structure
    const gameCards = $('a[href^="/game/"]').parent();
    
    console.log(`Found ${gameCards.length} game cards, preparing to process ${Math.min(maxCount, gameCards.length)}...`);
    
    // Limit the number of games to scrape
    const limitedCards = gameCards.slice(0, maxCount);
    
    // Iterate through game cards and extract information
    for (let i = 0; i < limitedCards.length; i++) {
      const card = $(limitedCards[i]);
      const gameLink = card.find('a[href^="/game/"]');
      
      // Extract basic information
      const title = gameLink.attr('title') || gameLink.text().trim();
      const thumbnailUrl = card.find('img').attr('src') || card.find('img').attr('data-src');
      const gameUrl = gameLink.attr('href');
      const gameId = gameUrl ? gameUrl.split('/').pop().toLowerCase().replace(/[^a-z0-9]+/g, '-') : `game-${i}`;
      
      console.log(`Processing game ${i+1}/${limitedCards.length}: ${title}`);
      
      // Get detail page
      try {
        console.log(`  Accessing detail page: ${gameUrl ? 'https://www.crazygames.com' + gameUrl : 'URL not found'}`);
        
        if (!gameUrl) {
          console.error(`  Error: Game "${title}" has no URL, skipping`);
          continue;
        }
        
        const detailResponse = await axios.get(`https://www.crazygames.com${gameUrl}`, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
          }
        });
        
        const detailPage = cheerio.load(detailResponse.data);
        
        // Extract detailed information - update selectors as needed
        const description = detailPage('meta[name="description"]').attr('content') || 
                           detailPage('meta[property="og:description"]').attr('content') || '';
        
        // Use game URL to build standardized CrazyGames embed link
        const gamePath = gameUrl.split('/').pop();
        const embedUrl = `https://www.crazygames.com/embed/${gamePath}`;
        
        const controls = detailPage('div:contains("Controls")').next().text().trim() || 
                        'Use keyboard and mouse to control the game';
        
        // Extract highlights
        const highlights = [];
        detailPage('div.game-description p').each((i, el) => {
          const text = $(el).text().trim();
          if (text.length > 10) { // Skip paragraphs that are too short
            highlights.push(text);
          }
        });
        
        // If no highlights found, try another selector
        if (highlights.length === 0) {
          detailPage('div.css-description p').each((i, el) => {
            const text = $(el).text().trim();
            if (text.length > 10) {
              highlights.push(text);
            }
          });
        }
        
        // Ensure there are at least some highlights
        if (highlights.length === 0) {
          const paragraphs = description.split('.');
          for (let j = 0; j < Math.min(3, paragraphs.length); j++) {
            const text = paragraphs[j].trim();
            if (text.length > 10) {
              highlights.push(text + '.');
            }
          }
        }
        
        // If still no highlights, add some generic ones
        if (highlights.length === 0) {
          highlights.push(
            'Enjoy this exciting game experience', 
            'Simple and intuitive controls', 
            'Challenging gameplay with increasing difficulty'
          );
        }
        
        // Build game object
        const gameData = {
          id: gameId,
          title: title,
          description: description || `Play ${title} on Mindseye Games - an exciting online game that's free to play in your browser.`,
          thumbnailUrl: thumbnailUrl || '',
          iframeUrl: embedUrl,
          controls: controls || 'Use keyboard and mouse to control the game',
          highlights: highlights.slice(0, 3), // Limit number of highlights
          originalUrl: `https://www.crazygames.com${gameUrl}`,
          category: category
        };
        
        games.push(gameData);
        console.log(`  Successfully extracted game info: ${title} (embed link: ${embedUrl})`);
        
      } catch (detailError) {
        console.error(`  Error: Unable to get details for game "${title}": ${detailError.message}`);
      }
      
      // Add a delay to avoid making requests too quickly
      console.log('  Waiting 2 seconds...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    // Save to JSON file
    const dataDir = path.join(__dirname, '../src/data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // Read existing game data
    let existingGames = [];
    const gamesJsonPath = path.join(dataDir, 'games.json');
    if (fs.existsSync(gamesJsonPath)) {
      try {
        const existingData = JSON.parse(fs.readFileSync(gamesJsonPath, 'utf8'));
        if (existingData && existingData.games) {
          existingGames = existingData.games;
        }
      } catch (err) {
        console.error('Error reading existing game data:', err);
      }
    }
    
    // Replace the existing games with the new ones
    const newGamesData = {
      games: games
    };
    
    // Write the new data
    fs.writeFileSync(
      gamesJsonPath,
      JSON.stringify(newGamesData, null, 2)
    );
    
    console.log(`Successfully scraped ${games.length} new games`);
    console.log(`Data saved to: ${gamesJsonPath}`);
    
    return games;
  } catch (error) {
    console.error('Error scraping game data:', error);
    return [];
  }
}

// Execute the scrape
scrapeGames(category, count); 