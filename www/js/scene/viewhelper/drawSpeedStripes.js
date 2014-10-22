var drawSpeedStripes = (function (calcScreenConst, Transition) {
    "use strict";

    function topOffSet(stage) {
        return calcScreenConst(stage.getGraphic('speed').width, 2);
    }

    function get1stX(screenWidth) {
        return calcScreenConst(screenWidth, 4);
    }

    function get2ndX(screenWidth) {
        return calcScreenConst(screenWidth, 3, 2);
    }

    function get3rdX(screenWidth) {
        return calcScreenConst(screenWidth, 8, 7);
    }

    function get4thX(screenWidth) {
        return calcScreenConst(screenWidth, 16, 7);
    }

    function get5thX(screenWidth) {
        return calcScreenConst(screenWidth, 16);
    }

    function _1stDelay(delay) {
        return 0 + delay;
    }

    function _2ndDelay(delay) {
        return 34 + delay;
    }

    function _3rdDelay(delay) {
        return 8 + delay;
    }

    function _4thDelay(delay) {
        return 24 + delay;
    }

    function _5thDelay(delay) {
        return 16 + delay;
    }

    function showSpeedStripes(stage, delay) {
        var speedStripes = [];
        var yOffSet = topOffSet(stage);
        speedStripes.push(drawSpeed(stage, get1stX, yOffSet, _1stDelay(delay)));
        speedStripes.push(drawSpeed(stage, get2ndX, yOffSet, _2ndDelay(delay)));
        speedStripes.push(drawSpeed(stage, get3rdX, yOffSet, _3rdDelay(delay)));
        speedStripes.push(drawSpeed(stage, get4thX, yOffSet, _4thDelay(delay)));
        speedStripes.push(drawSpeed(stage, get5thX, yOffSet, _5thDelay(delay)));

        return speedStripes;
    }

    function drawSpeed(stage, xFn, yOffSet, delay) {
        function yStart() {
            return -yOffSet;
        }

        function yEnd(height) {
            return height + yOffSet;
        }

        return stage.moveFreshLater(xFn, yStart, 'speed', xFn, yEnd, 30, Transition.LINEAR, delay, true);
    }

    return showSpeedStripes;

})(calcScreenConst, Transition);
