import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { getCurrentlySupportedLanguages, getLanguageByCode } from '../i18n/languageConfig';

const LanguageSwitcher: React.FC = () => {
  const { t, i18n } = useTranslation('common');
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // 获取当前环境下支持的语言
  const languages = getCurrentlySupportedLanguages();
  
  // 当前语言信息
  const currentLang = getLanguageByCode(i18n.language);
  
  // 根据搜索过滤语言
  const filteredLanguages = languages.filter(lang => 
    lang.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // 处理语言切换
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
    setSearchQuery('');
    
    // 更新 URL 路径中的语言代码
    const currentPath = window.location.pathname;
    const pathParts = currentPath.split('/').filter(Boolean);
    
    // 检查第一部分是否是语言代码
    const isLangInPath = languages.some(lang => lang.code === pathParts[0]);
    
    if (isLangInPath) {
      // 替换路径中的语言代码
      pathParts[0] = lng;
      window.history.pushState({}, '', `/${pathParts.join('/')}`);
    } else {
      // 在路径前添加语言代码
      window.history.pushState({}, '', `/${lng}${currentPath}`);
    }
  };
  
  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        className="flex items-center space-x-2 text-gray-300 hover:text-blue-400 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={t('languageSwitcher.selectLanguage', 'Select language')}
      >
        <Globe className="w-5 h-5" />
        <span className="hidden sm:inline">{currentLang.nativeName}</span>
        <span className="inline sm:hidden">{currentLang.flag}</span>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 max-h-96 overflow-y-auto bg-gray-900 border border-blue-500/20 rounded-lg shadow-lg z-50">
          {/* 搜索框 */}
          <div className="p-2 border-b border-gray-800">
            <input
              type="text"
              placeholder={t('languageSwitcher.search', 'Search languages...')}
              className="w-full bg-gray-800 text-gray-200 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          </div>
          
          {/* 语言列表 */}
          <div className="py-1">
            {filteredLanguages.length > 0 ? (
              filteredLanguages.map((lang) => (
                <button
                  key={lang.code}
                  className={`flex items-center w-full text-left px-4 py-2 hover:bg-gray-800 ${
                    i18n.language === lang.code ? 'text-blue-400 bg-gray-800/50' : 'text-gray-300'
                  }`}
                  onClick={() => changeLanguage(lang.code)}
                >
                  <span className="mr-2">{lang.flag}</span>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{lang.nativeName}</span>
                    <span className="text-xs text-gray-400">{lang.name}</span>
                  </div>
                  {i18n.language === lang.code && (
                    <span className="ml-auto text-blue-400">✓</span>
                  )}
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-gray-400 text-center">
                {t('languageSwitcher.noResults', 'No results found')}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher; 