var checkAchievements = (function (checkConqueror, checkShoppingQueen, checkCloser, checkLiveOnce, checkStarGazer,
    checkFasterThanLight) {
    "use strict";

    function checkAchievements(gameStats) {
        var gameState = {
            collectedStars: gameStats.collectedStars,
            availableStars: gameStats.spawnedStars,
            completedWaves: gameStats.completedWaves,
            livesLost: gameStats.livesLost,
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