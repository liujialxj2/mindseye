// GameDistribution SDK initialization
window.GD_OPTIONS = {
    // 重要：这里需要您在GameDistribution.com上注册并获取的实际游戏ID
    gameId: "mindseye-games", 
    
    // 添加您的网站信息
    prefix: "mindseye-games",
    advertisementSettings: {
        debug: window.location.hostname === 'localhost'
    },
    
    // 允许所有来源以避免阻止问题
    cross_origin: true,
    
    // 这会告诉GameDistribution允许跨域通信
    parentUrl: window.location.href,
    parentDomain: window.location.hostname,
    
    // 添加更多开发者选项
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

console.log("GameDistribution SDK initialized for domain:", window.location.hostname); 