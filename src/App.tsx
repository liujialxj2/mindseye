import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Hero from './components/Hero';
import GameShowcase from './components/GameShowcase';
import Features from './components/Features';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import GamesListPage from './pages/games';
import GameDetailPage from './pages/games/[slug]';

/**
 * 主应用组件
 */
function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-black text-white">
        <Header />
        
        <main className="flex-grow">
          <Routes>
            {/* 首页 */}
            <Route path="/" element={
              <>
                <Hero />
                <GameShowcase />
                <Features />
                <Testimonials />
                <FAQ />
              </>
            } />
            
            {/* 游戏列表页 */}
            <Route path="/games" element={<GamesListPage />} />
            
            {/* 游戏详情页 */}
            <Route path="/games/:slug" element={<GameDetailPage />} />
            
            {/* 404重定向到首页 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;