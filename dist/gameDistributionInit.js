// GameDistribution SDK initialization
window.GD_OPTIONS = {
    gameId: "mindseye-games",  // Replace with your actual GameDistribution Game ID
    onEvent: function(event) {
        switch (event.name) {
            case "SDK_GAME_START":
                // Game has started
                console.log("Game started");
                break;
            case "SDK_GAME_PAUSE":
                // Game is paused
                console.log("Game paused");
                break;
            case "SDK_GDPR_TRACKING":
                // GDPR tracking consent
                console.log("GDPR tracking consent:", event.message);
                break;
            case "SDK_GDPR_TARGETING":
                // GDPR targeting consent
                console.log("GDPR targeting consent:", event.message);
                break;
            case "CONTENT_RESUME_REQUESTED":
                // Advertisement has finished
                console.log("Content resume requested");
                break;
        }
    },
    // For testing purpose only
    testing: window.location.hostname === 'localhost'
};

// Initialize the SDK
(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s);
    js.id = id;
    js.src = 'https://html5.api.gamedistribution.com/main.min.js';
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'gamedistribution-jssdk'));

console.log("GameDistribution SDK initialized with domain:", window.location.hostname); 