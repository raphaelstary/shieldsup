var checkFasterThanLight = (function (loadBoolean, localStorage, loadInteger) {
    "use strict";

    var TOTAL_MISSIONS = 40;
    var GAME_KEY = 'shields_up-';
    var MISSION_COMPLETE = GAME_KEY + 'mission_complete_count';
    var FASTER_THAN_LIGHT = GAME_KEY + 'achievement_faster_than_light';
    var TXT_FASTER_THAN_LIGHT = 'faster_than_light';
    var MAX_TIME = 60 * 60 * 1000; // 1h
    var TOTAL_TIME = GAME_KEY + 'total_time';

    function checkFasterThanLight(gameState) {
        if (loadBoolean(FASTER_THAN_LIGHT))
            return;

        if (loadInteger(MISSION_COMPLETE) >= TOTAL_MISSIONS && loadInteger(TOTAL_TIME) <= MAX_TIME) {
            localStorage.setItem(FASTER_THAN_LIGHT, 'true');
            gameState.completedAchievements.push(TXT_FASTER_THAN_LIGHT);
        }
    }

    return checkFasterThanLight;
})(loadBoolean, lclStorage, loadInteger);