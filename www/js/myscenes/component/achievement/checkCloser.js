var checkCloser = (function (localStorage, loadBoolean, loadInteger) {
    "use strict";

    var GAME_KEY = 'shields_up-';
    var CLOSER = GAME_KEY + 'achievement_closer';
    var TOTAL_MISSIONS = 40;
    var MISSION_COMPLETE = GAME_KEY + 'mission_complete';
    var TXT_CLOSER = 'closer';

    function checkCloser(gameState) {
        if (loadBoolean(CLOSER))
            return;

        if (loadInteger(MISSION_COMPLETE) >= TOTAL_MISSIONS) {
            localStorage.setItem(CLOSER, 'true');
            gameState.completedAchievements.push(TXT_CLOSER);
        }
    }

    return checkCloser;
})(lclStorage, loadBoolean, loadInteger);