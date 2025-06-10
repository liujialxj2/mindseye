import React from 'react';
import { Link } from 'react-router-dom';

/**
 * 页脚组件
 */
export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 左侧 Logo 和介绍 */}
          <div>
            <Link to="/" className="inline-block">
              <span className="text-2xl font-bold">
                Mindseye<span className="text-blue-500">Games</span>
              </span>
            </Link>
            <p className="mt-4 text-gray-400">
              探索我们精选的HTML5小游戏，享受高品质的在线游戏体验。我们提供来自CrazyGames的精彩游戏内容。
            </p>
          </div>
          
          {/* 中间 链接 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">快速链接</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-blue-400 transition-colors">
                  首页
                </Link>
              </li>
              <li>
                <Link to="/games" className="text-gray-400 hover:text-blue-400 transition-colors">
                  游戏
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-blue-400 transition-colors">
                  关于我们
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-blue-400 transition-colors">
                  联系我们
                </Link>
              </li>
            </ul>
          </div>
          
          {/* 右侧 联系方式 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">联系我们</h3>
            <p className="text-gray-400 mb-2">
              有任何问题或建议？请与我们联系！
            </p>
            <p className="text-gray-400 flex items-center">
              <span className="mr-2">✉️</span>
              <a href="mailto:contact@mindseye.com" className="hover:text-blue-400">
                contact@mindseye.com
              </a>
            </p>
          </div>
        </div>
        
        {/* 底部版权信息 */}
        <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Mindseye Games. 保留所有权利。
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-blue-400">
              隐私政策
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-400">
              使用条款
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-400">
              站点地图
            </a>
          </div>
        </div>
        
        {/* 免责声明 */}
        <div className="mt-8 text-xs text-gray-600 text-center">
          <p>
            本网站上的游戏由CrazyGames提供。Mindseye Games不拥有这些游戏的所有权。所有游戏版权归其各自所有者。
          </p>
        </div>
      </div>
    </footer>
  );
}