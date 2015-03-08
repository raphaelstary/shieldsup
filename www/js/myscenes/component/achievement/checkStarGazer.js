var checkStarGazer = (function (loadBoolean, localStorage) {
    "use strict";

    var TOTAL_WAVES = 10;
    var STAR_GAZER = 'shields_up-achievement_star_gazer';
    var TXT_STAR_GAZER = 'star_gazer';

    function checkStarGazer(gameState) {
        if (loadBoolean(STAR_GAZER))
            return;

        if (gameState.completedWaves >= TOTAL_WAVES && gameState.collectedStars >= gameState.availableStars) {
            localStorage.setItem(STAR_GAZER, 'true');
            gameState.completedAchievements.push(TXT_STAR_GAZER);
        }

    }

    return checkStarGazer;
})(loadBoolean, lclStorage);