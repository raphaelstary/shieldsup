var ShieldsHitView = (function (wrap, Transition) {
    "use strict";

    function ShieldsHitView(stage, drawable, timer) {
        this.stage = stage;
        this.drawable = drawable;
        this.timer = timer;
    }

    var SHIELDS_WHITE = 'shields_white';

    ShieldsHitView.prototype.hit = function () {
        var dep = [this.drawable];
        var white = this.stage.drawFresh(wrap(this.drawable.x), wrap(this.drawable.y), SHIELDS_WHITE, 3, dep);
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
        }, 30);
    };

    return ShieldsHitView;
})(wrap, Transition);