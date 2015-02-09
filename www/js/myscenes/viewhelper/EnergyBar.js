var EnergyBar = (function (Width, Height) {
    "use strict";

    return {
        getX: Width.get(32, 7),
        getY: Height.BOTTOM_RASTER
    };
})(Width, Height);
