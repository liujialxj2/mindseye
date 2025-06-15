import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import { getSupportedLanguageCodes } from './languageConfig';

// 获取当前支持的语言代码
const supportedLngs = getSupportedLanguageCodes();

// 在开发环境中显示翻译键缺失警告
const showTranslationKeyWarnings = process.env.NODE_ENV === 'development';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['path', 'localStorage', 'navigator', 'htmlTag'],
      lookupFromPathIndex: 0,
      caches: ['localStorage'],
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    react: {
      useSuspense: true,
    },
    // 启用命名空间的回退
    fallbackNS: 'common',
    // 添加调试信息，帮助识别缺失的翻译键
    debug: showTranslationKeyWarnings,
    // 确保多个命名空间的加载
    ns: ['common', 'faq', 'games', 'hero', 'features', 'testimonials', 'terms', 'privacy', 'contact'],
    defaultNS: 'common',
    // 添加缺失键处理
    saveMissing: showTranslationKeyWarnings,
    missingKeyHandler: (lng, ns, key, fallbackValue) => {
      if (showTranslationKeyWarnings) {
        console.warn(`[i18n] 缺失翻译键: ${lng}:${ns}:${key}`);
      }
    },
    // 添加错误处理
    parseMissingKeyHandler: (key) => {
      return `[缺少: ${key}]`;
    }
  });

// 监听语言变化，更新HTML语言属性
i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng;
  console.log(`[i18n] 语言已切换到: ${lng}`);
});

// 添加调试辅助函数
if (showTranslationKeyWarnings) {
  // @ts-ignore - 添加到全局对象以便于调试
  window.i18nDebug = {
    getLoadedNamespaces: () => {
      // 安全访问reportNamespaces属性
      return (i18n as any).reportNamespaces?.getUsedNamespaces() || [];
    },
    getLanguages: () => supportedLngs,
    getCurrentLanguage: () => i18n.language,
    checkMissingKeys: (namespace: string) => {
      const keys = Object.keys(i18n.getDataByLanguage('en')?.[namespace] || {});
      const currentLang = i18n.language;
      if (currentLang === 'en') return [];
      
      const currentKeys = Object.keys(i18n.getDataByLanguage(currentLang)?.[namespace] || {});
      return keys.filter(key => !currentKeys.includes(key));
    }
  };
  
  console.info('[i18n] 调试模式已启用，可通过 window.i18nDebug 访问调试工具');
}

export default i18n; 