import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import GamesList from './components/GamesList';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import GamePage from './pages/GamePage';
import GamesListPage from './pages/GamesListPage';
import gamesJson from './data/games.json';
import { setGamesData } from './utils/gameDataFetcher';

function App() {
  const [loading, setLoading] = useState(true);

  // Remove potential third-party tool scripts
  useEffect(() => {
    // Remove all potential third-party support tool scripts
    const scripts = document.querySelectorAll('script[src*="tawk"], script[src*="crisp"], script[src*="intercom"], script[src*="zendesk"], script[src*="help"], script[src*="support"], script[src*="chat"]');
    scripts.forEach(script => script.remove());
    
    // Remove potential floating help buttons
    const helpElements = document.querySelectorAll('[id*="help"], [class*="help"], [id*="chat"], [class*="chat"], [id*="support"], [class*="support"]');
    helpElements.forEach(el => {
      if (el.tagName !== 'SECTION' && el.tagName !== 'DIV' && el.tagName !== 'ARTICLE') {
        el.remove();
      }
    });
    
    // Add CSS rules to hide potential help floating buttons
    const style = document.createElement('style');
    style.textContent = `
      #tawk-bubble-container, #crisp-chatbox, .intercom-launcher, .zopim, .drift-widget, .olark-launch-button, .helpButtonEnabled, .help-button, .support-button, .chat-button { 
        display: none !important; 
      }
    `;
    document.head.appendChild(style);
  }, []);

  // Initialize game data
  useEffect(() => {
    // Development environment directly uses imported JSON data
    if (import.meta.env.DEV) {
      setGamesData(gamesJson.games);
      setLoading(false);
      return;
    }

    // Production environment fetches data
    const timestamp = new Date().getTime(); // Add timestamp to avoid caching
    fetch(`/src/data/games.json?t=${timestamp}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log(`Loaded ${data.games.length} games`);
        setGamesData(data.games);
        setLoading(false);
      })
      .catch(error => {
        console.error('Failed to load game data:', error);
        // In case of error, try to use built-in data as fallback
        setGamesData(gamesJson.games);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading games...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-black text-white">
        <Routes>
          {/* Game detail page route */}
          <Route path="/games/:gameId" element={
            <>
              <GamePage />
            </>
          } />
          
          {/* All games list page route */}
          <Route path="/games" element={
            <>
              <GamesListPage />
            </>
          } />
          
          {/* Home page route */}
          <Route path="/" element={
            <>
              <Header />
              <Hero />
              <GamesList />
              <Features />
              <Testimonials />
              <FAQ />
              <Footer />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;