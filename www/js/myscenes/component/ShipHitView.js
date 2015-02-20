var ShipHitView = (function (wrap, Transition) {
    "use strict";

    var SHIP_WHITE = 'ship_white';
    var SHIP_BLACK = 'ship_black';
    var Z_INDEX = 4;

    function ShipHitView(stage, drawable, timer, shaker, is30fps) {
        this.stage = stage;
        this.drawable = drawable;
        this.timer = timer;
        this.shaker = shaker;
        this.fadeInSpeed = is30fps ? 1 : 2;
        this.fadeOutSpeed = is30fps ? 2 : 4;
    }

    ShipHitView.prototype.hit = function () {
        var dep = [this.drawable];
        var white = this.stage.drawFresh(wrap(this.drawable.x), wrap(this.drawable.y), SHIP_WHITE, Z_INDEX, dep);
        var black = this.stage.drawFresh(wrap(this.drawable.x), wrap(this.drawable.y), SHIP_BLACK, Z_INDEX + 1, dep, 0);
        this.shaker.add(white);
        this.shaker.add(black);
        var self = this;
        this.stage.animateAlphaPattern(black, [
            {
                value: 1,
                duration: self.fadeInSpeed,
                easing: Transition.LINEAR
            }, {
                value: 0,
                duration: self.fadeOutSpeed,
                easing: Transition.LINEAR
            }
        ], true);


        this.timer.doLater(function () {
            self.stage.remove(white);
            self.stage.remove(black);
            self.shaker.remove(white);
            self.shaker.remove(black);
        }, 30);
    };

    return ShipHitView;
})(wrap, Transition);