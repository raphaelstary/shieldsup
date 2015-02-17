var CollectView = (function (Math, Transition, calcScreenConst) {
    "use strict";

    var STAR_SHINE = 'star_shine';
    var SHIP_WHITE = 'ship_white';

    function CollectView(stage, shipDrawable, shaker) {
        this.stage = stage;
        this.shipDrawable = shipDrawable;
        this.shaker = shaker;
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

        var shine = this.stage.drawFresh(getX, getShineY, STAR_SHINE, 3, dep, 1, 0);
        this.stage.animateRotation(shine, 2 * Math.PI, 180, Transition.LINEAR, true);
        this.shaker.add(shine);
        var white = this.stage.drawFresh(getX, getY, SHIP_WHITE, 5, dep, 0);
        this.shaker.add(white);
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
        ]);

        function end() {
            self.stage.remove(shine);
            self.stage.remove(white);
            self.shaker.remove(shine);
            self.shaker.remove(white);
        }
    };

    return CollectView;
})(Math, Transition, calcScreenConst);