import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import GameShowcase from './components/GameShowcase';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <Hero />
      <GameShowcase />
      <Features />
      <Testimonials />
      <FAQ />
      <Footer />
    </div>
  );
}

export default App;