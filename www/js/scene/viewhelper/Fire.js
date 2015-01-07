var Fire = (function (calcScreenConst) {
    "use strict";

    var FIRE = 'fire/fire';

    function getLeftFireX(shipDrawable) {
        return shipDrawable.x - calcScreenConst(shipDrawable.getWidth(), 5);
    }

    function getRightFireX(shipDrawable) {
        return shipDrawable.x + calcScreenConst(shipDrawable.getWidth(), 5);
    }

    function getFireY(shipDrawable) {
        return shipDrawable.y + getOffSet(shipDrawable);
    }

    function getOffSet(shipDrawable) {
        return calcScreenConst(shipDrawable.getHeight(), 8, 5);
    }

    function drawFire(stage, shipDrawable) {
        return {
            left: stage.animateFresh(getLeftFireX.bind(undefined, shipDrawable), getFireY.bind(undefined, shipDrawable),
                FIRE, 10, true, [shipDrawable]).drawable,
            right: stage.animateFresh(getRightFireX.bind(undefined, shipDrawable),
                getFireY.bind(undefined, shipDrawable), FIRE, 10, true, [shipDrawable]).drawable
        };
    }

    return {
        draw: drawFire,
        getLeftX: getLeftFireX,
        getRightX: getRightFireX,
        getY: getFireY,
        getShipOffSet: getOffSet
    };
})(calcScreenConst);
