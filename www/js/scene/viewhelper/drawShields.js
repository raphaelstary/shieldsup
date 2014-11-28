var drawShields = (function () {
    "use strict";

    var SHIELDS = 'shields';
    var SHIELDS_DOWN = 'shields_down/shields_down';
    var SHIELDS_UP = 'shields_up/shields_up';

    function drawShields(stage, ship) {
        var shieldsDownSprite = stage.getSprite(SHIELDS_DOWN, 6, false);
        var shieldsUpSprite = stage.getSprite(SHIELDS_UP, 6, false);

        function getX() {
            return ship.x;
        }

        function getY() {
            return ship.y;
        }

        var shieldsDrawable = stage.drawFresh(getX, getY, SHIELDS, 2, [ship]);
        stage.hide(shieldsDrawable);

        return {
            upSprite: shieldsUpSprite,
            downSprite: shieldsDownSprite,
            drawable: shieldsDrawable
        };
    }

    return drawShields;
})();