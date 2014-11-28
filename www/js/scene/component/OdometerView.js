var OdometerView = (function (ScoreBoard, Transition, Math) {
    "use strict";

    function OdometerView(stage, countDrawables) {
        this.stage = stage;
        this.countDrawables = countDrawables;
    }

    OdometerView.prototype.animateTransition = function (digitPosition, oldValue, newValue) {
        var currentDrawable = this.countDrawables[digitPosition];

        var getX;
        if (digitPosition === 0) {
            getX = ScoreBoard.getFirstX.bind(undefined, currentDrawable);
        } else if (digitPosition === 1) {
            getX = ScoreBoard.getSecondX.bind(undefined, currentDrawable);
        } else if (digitPosition === 2) {
            getX = ScoreBoard.getThirdX.bind(undefined, currentDrawable);
        } else if (digitPosition === 3) {
            getX = ScoreBoard.getFourthX.bind(undefined, currentDrawable);
        }

        function getUpperY(height) {
            return ScoreBoard.getY(height) - Math.floor(currentDrawable.getHeight() * 1.2);
        }

        function getLowerY(height) {
            return ScoreBoard.getY(height) + Math.floor(currentDrawable.getHeight() * 1.2);
        }

        var self = this;
        var speed = 60;
        var spacing = Transition.LINEAR;
        this.stage.move(currentDrawable, getX, getUpperY, speed, spacing, false, function () {
            self.stage.remove(currentDrawable);
        });
        var newDrawable = this.stage.moveFreshText(getX, getLowerY, newValue.toString(), ScoreBoard.getSize,
            ScoreBoard.font, ScoreBoard.color, getX, ScoreBoard.getY, speed, spacing, false, function () {
                self.stage.unmask(newDrawable);
            }).drawable;
        this.countDrawables.splice(digitPosition, 1, newDrawable);

        var first = this.countDrawables[this.countDrawables.length - 1];
        var last = this.countDrawables[0];
        this.stage.mask(currentDrawable, first.getCornerX.bind(first), first.getCornerY.bind(first),
            last.getEndX.bind(last), last.getEndY.bind(last));
        this.stage.mask(newDrawable, first.getCornerX.bind(first), first.getCornerY.bind(first),
            last.getEndX.bind(last), last.getEndY.bind(last));
    };

    return OdometerView;
})(ScoreBoard, Transition, Math);