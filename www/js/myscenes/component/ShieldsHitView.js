var ShieldsHitView = (function (wrap, Transition) {
    "use strict";

    function ShieldsHitView(stage, drawable, timer, shaker, is30fps) {
        this.stage = stage;
        this.drawable = drawable;
        this.timer = timer;
        this.shaker = shaker;
        this.fadeInSpeed = is30fps ? 1 : 2;
        this.fadeOutSpeed = is30fps ? 2 : 4;
    }

    var SHIELDS_WHITE = 'shields_white';

    ShieldsHitView.prototype.hit = function () {
        var dep = [this.drawable];
        var white = this.stage.drawFresh(wrap(this.drawable.x), wrap(this.drawable.y), SHIELDS_WHITE, 5, dep);
        this.shaker.add(white);
        var self = this;
        this.stage.animateAlphaPattern(white, [
            {
                value: 0.5,
                duration: self.fadeInSpeed,
                easing: Transition.LINEAR
            }, {
                value: 1,
                duration: self.fadeOutSpeed,
                easing: Transition.LINEAR
            }
        ], true);


        this.timer.doLater(function () {
            self.stage.remove(white);
            self.shaker.remove(white);
        }, 15);
    };

    return ShieldsHitView;
})(wrap, Transition);