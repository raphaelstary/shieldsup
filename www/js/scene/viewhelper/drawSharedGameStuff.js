var drawSharedGameStuff = (function (Fire, drawShip, drawBackGround, drawSpeedStripes) {
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
    }

    return drawSharedGameStuff;
})(Fire, drawShip, drawBackGround, drawSpeedStripes);
