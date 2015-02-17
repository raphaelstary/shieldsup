var ScoreView = (function (calcScreenConst, wrap, Transition, Font) {
    "use strict";

    function ScoreView(stage) {
        this.stage = stage;
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
            getEndY, 60, Transition.LINEAR, false, function () {
                self.stage.remove(score);
            }, undefined, 3, 0.5).drawable;
        self.stage.animateAlphaPattern(score, [
            {
                value: 1,
                duration: 15,
                easing: Transition.LINEAR
            }, {
                value: 0.5,
                duration: 29,
                easing: Transition.LINEAR
            }
        ]);
    };

    return ScoreView;
})(calcScreenConst, wrap, Transition, Font);