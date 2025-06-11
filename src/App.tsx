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
import gamesJson from './data/games.json';
import { setGamesData } from './utils/gameDataFetcher';

function App() {
  const [loading, setLoading] = useState(true);

  // 初始化游戏数据
  useEffect(() => {
    // 开发环境直接使用导入的JSON数据
    if (import.meta.env.DEV) {
      setGamesData(gamesJson.games);
      setLoading(false);
      return;
    }

    // 生产环境通过fetch获取数据
    const timestamp = new Date().getTime(); // 添加时间戳避免缓存
    fetch(`/src/data/games.json?t=${timestamp}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log(`已加载 ${data.games.length} 个游戏`);
        setGamesData(data.games);
        setLoading(false);
      })
      .catch(error => {
        console.error('加载游戏数据失败:', error);
        // 发生错误时，尝试使用内置数据作为后备
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