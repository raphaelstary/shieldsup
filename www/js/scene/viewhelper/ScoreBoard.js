var ScoreBoard = (function (calcScreenConst, getTopRaster, fontSize_20) {
    "use strict";

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
        getY: getTopRaster,
        getSize: fontSize_20,
        font: 'SpecialGameFont',
        color: '#fff'
    };
})(calcScreenConst, getTopRaster, fontSize_20);
