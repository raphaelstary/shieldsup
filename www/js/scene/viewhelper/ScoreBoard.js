var ScoreBoard = (function (calcScreenConst, Height, Font) {
    "use strict";

    var SPECIAL_FONT = 'SpecialGameFont';
    var WHITE = '#fff';

    function getDigitOffSet(digitDrawable) {
        return calcScreenConst(digitDrawable.getWidth(), 8, 9);
    }

    function getFirstX(width) {
        return calcScreenConst(width, 10, 9);
    }

    function getSecondX(drawable, width) {
        return getFirstX(width) - getDigitOffSet(drawable);
    }

    function getThirdX(drawable, width) {
        return getFirstX(width) - getDigitOffSet(drawable) * 2;
    }

    function getFourthX(drawable, width) {
        return getFirstX(width) - getDigitOffSet(drawable) * 3;
    }

    return {
        getFirstX: getFirstX,
        getSecondX: getSecondX,
        getThirdX: getThirdX,
        getFourthX: getFourthX,
        getY: Height.TOP_RASTER,
        getSize: Font._20,
        font: SPECIAL_FONT,
        color: WHITE
    };
})(calcScreenConst, Height, Font);
