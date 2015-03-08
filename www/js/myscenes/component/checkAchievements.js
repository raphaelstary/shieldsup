var checkAchievements = (function (checkConqueror, checkShoppingQueen, checkCloser, checkLiveOnce, checkStarGazer,
    checkFasterThanLight) {
    "use strict";

    function checkAchievements(collectedStars, availableStars, completedWaves, livesLost) {
        var gameState = {
            collectedStars: collectedStars,
            availableStars: availableStars,
            completedWaves: completedWaves,
            livesLost: livesLost,
            completedAchievements: []
        };

        [
            checkConqueror, checkShoppingQueen, checkCloser, checkLiveOnce, checkStarGazer, checkFasterThanLight
        ].forEach(function (constraint) {
                constraint(gameState);
            });

        return gameState.completedAchievements;
    }

    return checkAchievements;
})(checkConqueror, checkShoppingQueen, checkCloser, checkLiveOnce, checkStarGazer, checkFasterThanLight);