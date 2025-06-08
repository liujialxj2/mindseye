/**
 * GameDistribution域名桥接脚本
 * 这个脚本帮助解决GameDistribution域名检查问题
 */

(function() {
  // 创建iframe的域名验证桥接
  window.addEventListener('DOMContentLoaded', function() {
    // 监听GameDistribution域名检查
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // 检查是否添加了错误消息元素
          mutation.addedNodes.forEach(function(node) {
            if (node.nodeType === 1) { // 元素节点
              // 如果包含blocked或error等关键词
              if ((node.id && (node.id.includes('blocked') || node.id.includes('error'))) || 
                  (node.className && (node.className.includes('blocked') || node.className.includes('error')))) {
                console.log('发现错误消息元素，尝试移除');
                node.style.display = 'none'; // 隐藏元素
                node.style.opacity = '0'; // 设置透明
                node.style.visibility = 'hidden'; // 隐藏可见性
              }
            }
          });
        }
      });
    });
    
    // 配置观察器
    observer.observe(document.body, { childList: true, subtree: true });
    
    // 监听来自iframe的消息
    window.addEventListener('message', function(event) {
      if (event.data && typeof event.data === 'string' && event.data.includes('GameDistribution.com BLOCKED')) {
        console.log('收到被阻止的GameDistribution消息，尝试解决...');
        
        // 查找iframe
        const iframes = document.querySelectorAll('iframe');
        iframes.forEach(function(iframe) {
          if (iframe.src && iframe.src.includes('gamedistribution.com')) {
            // 刷新iframe
            const src = iframe.src;
            iframe.src = '';
            setTimeout(function() {
              iframe.src = src;
            }, 500);
          }
        });
      }
    }, false);
  });
  
  // 覆盖任何window.open操作
  const originalOpen = window.open;
  window.open = function() {
    const args = Array.from(arguments);
    // 检查URL是否包含gamedistribution
    if (args[0] && typeof args[0] === 'string' && args[0].includes('gamedistribution.com')) {
      console.log('拦截GameDistribution弹窗:', args[0]);
      // 可以修改URL或阻止弹窗
      args[0] += (args[0].includes('?') ? '&' : '?') + 'gd_sdk_referrer_url=' + encodeURIComponent(window.location.href);
    }
    return originalOpen.apply(window, args);
  };
  
  console.log('GameDistribution域名桥接已启动');
})(); 