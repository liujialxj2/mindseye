import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import LanguageSwitcher from './LanguageSwitcher';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t, i18n } = useTranslation('common');
  const { lang } = useParams<{ lang: string }>();
  const currentLang = lang || i18n.language;
  const navigate = useNavigate();
  const location = useLocation();
  
  // 检查是否在首页
  const isHomePage = location.pathname === `/${currentLang}` || location.pathname === '/';
  
  // 处理锚点导航
  const scrollToSection = (sectionId: string) => {
    setIsMenuOpen(false); // 关闭移动菜单
    
    // 首先导航到首页（如果不在首页）
    if (!isHomePage) {
      navigate(`/${currentLang}`);
      // 等待页面加载完成后滚动
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // 如果已经在首页，直接滚动
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };
  
  // 监听路由变化，如果有hash，滚动到对应元素
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.substring(1);
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-blue-500/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link to={`/${currentLang}`}>
              <img 
                src="/images/logo.webp" 
                alt="Mindseye Logo" 
                className="w-10 h-10 object-contain" 
              />
            </Link>
            <Link to={`/${currentLang}`} className="text-2xl font-bold text-white">MINDSEYE</Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollToSection('home')} className="text-gray-300 hover:text-blue-400 transition-colors">
              {t('header.home')}
            </button>
            <button onClick={() => scrollToSection('games')} className="text-gray-300 hover:text-blue-400 transition-colors">
              {t('header.games')}
            </button>
            <button onClick={() => scrollToSection('faq')} className="text-gray-300 hover:text-blue-400 transition-colors">
              {t('header.faq')}
            </button>
            <LanguageSwitcher />
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white"
            aria-label={isMenuOpen ? t('header.closeMenu') : t('header.openMenu')}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-blue-500/20">
            <nav className="flex flex-col space-y-4 mt-4">
              <button onClick={() => scrollToSection('home')} className="text-left text-gray-300 hover:text-blue-400 transition-colors">
                {t('header.home')}
              </button>
              <button onClick={() => scrollToSection('games')} className="text-left text-gray-300 hover:text-blue-400 transition-colors">
                {t('header.games')}
              </button>
              <button onClick={() => scrollToSection('faq')} className="text-left text-gray-300 hover:text-blue-400 transition-colors">
                {t('header.faq')}
              </button>
              <LanguageSwitcher />
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;