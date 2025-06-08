import React, { useState, useEffect, useRef } from 'react';
import { Play, ExternalLink, X } from 'lucide-react';

// 简化的截图类型定义，移除标题和描述
interface Screenshot {
  id: number;
  imagePath: string;
}

const Hero = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  // 图片滚动状态
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isMouseOver, setIsMouseOver] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedImagePath, setSelectedImagePath] = useState("");
  
  // 动态生成截图数据
  // 使用import.meta.glob获取所有截图
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);

  // 组件挂载时加载图片
  useEffect(() => {
    // 基于public目录中的图片动态生成截图数组
    const loadScreenshots = async () => {
      try {
        // 假设截图存放在public/images/screenshots目录下
        // 获取1-8的图片
        const screenshotArray: Screenshot[] = [];
        
        for (let i = 1; i <= 8; i++) {
          const imagePath = `/images/screenshots/screenshot${i}.jpg`;
          
          // 检查图片是否存在
          const imgExists = await new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = imagePath;
          });
          
          if (imgExists) {
            screenshotArray.push({
              id: i,
              imagePath: imagePath
            });
          }
        }
        
        setScreenshots(screenshotArray);
      } catch (error) {
        console.error("Error loading screenshots:", error);
      }
    };
    
    loadScreenshots();
  }, []);
  
  // 处理鼠标/触摸事件的函数
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // 滚动速度系数
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };
  
  // 打开模态框
  const openModal = (imagePath: string) => {
    setSelectedImagePath(imagePath);
    setShowModal(true);
  };
  
  // 改进的自动滚动效果
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || screenshots.length === 0) return;
    
    let animationFrameId: number;
    let scrollPosition = container.scrollLeft;
    let lastTimestamp: number | null = null;
    
    const scrollSpeed = isMouseOver || isDragging ? 0 : 0.5; // 鼠标悬停或拖动时暂停滚动
    
    const scrollAnimation = (timestamp: number) => {
      if (lastTimestamp === null) {
        lastTimestamp = timestamp;
      }
      
      const deltaTime = timestamp - lastTimestamp;
      lastTimestamp = timestamp;
      
      // 计算新的滚动位置
      scrollPosition += scrollSpeed * deltaTime / 16; // 基于60fps标准化速度
      
      // 检查是否需要循环
      if (scrollPosition >= container.scrollWidth / 2) {
        // 重置到中点位置，实现无缝循环
        scrollPosition = 0;
      }
      
      // 应用新的滚动位置
      container.scrollLeft = scrollPosition;
      
      // 继续动画循环
      animationFrameId = requestAnimationFrame(scrollAnimation);
    };
    
    // 开始动画
    animationFrameId = requestAnimationFrame(scrollAnimation);
    
    // 清理函数
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [screenshots, isMouseOver, isDragging]);

  // 倒计时逻辑
  useEffect(() => {
    // 设置发布日期为2025年6月11日01点00分
    const launchDate = new Date("2025-06-11T01:00:00");

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = launchDate.getTime() - now;

      // 如果倒计时结束，显示全零
      if (distance <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(timer);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section id="home" className="relative min-h-screen pt-24 flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-blue-900">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/2694037/pexels-photo-2694037.jpeg')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40"></div>
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
        <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
          EXPLORE THE WORLD OF
          <br />
          <span className="text-7xl md:text-9xl">MINDSEYE</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
          Journey into the unknown. Test your perception. Challenge your mind.
          <br />
          Where perception meets reality.
        </p>

        {/* 改进的电影胶片式横向滚动截图展示 */}
        {screenshots.length > 0 && (
          <div className="relative mb-8 w-full overflow-hidden bg-black/60 backdrop-blur-md p-2 rounded-xl border border-blue-500/30">
            {/* 滚动容器 */}
            <div 
              ref={scrollContainerRef}
              className="flex overflow-x-scroll no-scrollbar py-2 scrollbar-hide"
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseLeave={() => {
                handleMouseUp();
                setIsMouseOver(false);
              }}
              onMouseEnter={() => setIsMouseOver(true)}
              onMouseMove={handleMouseMove}
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {/* 胶片效果装饰 - 左侧 */}
              <div className="flex-shrink-0 h-20 w-16 bg-gray-900 mr-2 rounded-sm border-y-8 border-gray-800 flex items-center justify-center">
                <div className="w-2 h-10 bg-gray-700 rounded-full"></div>
              </div>
              
              {/* 截图项 - 首次展示 */}
              {screenshots.map((screenshot) => (
                <div 
                  key={`first-${screenshot.id}`} 
                  className="flex-shrink-0 mx-3 cursor-pointer transition-transform duration-300 hover:scale-105"
                  onClick={() => openModal(screenshot.imagePath)}
                >
                  <div className="border-y-4 border-gray-800 pt-1">
                    <div className="relative w-40 h-20 overflow-hidden rounded">
                      <img 
                        src={screenshot.imagePath} 
                        alt={`Game Screenshot ${screenshot.id}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              {/* 复制一份图片实现无限滚动 */}
              {screenshots.map((screenshot) => (
                <div 
                  key={`duplicate-${screenshot.id}`} 
                  className="flex-shrink-0 mx-3 cursor-pointer transition-transform duration-300 hover:scale-105"
                  onClick={() => openModal(screenshot.imagePath)}
                >
                  <div className="border-y-4 border-gray-800 pt-1">
                    <div className="relative w-40 h-20 overflow-hidden rounded">
                      <img 
                        src={screenshot.imagePath} 
                        alt={`Game Screenshot ${screenshot.id}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              {/* 胶片效果装饰 - 右侧 */}
              <div className="flex-shrink-0 h-20 w-16 bg-gray-900 ml-2 rounded-sm border-y-8 border-gray-800 flex items-center justify-center">
                <div className="w-2 h-10 bg-gray-700 rounded-full"></div>
              </div>
            </div>
          </div>
        )}

        {/* Countdown Timer */}
        <div className="bg-black/40 backdrop-blur-md rounded-2xl p-6 mb-8 border border-blue-500/30">
          <h3 className="text-lg text-blue-400 mb-4">OFFICIAL LAUNCH COUNTDOWN</h3>
          <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
            {Object.entries(timeLeft).map(([unit, value]) => (
              <div key={unit} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-3">
                  {value.toString().padStart(2, '0')}
                </div>
                <div className="text-sm text-gray-400 mt-2 uppercase">{unit}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex justify-center items-center">
          <button 
            onClick={() => document.getElementById('games')?.scrollIntoView({ behavior: 'smooth' })}
            className="group flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-lg rounded-xl hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 transform hover:scale-105">
            <Play className="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span>PLAY ONLINE NOW</span>
          </button>
        </div>
      </div>

      {/* 大图查看模态框 */}
      {showModal && selectedImagePath && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
            onClick={() => setShowModal(false)}
          ></div>
          <div className="relative z-10 max-w-6xl w-full p-4">
            <div className="relative">
              <img 
                src={selectedImagePath} 
                alt="Game Screenshot" 
                className="w-full h-auto rounded-lg max-h-[80vh] object-contain"
              />
              <button 
                className="absolute top-4 right-4 bg-black/70 hover:bg-red-600 rounded-full p-2 transition-colors"
                onClick={() => setShowModal(false)}
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Hero;