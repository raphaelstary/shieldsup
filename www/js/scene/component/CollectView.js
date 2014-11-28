var CollectView = (function (Math, Transition, calcScreenConst) {
    "use strict";

    var STAR_SHINE = 'star_shine';
    var SHIP_WHITE = 'ship_white';

    function CollectView(stage, shipDrawable) {
        this.stage = stage;
        this.shipDrawable = shipDrawable;
    }

    CollectView.prototype.collectStar = function () {
        var self = this;
        var dep = [this.shipDrawable];

        function getX() {
            return self.shipDrawable.x;
        }

        function getY() {
            return self.shipDrawable.y;
        }

        function getShineY(height) {
            return self.shipDrawable.y + calcScreenConst(height, 48);
        }

        var shine = this.stage.drawFresh(getX, getShineY, STAR_SHINE, 1, dep, 1, 0);
        this.stage.animateRotation(shine, 2 * Math.PI, 180, Transition.LINEAR, true);
        var white = this.stage.drawFresh(getX, getY, SHIP_WHITE, 3, dep, 0);
        this.stage.animateAlphaPattern(white, [
            {
                value: 1,
                duration: 8,
                easing: Transition.LINEAR
            }, {
                value: 0,
                duration: 29,
                easing: Transition.LINEAR,
                callback: end
            }
        ], false);

        function end() {
            self.stage.remove(shine);
            self.stage.remove(white);
        }
    };

    return CollectView;
})(Math, Transition, calcScreenConst);