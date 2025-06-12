import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-blue-500/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src="/images/logo.webp" 
              alt="Mindseye Logo" 
              className="w-10 h-10 object-contain" 
            />
            <span className="text-2xl font-bold text-white">MINDSEYE</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-gray-300 hover:text-blue-400 transition-colors">Home</a>
            <a href="#games" className="text-gray-300 hover:text-blue-400 transition-colors">Games</a>
            <a href="#about" className="text-gray-300 hover:text-blue-400 transition-colors">About</a>
            <a href="#community" className="text-gray-300 hover:text-blue-400 transition-colors">Community</a>
            <a href="#faq" className="text-gray-300 hover:text-blue-400 transition-colors">FAQ</a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-blue-500/20">
            <nav className="flex flex-col space-y-4 mt-4">
              <a href="#home" className="text-gray-300 hover:text-blue-400 transition-colors">Home</a>
              <a href="#games" className="text-gray-300 hover:text-blue-400 transition-colors">Games</a>
              <a href="#about" className="text-gray-300 hover:text-blue-400 transition-colors">About</a>
              <a href="#community" className="text-gray-300 hover:text-blue-400 transition-colors">Community</a>
              <a href="#faq" className="text-gray-300 hover:text-blue-400 transition-colors">FAQ</a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;