import React, { useState, useEffect, useRef } from 'react';
import { Play, ExternalLink, X } from 'lucide-react';

// Simplified screenshot type definition, removed title and description
interface Screenshot {
  id: number;
  imagePath: string;
}

const Hero = () => {
  // Image scrolling state
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isMouseOver, setIsMouseOver] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedImagePath, setSelectedImagePath] = useState("");
  
  // Dynamically generate screenshot data
  // Use import.meta.glob to get all screenshots
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);

  // Load images when component mounts
  useEffect(() => {
    // Dynamically generate screenshot array based on images in public directory
    const loadScreenshots = async () => {
      try {
        // Assume screenshots are stored in public/images/screenshots directory
        // Get images 1-8
        const screenshotArray: Screenshot[] = [];
        
        for (let i = 1; i <= 8; i++) {
          const imagePath = `/images/screenshots/screenshot${i}.jpg`;
          
          // Check if image exists
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
  
  // Functions for handling mouse/touch events
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
    const walk = (x - startX) * 2; // Scroll speed coefficient
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };
  
  // Open modal
  const openModal = (imagePath: string) => {
    setSelectedImagePath(imagePath);
    setShowModal(true);
  };
  
  // Improved auto-scroll effect
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || screenshots.length === 0) return;
    
    let animationFrameId: number;
    let scrollPosition = container.scrollLeft;
    let lastTimestamp: number | null = null;
    
    const scrollSpeed = isMouseOver || isDragging ? 0 : 0.5; // Pause scrolling when mouse is over or dragging
    
    const scrollAnimation = (timestamp: number) => {
      if (lastTimestamp === null) {
        lastTimestamp = timestamp;
      }
      
      const deltaTime = timestamp - lastTimestamp;
      lastTimestamp = timestamp;
      
      // Calculate new scroll position
      scrollPosition += scrollSpeed * deltaTime / 16; // Normalize speed based on 60fps
      
      // Check if we need to loop
      if (scrollPosition >= container.scrollWidth / 2) {
        // Reset to middle position for seamless looping
        scrollPosition = 0;
      }
      
      // Apply new scroll position
      container.scrollLeft = scrollPosition;
      
      // Continue animation loop
      animationFrameId = requestAnimationFrame(scrollAnimation);
    };
    
    // Start animation
    animationFrameId = requestAnimationFrame(scrollAnimation);
    
    // Cleanup function
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [screenshots, isMouseOver, isDragging]);

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

        {/* Improved film strip style horizontal scrolling screenshots */}
        {screenshots.length > 0 && (
          <div className="relative mb-8 w-full overflow-hidden bg-black/60 backdrop-blur-md p-2 rounded-xl border border-blue-500/30">
            {/* Scroll container */}
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
              {/* Film effect decoration - left side */}
              <div className="flex-shrink-0 h-20 w-16 bg-gray-900 mr-2 rounded-sm border-y-8 border-gray-800 flex items-center justify-center">
                <div className="w-2 h-10 bg-gray-700 rounded-full"></div>
              </div>
              
              {/* Screenshot items - first display */}
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
              
              {/* Copy images for infinite scrolling */}
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
              
              {/* Film effect decoration - right side */}
              <div className="flex-shrink-0 h-20 w-16 bg-gray-900 ml-2 rounded-sm border-y-8 border-gray-800 flex items-center justify-center">
                <div className="w-2 h-10 bg-gray-700 rounded-full"></div>
              </div>
            </div>
          </div>
        )}

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

      {/* Full-size image viewing modal */}
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