var drawSharedGameStuff = (function (Fire, drawShip, drawBackGround, drawSpeedStripes, drawShields) {
    "use strict";

    function drawSharedGameStuff(stage, sceneStorage) {
        if (!sceneStorage.speedStripes) {
            sceneStorage.speedStripes = drawSpeedStripes(stage, 0);
        }
        if (!sceneStorage.ship) {
            sceneStorage.ship = drawShip(stage);
        }
        if (!sceneStorage.fire) {
            sceneStorage.fire = Fire.draw(stage, sceneStorage.ship);
        }
        if (!sceneStorage.backGround) {
            sceneStorage.backGround = drawBackGround(stage);
        }
        if (!sceneStorage.shields) {
            sceneStorage.shields = drawShields(stage, sceneStorage.ship);
        }
    }

    return drawSharedGameStuff;
})(Fire, drawShip, drawBackGround, drawSpeedStripes, drawShields);