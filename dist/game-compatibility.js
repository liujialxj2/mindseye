/**
 * Mindseye Game Platform Compatibility Script
 * Resolves third-party game embedding issues and Content Security Policy restrictions
 */

(function() {
  // Fix Node.className.includes error
  // This addresses the "node.className.includes is not a function" error in gd-domain-bridge.js
  const originalQuerySelectorAll = document.querySelectorAll;
  document.querySelectorAll = function() {
    const elements = originalQuerySelectorAll.apply(this, arguments);
    // Ensure elements is an array or array-like object that can use forEach
    if (elements && elements.forEach) {
      elements.forEach(function(element) {
        // Ensure className is a string
        if (element && element.className && typeof element.className === 'object') {
          // If className is an object (SVGAnimatedString), add includes method
          if (!element.className.includes) {
            element.className.includes = function(str) {
              return element.className.baseVal ? element.className.baseVal.indexOf(str) !== -1 : false;
            };
          }
        }
      });
    }
    return elements;
  };

  // Add localStorage proxy to resolve localStorage restrictions in sandboxed environments
  if (window.top !== window) {
    // If current window is in an iframe
    try {
      // Try accessing localStorage, will fail if sandbox restricts access
      window.localStorage.getItem('test');
    } catch (e) {
      // Create localStorage proxy
      const proxyStorage = {};

      // Use in-memory object to simulate localStorage
      Object.defineProperty(window, 'localStorage', {
        configurable: true,
        get: function() {
          return {
            setItem: function(key, value) {
              proxyStorage[key] = String(value);
              // Try communicating with parent page via postMessage
              try {
                window.parent.postMessage({
                  type: 'localStorage',
                  action: 'setItem',
                  key: key,
                  value: value
                }, '*');
              } catch (e) {
                console.log('Cannot communicate with parent page:', e);
              }
            },
            getItem: function(key) {
              // Try to get from parent first
              try {
                window.parent.postMessage({
                  type: 'localStorage',
                  action: 'getItem',
                  key: key
                }, '*');
              } catch (e) {
                console.log('Cannot request data from parent page:', e);
              }
              // Return from local cache meanwhile
              return proxyStorage[key] === undefined ? null : proxyStorage[key];
            },
            removeItem: function(key) {
              delete proxyStorage[key];
              // Try communicating with parent page
              try {
                window.parent.postMessage({
                  type: 'localStorage',
                  action: 'removeItem',
                  key: key
                }, '*');
              } catch (e) {
                console.log('Cannot communicate with parent page:', e);
              }
            },
            clear: function() {
              Object.keys(proxyStorage).forEach(function(key) {
                delete proxyStorage[key];
              });
              // Try communicating with parent page
              try {
                window.parent.postMessage({
                  type: 'localStorage',
                  action: 'clear'
                }, '*');
              } catch (e) {
                console.log('Cannot communicate with parent page:', e);
              }
            },
            key: function(index) {
              return Object.keys(proxyStorage)[index] || null;
            },
            get length() {
              return Object.keys(proxyStorage).length;
            }
          };
        }
      });
    }
  }

  // Handle browser security restrictions for embedded content
  try {
    if (window.frameElement && window.frameElement.sandbox) {
      console.log('Running in a sandboxed iframe - enabling compatibility mode');
    }
  } catch (e) {
    // If we can't access frameElement, we're probably in a cross-origin frame
    console.log('Cross-origin frame detected - compatibility mode enabled');
  }

  // Listen for messages from parent page
  window.addEventListener('message', function(event) {
    // Process messages from parent
    if (event.data && event.data.type === 'localStorage' && event.data.action === 'returnValue') {
      // Update local proxy storage with value from parent
      if (proxyStorage) {
        proxyStorage[event.data.key] = event.data.value;
      }
    }
    
    if (event.data && event.data.type === 'gameCommand') {
      // Handle game-related commands
      console.log('Received game command:', event.data.command);
    }
  });

  console.log('Mindseye game compatibility script loaded');
})(); 