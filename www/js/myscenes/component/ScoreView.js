var ScoreView = (function (calcScreenConst, wrap, Transition, Font) {
    "use strict";

    function ScoreView(stage, is30fps) {
        this.stage = stage;
        this.scoreSpeed = is30fps ? 30 : 60;
        this.fadeInSpeed = is30fps ? 7 : 15;
        this.fadeOutSpeed = is30fps ? 14 : 29;
    }

    var POINTS = '10';
    var SPECIAL_FONT = 'SpecialGameFont';
    var WHITE = '#fff';

    ScoreView.prototype.showScoredPoints = function (x, y) {
        function getStartY(height) {
            return y - calcScreenConst(height, 48, 5);
        }

        function getEndY(height) {
            return getStartY(height) - calcScreenConst(height, 48, 2);
        }

        var self = this;
        var score = this.stage.moveFreshText(wrap(x), getStartY, POINTS, Font._25, SPECIAL_FONT, WHITE, wrap(x),
            getEndY, this.scoreSpeed, Transition.LINEAR, false, function () {
                self.stage.remove(score);
            }, undefined, 3, 0.5).drawable;
        self.stage.animateAlphaPattern(score, [
            {
                value: 1,
                duration: self.fadeInSpeed,
                easing: Transition.LINEAR
            }, {
                value: 0.5,
                duration: self.fadeOutSpeed,
                easing: Transition.LINEAR
            }
        ]);
    };

    return ScoreView;
})(calcScreenConst, wrap, Transition, Font);
