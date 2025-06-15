// 第一阶段支持的语言
export const PHASE_ONE_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', rtl: false },
  { code: 'zh-CN', name: 'Chinese (Simplified)', nativeName: '简体中文', flag: '🇨🇳', rtl: false },
  { code: 'zh-TW', name: 'Chinese (Traditional)', nativeName: '繁體中文', flag: '🇹🇼', rtl: false },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', rtl: false },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', rtl: false },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', rtl: false },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷', rtl: false },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', rtl: false },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', rtl: false },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', rtl: false },
];

// 获取当前支持的语言（根据开发阶段）
export const getCurrentlySupportedLanguages = () => {
  return PHASE_ONE_LANGUAGES;
};

// 获取语言代码列表
export const getSupportedLanguageCodes = () => {
  const languages = getCurrentlySupportedLanguages();
  return languages.map(lang => lang.code);
};

// 根据代码获取语言信息
export const getLanguageByCode = (code: string) => {
  const language = PHASE_ONE_LANGUAGES.find(lang => lang.code === code);
  // 如果找不到匹配的语言，默认返回英语
  return language || PHASE_ONE_LANGUAGES[0];
}; 