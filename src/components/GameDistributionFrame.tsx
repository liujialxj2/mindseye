import React, { useEffect, useRef, useState } from 'react';

interface GameDistributionFrameProps {
  gameId: string;
  gameUrl: string;
  title: string;
  width?: string;
  height?: string;
  onGameLoaded?: () => void;
  onGameError?: (error: string) => void;
}

/**
 * GameDistribution game embedding frame component
 * This component handles embedding GameDistribution games, resolving cross-domain and localStorage access issues
 */
const GameDistributionFrame: React.FC<GameDistributionFrameProps> = ({
  gameId,
  gameUrl,
  title,
  width = '100%',
  height = '100%',
  onGameLoaded,
  onGameError
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Build proxy URL
  const buildProxyUrl = (originalUrl: string): string => {
    // Check URL format to ensure it's a valid GameDistribution embed URL
    if (originalUrl.includes('gamedistribution.com')) {
      // Ensure URL uses https protocol
      let secureUrl = originalUrl;
      if (secureUrl.startsWith('http:')) {
        secureUrl = secureUrl.replace('http:', 'https:');
      }

      // Process URL format to ensure it's embed format
      if (!secureUrl.includes('/embed/') && !secureUrl.includes('html5.gamedistribution.com')) {
        // Extract game ID
        const gameIdMatch = secureUrl.match(/\/([^\/]+)\/?$/);
        if (gameIdMatch && gameIdMatch[1]) {
          const extractedId = gameIdMatch[1].split('?')[0]; // Remove query parameters
          secureUrl = `https://html5.gamedistribution.com/${extractedId}/`;
        }
      }
      
      // Add additional parameters
      const domain = window.location.hostname;
      if (!secureUrl.includes('?')) {
        secureUrl += '?';
      } else if (!secureUrl.endsWith('&')) {
        secureUrl += '&';
      }
      
      secureUrl += `domain=${domain}&parentURL=${encodeURIComponent(window.location.href)}&parentDomain=${domain}`;
      
      // Use our proxy page
      return `/game-frame-proxy.html?game=${encodeURIComponent(secureUrl)}`;
    }
    
    // If not a GameDistribution URL, return directly
    return originalUrl;
  };

  // Handle iframe load event
  const handleIframeLoad = () => {
    setIsLoading(false);
    if (onGameLoaded) {
      onGameLoaded();
    }
  };

  // Handle iframe error
  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
    setErrorMessage('Game loading failed');
    if (onGameError) {
      onGameError('Game loading failed');
    }
  };

  // Listen for messages from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Only process messages from our own domain
      if (event.origin === window.location.origin) {
        try {
          const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
          
          if (data?.type === 'gameLoaded') {
            setIsLoading(false);
            if (onGameLoaded) onGameLoaded();
          } else if (data?.type === 'gameError') {
            setHasError(true);
            setErrorMessage(data.message || 'Game loading failed');
            if (onGameError) onGameError(data.message);
          }
        } catch (e) {
          // Ignore messages that can't be parsed
        }
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onGameLoaded, onGameError]);

  // Build final game URL
  const finalGameUrl = buildProxyUrl(gameUrl);

  return (
    <div className="game-frame-container relative w-full h-full bg-black">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-10">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading game...</p>
          </div>
        </div>
      )}
      
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-90 z-20">
          <div className="text-center p-6 max-w-md">
            <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h3 className="text-xl font-bold text-white mb-2">Loading Error</h3>
            <p className="text-gray-300 mb-4">{errorMessage}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Refresh Page
            </button>
          </div>
        </div>
      )}
      
      <iframe
        id={`game-frame-${gameId}`}
        ref={iframeRef}
        src={finalGameUrl}
        title={title}
        width={width}
        height={height}
        className="w-full h-full border-0"
        allow="fullscreen; autoplay; clipboard-write; encrypted-media; gyroscope; accelerometer; picture-in-picture"
        allowFullScreen
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-pointer-lock"
        loading="lazy"
        onLoad={handleIframeLoad}
        onError={handleIframeError}
      />
    </div>
  );
};

export default GameDistributionFrame; 