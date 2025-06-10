import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

/**
 * 网站头部导航组件
 */
export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  // 导航链接
  const navLinks = [
    { title: '首页', url: '/' },
    { title: '游戏', url: '/games' },
    { title: '关于', url: '/about' },
    { title: '联系', url: '/contact' }
  ];
  
  // 判断导航链接是否激活
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };
  
  return (
    <header className="bg-black text-white sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-white">
              Mindseye<span className="text-blue-500">Games</span>
            </span>
          </Link>
          
          {/* 桌面导航 */}
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.url}
                to={link.url}
                className={`transition-colors ${
                  isActive(link.url)
                    ? 'text-blue-400 font-medium'
                    : 'text-gray-300 hover:text-blue-400'
                }`}
              >
                {link.title}
              </Link>
            ))}
          </nav>
          
          {/* 游戏按钮 */}
          <div className="hidden md:block">
            <Link
              to="/games"
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-md font-medium hover:from-blue-600 hover:to-purple-700 transition-colors"
            >
              玩游戏
            </Link>
          </div>
          
          {/* 移动端菜单按钮 */}
          <button
            className="md:hidden text-gray-300 hover:text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* 移动端菜单 */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-800">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.url}
                  to={link.url}
                  className={`transition-colors px-2 py-2 ${
                    isActive(link.url)
                      ? 'text-blue-400 font-medium'
                      : 'text-gray-300 hover:text-blue-400'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.title}
                </Link>
              ))}
              <Link
                to="/games"
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-md font-medium text-center hover:from-blue-600 hover:to-purple-700 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                玩游戏
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}