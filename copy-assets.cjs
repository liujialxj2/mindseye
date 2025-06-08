const fs = require('fs-extra');
const path = require('path');

// 要复制的目录和文件
const SOURCE_IMAGES = path.resolve(__dirname, 'public/images');
const TARGET_IMAGES = path.resolve(__dirname, 'dist/images');

// 复制图片资源
console.log('📷 正在复制图片资源...');
fs.ensureDirSync(TARGET_IMAGES);
fs.copySync(SOURCE_IMAGES, TARGET_IMAGES, {
  overwrite: true,
  errorOnExist: false,
});
console.log('✅ 图片资源复制完成！');

// 复制_headers文件（如果存在）
const headersSource = path.resolve(__dirname, '_headers');
const headersTarget = path.resolve(__dirname, 'dist/_headers');
if (fs.existsSync(headersSource)) {
  console.log('📝 正在复制_headers文件...');
  fs.copySync(headersSource, headersTarget, { overwrite: true });
  console.log('✅ _headers文件复制完成！');
}

// 复制_redirects文件（如果存在）
const redirectsSource = path.resolve(__dirname, '_redirects');
const redirectsTarget = path.resolve(__dirname, 'dist/_redirects');
if (fs.existsSync(redirectsSource)) {
  console.log('🔄 正在复制_redirects文件...');
  fs.copySync(redirectsSource, redirectsTarget, { overwrite: true });
  console.log('✅ _redirects文件复制完成！');
}

// 显示被复制的文件
console.log('\n已复制的资源:');
function listCopiedFiles(directory, base = '') {
  const files = fs.readdirSync(directory);
  
  files.forEach(file => {
    const fullPath = path.join(directory, file);
    const relativePath = path.join(base, file);
    
    if (fs.statSync(fullPath).isDirectory()) {
      listCopiedFiles(fullPath, relativePath);
    } else {
      console.log(`- ${relativePath}`);
    }
  });
}

listCopiedFiles(TARGET_IMAGES, 'images');

// 检查特殊文件
if (fs.existsSync(headersTarget)) {
  console.log('- _headers');
}
if (fs.existsSync(redirectsTarget)) {
  console.log('- _redirects');
} 