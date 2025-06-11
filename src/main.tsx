import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initGameSecurity } from './utils/gameSecurityConfig.ts'

// 初始化游戏安全配置
initGameSecurity();

// 避免第三方cookie警告
if (window.top !== window.self) {
  console.log('正在iframe中运行，已启用兼容模式');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
