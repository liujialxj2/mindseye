import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 定义语言和命名空间
const LOCALES_DIR = path.join(path.dirname(__dirname), 'public/locales');
const BASE_LANGUAGE = 'en'; // 基准语言

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

// 创建模板文件
function createTemplateFile(namespace) {
  const baseTranslation = getTranslationFile(BASE_LANGUAGE, namespace);
  if (!baseTranslation) {
    console.error(`基准语言 ${BASE_LANGUAGE} 缺少 ${namespace}.json 文件`);
    return false;
  }

  // 递归替换所有值为空字符串，保留键结构
  function createTemplate(obj) {
    const template = {};
    for (const key in obj) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        template[key] = createTemplate(obj[key]);
      } else {
        template[key] = ''; // 将值替换为空字符串
      }
    }
    return template;
  }

  const template = createTemplate(baseTranslation);
  const templateDir = path.join(path.dirname(__dirname), 'translation-templates');
  
  // 确保目录存在
  if (!fs.existsSync(templateDir)) {
    fs.mkdirSync(templateDir, { recursive: true });
  }

  // 写入模板文件
  const templatePath = path.join(templateDir, `${namespace}.template.json`);
  fs.writeFileSync(templatePath, JSON.stringify(template, null, 2), 'utf8');
  console.log(`✅ 已创建模板文件: ${templatePath}`);
  
  return true;
}

// 创建所有命名空间的模板
function createAllTemplates() {
  const namespaces = getNamespaces(BASE_LANGUAGE);
  console.log(`命名空间: ${namespaces.join(', ')}\n`);
  
  let success = true;
  for (const namespace of namespaces) {
    console.log(`创建模板: ${namespace}`);
    if (!createTemplateFile(namespace)) {
      success = false;
    }
  }
  
  return success;
}

// 执行创建模板
const success = createAllTemplates();

if (success) {
  console.log('\n✅ 所有翻译模板创建成功！');
  process.exit(0);
} else {
  console.error('\n❌ 部分翻译模板创建失败，请检查错误信息！');
  process.exit(1);
} 