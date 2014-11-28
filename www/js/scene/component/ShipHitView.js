var ShipHitView = (function (wrap, Transition) {
    "use strict";

    var SHIP_WHITE = 'ship_white';
    var SHIP_BLACK = 'ship_white';

    function ShipHitView(stage, drawable, timer) {
        this.stage = stage;
        this.drawable = drawable;
        this.timer = timer;
    }

    ShipHitView.prototype.hit = function () {
        var dep = [this.drawable];
        var white = this.stage.drawFresh(wrap(this.drawable.x), wrap(this.drawable.y), SHIP_WHITE, 2, dep);
        var black = this.stage.drawFresh(wrap(this.drawable.x), wrap(this.drawable.y), SHIP_BLACK, 3, dep, 0);
        this.stage.animateAlphaPattern(black, [
            {
                value: 1,
                duration: 3,
                easing: Transition.LINEAR
            }, {
                value: 0,
                duration: 6,
                easing: Transition.LINEAR
            }
        ], true);

        var self = this;
        this.timer.doLater(function () {
            self.stage.remove(white);
            self.stage.remove(black);
        }, 30);
    };

    return ShipHitView;
})(wrap, Transition);