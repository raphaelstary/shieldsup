var checkLiveOnce = (function (loadBoolean, lclStorage) {
    "use strict";

    var LIVE_ONCE = 'shields_up-achievement_live_once';
    var TXT_LIVE_ONCE = 'live_once';
    var TOTAL_WAVES = 10;

    function checkLiveOnce(gameState) {
        if (loadBoolean(LIVE_ONCE))
            return;

        if (gameState.livesLost < 1 && gameState.completedWaves >= TOTAL_WAVES) {
            localStorage.setItem(LIVE_ONCE, 'true');
            gameState.completedAchievements.push(TXT_LIVE_ONCE);
        }
    }

    return checkLiveOnce;
})(loadBoolean, lclStorage);