import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { globSync } from 'glob';

// 获取当前文件的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 定义要检查的文件类型和目录
const SRC_DIR = path.join(path.dirname(__dirname), 'src');
const FILE_PATTERNS = [
  '**/*.tsx',
  '**/*.jsx',
  '**/*.ts',
  '**/*.js'
];

// 排除的目录
const EXCLUDED_DIRS = [
  'node_modules',
  'dist',
  'build',
  '.next'
];

// 排除的文件
const EXCLUDED_FILES = [
  'i18n.ts',
  'i18n.js',
  'languageConfig.ts',
  'languageConfig.js'
];

// 可能包含硬编码文本的正则表达式
const TEXT_PATTERNS = [
  // JSX文本内容
  /<[A-Za-z][A-Za-z0-9]*[^>]*>[^<>]*[\u4e00-\u9fa5a-zA-Z]{3,}[^<>]*<\/[A-Za-z][A-Za-z0-9]*>/g,
  // 属性值中的文本
  /\s(title|label|placeholder|alt|aria-label)=["']([^"'<>]*[\u4e00-\u9fa5a-zA-Z]{3,}[^"'<>]*)["']/g,
  // 字符串变量赋值
  /\s*=\s*["']([^"'<>]*[\u4e00-\u9fa5a-zA-Z]{3,}[^"'<>]*)["']/g
];

// 不需要检查的文本模式
const IGNORED_PATTERNS = [
  // 已经使用了翻译函数的行
  /\bt\s*\(\s*["'][^"']+["']/,
  /useTranslation\s*\(/,
  /<Trans\b/,
  /<TranslatedText\b/,
  // 导入语句
  /\bimport\s+/,
  // 注释
  /^\s*\/\//,
  /^\s*\/\*/,
  /\*\//,
  // 正则表达式
  /new RegExp\(/,
  /\/[^\/]+\/[gimsuy]*/
];

// 获取要检查的文件
function getFilesToCheck() {
  let files = [];
  FILE_PATTERNS.forEach(pattern => {
    const matches = globSync(pattern, {
      cwd: SRC_DIR,
      ignore: EXCLUDED_DIRS.map(dir => `**/${dir}/**`)
    });
    files = [...files, ...matches.map(file => path.join(SRC_DIR, file))];
  });
  
  // 排除特定文件
  files = files.filter(file => {
    const basename = path.basename(file);
    return !EXCLUDED_FILES.includes(basename);
  });
  
  return files;
}

// 检查文件中的硬编码文本
function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const findings = [];
  
  lines.forEach((line, lineIndex) => {
    // 跳过被忽略的行
    if (IGNORED_PATTERNS.some(pattern => pattern.test(line))) {
      return;
    }
    
    // 检查所有文本模式
    TEXT_PATTERNS.forEach(pattern => {
      const matches = line.matchAll(pattern);
      for (const match of matches) {
        // 提取匹配的文本
        let text = match[0];
        if (match.length > 1 && match[2]) {
          text = match[2]; // 对于属性值，使用捕获组2
        } else if (match.length > 1 && match[1]) {
          text = match[1]; // 对于字符串赋值，使用捕获组1
        }
        
        // 过滤掉太短或者看起来不像硬编码文本的内容
        if (text.length < 3 || /^[0-9\s\.\,\:\;\-\_\+\=\!\@\#\$\%\^\&\*\(\)]+$/.test(text)) {
          continue;
        }
        
        findings.push({
          file: path.relative(path.dirname(__dirname), filePath),
          line: lineIndex + 1,
          text: line.trim(),
          suspectedText: text
        });
      }
    });
  });
  
  return findings;
}

// 主函数
function main() {
  console.log('检查硬编码文本...');
  const files = getFilesToCheck();
  console.log(`找到 ${files.length} 个文件需要检查`);
  
  let allFindings = [];
  files.forEach(file => {
    const findings = checkFile(file);
    if (findings.length > 0) {
      allFindings = [...allFindings, ...findings];
    }
  });
  
  if (allFindings.length === 0) {
    console.log('✅ 没有找到硬编码文本');
    return;
  }
  
  console.log(`❌ 找到 ${allFindings.length} 处可能的硬编码文本:`);
  allFindings.forEach(finding => {
    console.log(`\n文件: ${finding.file}:${finding.line}`);
    console.log(`可疑文本: ${finding.suspectedText}`);
    console.log(`上下文: ${finding.text}`);
  });
  
  console.log('\n建议：');
  console.log('1. 使用 TranslatedText 组件替换硬编码文本');
  console.log('2. 对于属性值，使用 useTranslatedText 钩子');
  console.log('3. 将所有文本添加到适当的翻译文件中');
}

main();