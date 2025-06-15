import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 定义语言和命名空间
const LOCALES_DIR = path.join(path.dirname(__dirname), 'public/locales');
const LANGUAGES = fs.readdirSync(LOCALES_DIR).filter(
  file => fs.statSync(path.join(LOCALES_DIR, file)).isDirectory()
);
const BASE_LANGUAGE = 'en'; // 基准语言

console.log(`检查翻译文件完整性...\n语言: ${LANGUAGES.join(', ')}`);

// 获取指定语言和命名空间的翻译文件
function getTranslationFile(lang, namespace) {
  try {
    const filePath = path.join(LOCALES_DIR, lang, `${namespace}.json`);
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
    return null;
  } catch (error) {
    console.error(`读取文件错误 ${lang}/${namespace}.json:`, error.message);
    return null;
  }
}

// 获取基准语言的所有命名空间
function getNamespaces(lang) {
  try {
    return fs.readdirSync(path.join(LOCALES_DIR, lang))
      .filter(file => file.endsWith('.json'))
      .map(file => file.replace('.json', ''));
  } catch (error) {
    console.error(`读取命名空间错误 ${lang}:`, error.message);
    return [];
  }
}

// 递归获取所有键
function getAllKeys(obj, prefix = '') {
  let keys = [];
  for (const key in obj) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      keys = [...keys, ...getAllKeys(obj[key], newKey)];
    } else {
      keys.push(newKey);
    }
  }
  return keys;
}

// 检查翻译文件
function checkTranslations() {
  const namespaces = getNamespaces(BASE_LANGUAGE);
  console.log(`命名空间: ${namespaces.join(', ')}\n`);
  
  let hasErrors = false;
  
  // 检查每个命名空间
  for (const namespace of namespaces) {
    console.log(`\n检查命名空间: ${namespace}`);
    
    // 获取基准语言的翻译文件
    const baseTranslation = getTranslationFile(BASE_LANGUAGE, namespace);
    if (!baseTranslation) {
      console.error(`  基准语言 ${BASE_LANGUAGE} 缺少 ${namespace}.json 文件`);
      hasErrors = true;
      continue;
    }
    
    // 获取基准语言的所有键
    const baseKeys = getAllKeys(baseTranslation);
    
    // 检查每种语言
    for (const lang of LANGUAGES) {
      if (lang === BASE_LANGUAGE) continue;
      
      // 获取当前语言的翻译文件
      const translation = getTranslationFile(lang, namespace);
      if (!translation) {
        console.error(`  语言 ${lang} 缺少 ${namespace}.json 文件`);
        hasErrors = true;
        continue;
      }
      
      // 获取当前语言的所有键
      const keys = getAllKeys(translation);
      
      // 检查缺失的键
      const missingKeys = baseKeys.filter(key => !keys.includes(key));
      if (missingKeys.length > 0) {
        console.error(`  语言 ${lang} 在 ${namespace}.json 中缺少以下键:`);
        missingKeys.forEach(key => console.error(`    - ${key}`));
        hasErrors = true;
      }
      
      // 检查多余的键
      const extraKeys = keys.filter(key => !baseKeys.includes(key));
      if (extraKeys.length > 0) {
        console.warn(`  语言 ${lang} 在 ${namespace}.json 中有额外的键:`);
        extraKeys.forEach(key => console.warn(`    - ${key}`));
      }
    }
  }
  
  return !hasErrors;
}

// 执行检查
const success = checkTranslations();

if (success) {
  console.log('\n✅ 所有翻译文件检查通过！');
  process.exit(0);
} else {
  console.error('\n❌ 翻译文件检查失败，请修复上述问题！');
  process.exit(1);
} 