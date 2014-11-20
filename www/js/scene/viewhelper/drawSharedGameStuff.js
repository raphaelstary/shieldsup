var drawSharedGameStuff = (function (FireHelper, ShipHelper, BackGroundHelper, drawSpeedStripes) {
    "use strict";

    function drawSharedGameStuff(stage, sceneStorage, screenWidth, screenHeight) {
        if (!sceneStorage.speedStripes) {
            sceneStorage.speedStripes = drawSpeedStripes(stage, 0, screenWidth, screenHeight);
        }
        if (!sceneStorage.ship) {
            sceneStorage.ship = ShipHelper.draw(stage, screenWidth, screenHeight);
        }
        if (!sceneStorage.fire) {
            sceneStorage.fire = FireHelper.draw(stage, screenWidth, screenHeight);
        }
        if (!sceneStorage.backGround) {
            sceneStorage.backGround = BackGroundHelper.draw(stage, screenWidth, screenHeight);
        }
    }

    return drawSharedGameStuff;
})(FireHelper, ShipHelper, BackGroundHelper, drawSpeedStripes);
