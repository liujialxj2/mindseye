import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Github, Twitter, Mail, Globe } from 'lucide-react';

const Footer = () => {
  const { t, i18n } = useTranslation('common');
  const currentYear = new Date().getFullYear();
  const { lang } = useParams<{ lang: string }>();
  const currentLang = lang || i18n.language;
  const navigate = useNavigate();
  
  // 定义分类列表
  const categories = [
    { key: 'action', link: 'Action' },
    { key: 'adventure', link: 'Adventure' },
    { key: 'puzzle', link: 'Puzzle' },
    { key: 'strategy', link: 'Strategy' },
    { key: 'casual', link: 'Casual' }
  ];
  
  // 处理锚点导航
  const scrollToSection = (sectionId: string) => {
    // 首先导航到首页（如果不在首页）
    if (window.location.pathname !== `/${currentLang}`) {
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
              {t('footer.description')}
            </p>
            <div className="flex space-x-4">
              <a href="https://github.com/liujialxj2/mindseye" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="https://twitter.com/mindseyegame" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="mailto:liujia.jacky2@gmail.com" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Mail className="w-5 h-5" />
              </a>
              <a href="https://mindseye-88s.pages.dev/" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Globe className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          {/* Quick links */}
          <div className="col-span-1">
            <h3 className="text-white font-bold mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => scrollToSection('home')} 
                  className="text-left text-gray-400 hover:text-blue-400 transition-colors"
                >
                  {t('header.home')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('games')} 
                  className="text-left text-gray-400 hover:text-blue-400 transition-colors"
                >
                  {t('header.games')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('community')} 
                  className="text-left text-gray-400 hover:text-blue-400 transition-colors"
                >
                  {t('footer.community')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('faq')} 
                  className="text-left text-gray-400 hover:text-blue-400 transition-colors"
                >
                  {t('header.faq')}
                </button>
              </li>
              <li><Link to={`/${currentLang}/games`} className="text-gray-400 hover:text-blue-400 transition-colors">{t('footer.allGames')}</Link></li>
            </ul>
          </div>
          
          {/* Categories */}
          <div className="col-span-1">
            <h3 className="text-white font-bold mb-4">{t('gamesList.categories')}</h3>
            <ul className="space-y-2">
              {categories.map(category => (
                <li key={category.key}>
                  <Link 
                    to={`/${currentLang}/games?category=${category.link}`} 
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    {t(`categories.${category.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-500">
            {t('footer.copyright', { year: currentYear })}
          </p>
          <div className="flex justify-center space-x-4 mt-4">
            <Link to={`/${currentLang}/terms`} className="text-gray-500 hover:text-blue-400 transition-colors text-sm">{t('footer.terms')}</Link>
            <Link to={`/${currentLang}/privacy`} className="text-gray-500 hover:text-blue-400 transition-colors text-sm">{t('footer.privacy')}</Link>
            <Link to={`/${currentLang}/contact`} className="text-gray-500 hover:text-blue-400 transition-colors text-sm">{t('footer.contact')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;