/**
 * GameDistribution Domain Bridge
 * This script helps bypass domain verification issues
 */

(function() {
  // Wait for the GD SDK to load
  const checkInterval = setInterval(function() {
    if (typeof window.gdsdk !== 'undefined' && window.gdsdk) {
      clearInterval(checkInterval);
      injectDomainBridge();
    }
  }, 500);
  
  function injectDomainBridge() {
    console.log("Injecting GameDistribution domain bridge...");
    
    try {
      // Override domain check function if it exists
      if (window.gdsdk._publisherDomainAllowed) {
        const originalDomainCheck = window.gdsdk._publisherDomainAllowed;
        window.gdsdk._publisherDomainAllowed = function() {
          console.log("Domain check bypassed for development");
          return true;
        };
      }
      
      // Try to forcefully enable the SDK
      if (window.gdsdk._onEvent) {
        // Simulate successful domain verification
        window.gdsdk._onEvent({
          name: "SDK_PUBLISHER_DOMAIN_ALLOWED",
          message: "Domain bridge forcing domain allowance"
        });
      }
      
      // Override the blocked message
      const blockedElements = document.querySelectorAll('div[class*="blocked-sdk"]');
      if (blockedElements.length) {
        blockedElements.forEach(el => {
          el.style.display = 'none';
        });
      }
      
      // Add CSS to hide GameDistribution blocked overlays
      const style = document.createElement('style');
      style.textContent = `
        div[class*="blocked-sdk"], 
        div[id*="blocked-sdk"],
        div[class*="blocked_sdk"],
        div[id*="blocked_sdk"] {
          display: none !important;
        }
      `;
      document.head.appendChild(style);
      
      console.log("GameDistribution domain bridge activated");
    } catch (e) {
      console.error("Error in GD domain bridge:", e);
    }
  }
  
  // Also handle iframes when they load
  window.addEventListener('message', function(event) {
    // Check if the message is from a GameDistribution iframe
    if (event.origin.includes('gamedistribution.com')) {
      try {
        // If we receive a domain blocked message
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (data && data.type === 'domain_blocked') {
          console.log("Received domain blocked message, attempting to bridge...");
          
          // Send a message back to the iframe to bypass domain check
          const iframe = document.getElementById('game-iframe');
          if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage(JSON.stringify({
              action: 'gdbridge_bypass_domain_check',
              source: 'parent'
            }), '*');
          }
        }
      } catch (e) {
        // Ignore parsing errors
      }
    }
  });
  
  console.log("GameDistribution domain bridge initialized");
})(); 