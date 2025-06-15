// 在浏览器控制台中运行此脚本以测试语言切换功能

// 获取当前语言
function getCurrentLanguage() {
  return i18n.language;
}

// 切换到指定语言
function switchLanguage(lang) {
  console.log(`正在切换语言到: ${lang}`);
  i18n.changeLanguage(lang);
  // 更新URL路径
  const currentPath = window.location.pathname;
  const pathParts = currentPath.split('/');
  if (pathParts.length > 1) {
    // 替换路径中的语言代码
    pathParts[1] = lang;
    const newPath = pathParts.join('/');
    window.history.pushState({}, '', newPath);
  }
  return `语言已切换到: ${lang}`;
}

// 检查翻译加载状态
function checkTranslations(namespace) {
  const currentLang = getCurrentLanguage();
  console.log(`当前语言: ${currentLang}`);
  
  // 获取翻译数据
  const translations = i18n.getDataByLanguage(currentLang);
  if (!translations) {
    return `未找到 ${currentLang} 的翻译数据`;
  }
  
  // 检查指定命名空间
  if (namespace && translations[namespace]) {
    console.log(`${namespace} 命名空间翻译:`, translations[namespace]);
    return `已加载 ${Object.keys(translations[namespace]).length} 个翻译键`;
  }
  
  // 显示所有已加载的命名空间
  const loadedNamespaces = Object.keys(translations);
  console.log(`已加载的命名空间:`, loadedNamespaces);
  
  // 统计每个命名空间的翻译键数量
  const stats = loadedNamespaces.map(ns => {
    const count = Object.keys(translations[ns]).length;
    return `${ns}: ${count}个键`;
  });
  
  return `已加载 ${loadedNamespaces.length} 个命名空间:\n${stats.join('\n')}`;
}

// 重新加载页面的翻译
function reloadTranslations() {
  console.log('正在重新加载翻译...');
  // 强制重新加载当前页面的翻译
  const currentLang = getCurrentLanguage();
  i18n.reloadResources(currentLang);
  return '翻译已重新加载';
}

// 导出测试函数
window.languageTest = {
  getCurrentLanguage,
  switchLanguage,
  checkTranslations,
  reloadTranslations
};

console.log(`
语言测试工具已加载。使用方法:
- languageTest.getCurrentLanguage() - 获取当前语言
- languageTest.switchLanguage('zh-CN') - 切换到指定语言
- languageTest.checkTranslations('faq') - 检查指定命名空间的翻译
- languageTest.reloadTranslations() - 重新加载翻译
`);

// 自动运行检查
checkTranslations('faq'); 