var drawSpeedStripes = (function (Width, Transition, calcScreenConst) {
    "use strict";

    var SPEED = 'speed';

    function showSpeedStripes(stage, delay) {
        var speedStripes = [];
        speedStripes.push(drawSpeed(stage, Width.QUARTER, delay));
        speedStripes.push(drawSpeed(stage, Width.TWO_THIRD, delay + 34));
        speedStripes.push(drawSpeed(stage, Width.get(8, 7), delay + 8));
        speedStripes.push(drawSpeed(stage, Width.get(16, 7), delay + 24));
        speedStripes.push(drawSpeed(stage, Width.get(16), delay + 16));

        return speedStripes;
    }

    function drawSpeed(stage, xFn, delay) {
        function topOffSet(stage) {
            return calcScreenConst(stage.getImageWidth(SPEED), 2);
        }

        function yStart() {
            return -topOffSet(stage);
        }

        function yEnd(height) {
            return height + topOffSet(stage);
        }

        return stage.moveFreshLater(xFn, yStart, SPEED, xFn, yEnd, 30, Transition.LINEAR, delay, true, undefined,
            undefined, undefined, 1);
    }

    return showSpeedStripes;

})(Width, Transition, calcScreenConst);
