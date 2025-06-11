import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import GamesList from './components/GamesList';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import GamePage from './pages/GamePage';
import gamesJson from './data/games.json';
import { setGamesData } from './utils/gameDataFetcher';

function App() {
  // 初始化游戏数据
  useEffect(() => {
    setGamesData(gamesJson.games);
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-black text-white">
        <Routes>
          {/* 游戏详情页路由 */}
          <Route path="/games/:gameId" element={
            <>
              <GamePage />
            </>
          } />
          
          {/* 主页路由 */}
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