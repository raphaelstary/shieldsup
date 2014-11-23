var drawBackGround = (function (widthHalf, heightHalf, widthThird, heightQuarter, widthQuarter, heightTwoThird,
    widthThreeQuarter, heightThird, widthTwoThird, heightThreeQuarter) {
    "use strict";

    var BACKGROUND_STAR = 'background_star';

    function drawBackGround(stage) {
        return [
            stage.drawFresh(widthHalf, heightHalf, BACKGROUND_STAR, 0, undefined, 1, 0, 0.5),
            stage.drawFresh(widthThird, heightQuarter, BACKGROUND_STAR, 0, undefined, 0.75, 0, 0.75),
            stage.drawFresh(widthQuarter, heightTwoThird, BACKGROUND_STAR, 0, undefined, 0.5, 0, 1),
            stage.drawFresh(widthThreeQuarter, heightThird, BACKGROUND_STAR, 0, undefined, 1, 0, 0.5),
            stage.drawFresh(widthTwoThird, heightHalf, BACKGROUND_STAR, 0, undefined, 0.5, 0, 0.75),
            stage.drawFresh(widthHalf, heightQuarter, BACKGROUND_STAR, 0, undefined, 0.75, 0, 1),
            stage.drawFresh(widthTwoThird, heightThreeQuarter, BACKGROUND_STAR, 0, undefined, 1, 0, 0.5)
        ];
    }

    return drawBackGround;
})(widthHalf, heightHalf, widthThird, heightQuarter, widthQuarter, heightTwoThird, widthThreeQuarter, heightThird,
    widthTwoThird, heightThreeQuarter);
