var drawShip = (function (Width, Height) {
    "use strict";

    var SHIP = 'ship';

    function drawShip(stage) {
        return stage.drawFresh(Width.HALF, Height._400, SHIP, 4);
    }

    return drawShip;
})(Width, Height);
