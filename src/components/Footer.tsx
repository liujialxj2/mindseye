import React from 'react';
import { Github, Twitter, Mail, Globe } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 border-t border-blue-900/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src="/images/logo.webp" 
                alt="Mindseye Logo" 
                className="w-10 h-10 object-contain" 
              />
              <span className="text-2xl font-bold text-white">MINDSEYE</span>
            </div>
            <p className="text-gray-400 mb-4">
              Explore the world of Mindseye. Challenge your perception with our innovative games and prepare for the ultimate gaming experience.
            </p>
            <div className="flex space-x-4">
              <a href="https://github.com/mindseye-game" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://twitter.com/mindseyegame" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="mailto:contact@mindseye-game.com" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Mail className="w-5 h-5" />
              </a>
              <a href="https://mindseye-game.com" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Globe className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          {/* Quick links */}
          <div className="col-span-1">
            <h3 className="text-white font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#home" className="text-gray-400 hover:text-blue-400 transition-colors">Home</a></li>
              <li><a href="#games" className="text-gray-400 hover:text-blue-400 transition-colors">Games</a></li>
              <li><a href="#about" className="text-gray-400 hover:text-blue-400 transition-colors">About</a></li>
              <li><a href="#faq" className="text-gray-400 hover:text-blue-400 transition-colors">FAQ</a></li>
              <li><a href="https://mindseye-game.com/blog" className="text-gray-400 hover:text-blue-400 transition-colors">Blog</a></li>
            </ul>
          </div>
          
          {/* Categories */}
          <div className="col-span-1">
            <h3 className="text-white font-bold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li><a href="#action" className="text-gray-400 hover:text-blue-400 transition-colors">Action</a></li>
              <li><a href="#adventure" className="text-gray-400 hover:text-blue-400 transition-colors">Adventure</a></li>
              <li><a href="#puzzle" className="text-gray-400 hover:text-blue-400 transition-colors">Puzzle</a></li>
              <li><a href="#strategy" className="text-gray-400 hover:text-blue-400 transition-colors">Strategy</a></li>
              <li><a href="#casual" className="text-gray-400 hover:text-blue-400 transition-colors">Casual</a></li>
            </ul>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-500">
            &copy; {currentYear} Mindseye Game. All rights reserved.
          </p>
          <div className="flex justify-center space-x-4 mt-4">
            <a href="/privacy" className="text-gray-500 hover:text-blue-400 transition-colors text-sm">Privacy Policy</a>
            <a href="/terms" className="text-gray-500 hover:text-blue-400 transition-colors text-sm">Terms of Service</a>
            <a href="/contact" className="text-gray-500 hover:text-blue-400 transition-colors text-sm">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;