var drawShip = (function (widthHalf, __400) {
    "use strict";

    var SHIP = 'ship';

    function drawShip(stage) {
        return stage.drawFresh(widthHalf, __400, SHIP);
    }

    return drawShip;
})(widthHalf, __400);
