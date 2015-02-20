var drawBackGround = (function (Width, Height) {
    "use strict";

    var BACKGROUND_STAR = 'background_star';
    var Z_INDEX = 0;

    function drawBackGround(stage) {
        return [
            stage.drawFresh(Width.HALF, Height.HALF, BACKGROUND_STAR, Z_INDEX, undefined, 1, 0, 0.5),
            stage.drawFresh(Width.THIRD, Height.QUARTER, BACKGROUND_STAR, Z_INDEX, undefined, 0.75, 0, 0.75),
            stage.drawFresh(Width.QUARTER, Height.TWO_THIRD, BACKGROUND_STAR, Z_INDEX, undefined, 0.5, 0, 1),
            stage.drawFresh(Width.THREE_QUARTER, Height.THIRD, BACKGROUND_STAR, Z_INDEX, undefined, 1, 0, 0.5),
            stage.drawFresh(Width.TWO_THIRD, Height.HALF, BACKGROUND_STAR, Z_INDEX, undefined, 0.5, 0, 0.75),
            stage.drawFresh(Width.HALF, Height.QUARTER, BACKGROUND_STAR, Z_INDEX, undefined, 0.75, 0, 1),
            stage.drawFresh(Width.TWO_THIRD, Height.THREE_QUARTER, BACKGROUND_STAR, Z_INDEX, undefined, 1, 0, 0.5)
        ];
    }

    return drawBackGround;
})(Width, Height);