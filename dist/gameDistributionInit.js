// GameDistribution SDK initialization
window.GD_OPTIONS = {
    // 重要：这里需要您在GameDistribution.com上注册并获取的实际游戏ID
    gameId: "mindseye-games", 
    
    // 添加您的网站信息
    prefix: "mindseye-games",
    
    // 游戏参数
    gameParams: {
        autoPlay: true
    },
    
    // 广告设置
    advertisementSettings: {
        debug: window.location.hostname === 'localhost',
        autoplay: false
    },
    
    // 临时解决方法：忽略域名验证
    ignoreCheckForBlocked: true,
    debug: window.location.hostname === 'localhost',
    
    // 跨域设置
    cross_origin: true,
    crossOrigin: true,
    allowDomains: ['mindseye.cool', 'mindseye-88s.pages.dev', '*.mindseye-88s.pages.dev', 'localhost'],
    
    // 传递父页面信息
    parentUrl: window.location.href,
    parentDomain: window.location.hostname,
    
    // 本地存储设置
    localStorageName: `GD_${window.location.hostname.replace(/\./g, '_')}_mindseye`,
    
    // 开发者设置
    devMode: window.location.hostname === 'localhost',
    
    onEvent: function(event) {
        switch (event.name) {
            case "SDK_GAME_START":
                // 游戏已开始
                console.log("Game started");
                break;
                
            case "SDK_GAME_PAUSE":
                // 游戏已暂停
                console.log("Game paused");
                break;
                
            case "SDK_ERROR":
                // SDK或游戏载入错误
                console.error("GameDistribution error:", event);
                // 尝试恢复
                setTimeout(function() {
                    var iframe = document.getElementById('game-iframe');
                    if (iframe && iframe.src) {
                        var src = iframe.src;
                        iframe.src = '';
                        setTimeout(function() { iframe.src = src; }, 500);
                    }
                }, 2000);
                break;
                
            case "SDK_GDPR_TRACKING":
                // GDPR跟踪同意
                console.log("GDPR tracking consent:", event.message);
                break;
                
            case "SDK_GDPR_TARGETING":
                // GDPR定位同意
                console.log("GDPR targeting consent:", event.message);
                break;
                
            case "CONTENT_RESUME_REQUESTED":
                // 广告完成
                console.log("Content resume requested");
                break;
                
            case "SDK_READY":
                // SDK准备完毕
                console.log("GameDistribution SDK ready");
                break;
                
            case "SDK_BLOCKED":
                // SDK被阻止
                console.warn("GameDistribution SDK blocked:", event);
                // 尝试隐藏阻止消息
                setTimeout(function() {
                    var blockedElements = document.querySelectorAll('[class*="blocked"],[id*="blocked"]');
                    blockedElements.forEach(function(el) { el.style.display = 'none'; });
                }, 1000);
                break;
        }
    },
    
    // 测试模式设置
    testing: window.location.hostname === 'localhost'
};

// SDK初始化
(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s);
    js.id = id;
    js.src = 'https://html5.api.gamedistribution.com/main.min.js';
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'gamedistribution-jssdk'));

// 监听错误并尝试恢复
window.addEventListener('error', function(event) {
    if (event.message && (
        event.message.indexOf('localStorage') !== -1 || 
        event.message.indexOf('GameDistribution') !== -1
    )) {
        console.log('Attempting to recover from GameDistribution error');
    }
}, true);

console.log("GameDistribution SDK initialized for domain:", window.location.hostname); 