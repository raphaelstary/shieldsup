var ShieldsHitView = (function (wrap, Transition) {
    "use strict";

    function ShieldsHitView(stage, drawable, timer, shaker) {
        this.stage = stage;
        this.drawable = drawable;
        this.timer = timer;
        this.shaker = shaker;
    }

    var SHIELDS_WHITE = 'shields_white';

    ShieldsHitView.prototype.hit = function () {
        var dep = [this.drawable];
        var white = this.stage.drawFresh(wrap(this.drawable.x), wrap(this.drawable.y), SHIELDS_WHITE, 5, dep);
        this.shaker.add(white);
        this.stage.animateAlphaPattern(white, [
            {
                value: 0.5,
                duration: 2,
                easing: Transition.LINEAR
            }, {
                value: 1,
                duration: 4,
                easing: Transition.LINEAR
            }
        ], true);

        var self = this;
        this.timer.doLater(function () {
            self.stage.remove(white);
            self.shaker.remove(white);
        }, 15);
    };

    return ShieldsHitView;
})(wrap, Transition);