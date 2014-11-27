var EnergyBar = (function (calcScreenConst, getBottomRaster) {
    "use strict";

    return {
        getX: function (width) {
            return calcScreenConst(width, 32, 7);
        },
        getY: getBottomRaster
    };
})(calcScreenConst, getBottomRaster);
