var checkConqueror = (function (localStorage, loadBoolean) {
    "use strict";

    var ACHIEVEMENT_CONQUEROR = 'shields_up-achievement_conqueror';
    var TXT_CONQUEROR = 'conqueror';
    var TOTAL_WAVES = 28;

    function checkConqueror(gameState) {
        if (loadBoolean(ACHIEVEMENT_CONQUEROR))
            return;

        if (gameState.completedWaves >= TOTAL_WAVES) {
            localStorage.setItem(ACHIEVEMENT_CONQUEROR, 'true');
            gameState.completedAchievements.push(TXT_CONQUEROR);
        }
    }

    return checkConqueror;
})(lclStorage, loadBoolean);