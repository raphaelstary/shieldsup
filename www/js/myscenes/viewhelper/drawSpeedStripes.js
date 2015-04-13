var drawSpeedStripes = (function (Width, Transition, calcScreenConst, Math) {
    "use strict";

    var SPEED = 'speed';

    function showSpeedStripes(stage, delay, is30fps) {
        var speedStripes = [];
        speedStripes.push(drawSpeed(stage, Width.QUARTER, delay, is30fps));
        speedStripes.push(drawSpeed(stage, Width.TWO_THIRD, delay + 34, is30fps));
        speedStripes.push(drawSpeed(stage, Width.get(8, 7), delay + 8, is30fps));
        speedStripes.push(drawSpeed(stage, Width.get(16, 7), delay + 24, is30fps));
        speedStripes.push(drawSpeed(stage, Width.get(16), delay + 16, is30fps));

        return speedStripes;
    }

    function drawSpeed(stage, xFn, delay, is30fps) {
        function topOffSet(stage) {
            return calcScreenConst(stage.getImageWidth(SPEED), 2);
        }

        function yStart() {
            return -topOffSet(stage);
        }

        function yEnd(height) {
            return height + topOffSet(stage);
        }

        var newDelay = is30fps ? Math.floor(delay / 2) : delay;
        return stage.moveFreshLater(xFn, yStart, SPEED, xFn, yEnd, is30fps ? 15 : 30, Transition.LINEAR, newDelay, true,
            undefined, undefined, undefined, 1);
    }

    return showSpeedStripes;

})(Width, Transition, calcScreenConst, Math);