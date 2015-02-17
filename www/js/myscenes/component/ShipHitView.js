var ShipHitView = (function (wrap, Transition) {
    "use strict";

    var SHIP_WHITE = 'ship_white';
    var SHIP_BLACK = 'ship_black';
    var Z_INDEX = 4;

    function ShipHitView(stage, drawable, timer, shaker) {
        this.stage = stage;
        this.drawable = drawable;
        this.timer = timer;
        this.shaker = shaker;
    }

    ShipHitView.prototype.hit = function () {
        var dep = [this.drawable];
        var white = this.stage.drawFresh(wrap(this.drawable.x), wrap(this.drawable.y), SHIP_WHITE, Z_INDEX, dep);
        var black = this.stage.drawFresh(wrap(this.drawable.x), wrap(this.drawable.y), SHIP_BLACK, Z_INDEX + 1, dep, 0);
        this.shaker.add(white);
        this.shaker.add(black);
        this.stage.animateAlphaPattern(black, [
            {
                value: 1,
                duration: 2,
                easing: Transition.LINEAR
            }, {
                value: 0,
                duration: 4,
                easing: Transition.LINEAR
            }
        ], true);

        var self = this;
        this.timer.doLater(function () {
            self.stage.remove(white);
            self.stage.remove(black);
            self.shaker.remove(white);
            self.shaker.remove(black);
        }, 30);
    };

    return ShipHitView;
})(wrap, Transition);