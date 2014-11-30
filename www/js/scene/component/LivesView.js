var LivesView = (function (calcScreenConst, Transition) {
    "use strict";

    function LivesView(stage, livesDict, shaker) {
        this.stage = stage;
        this.livesDict = livesDict;
        this.shaker = shaker;
    }

    LivesView.prototype.remove = function (lifeNr) {
        var life = this.livesDict[lifeNr];

        function getX() {
            return life.x;
        }

        function getEndY(height) {
            return life.y + calcScreenConst(height, 48, 2);
        }

        var self = this;
        var DURATION = 15;
        this.stage.move(life, getX, getEndY, DURATION, Transition.LINEAR, false, function () {
            self.stage.remove(life);
            self.shaker.remove(life);
            delete self.livesDict[lifeNr];
        });
        life.alpha = 1;
        this.stage.animateAlpha(life, 0, DURATION, Transition.LINEAR, false);
    };

    LivesView.prototype.add = function () {
        console.log('add life');
    };

    return LivesView;
})(calcScreenConst, Transition);