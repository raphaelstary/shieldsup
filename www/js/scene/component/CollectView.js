var CollectView = (function (Math, Transition, wrap) {
    "use strict";

    var STAR_SHINE = 'star_shine';
    var SHIP_WHITE = 'ship_white';

    function CollectView(stage, shipDrawable) {
        this.stage = stage;
        this.shipDrawable = shipDrawable;
    }

    CollectView.prototype.collectStar = function () {
        var dep = [this.shipDrawable];
        var shine = this.stage.drawFresh(wrap(this.shipDrawable.x), wrap(this.shipDrawable.y), STAR_SHINE, 1, dep);
        this.stage.animateRotation(shine, 2 * Math.PI, 60, Transition.LINEAR, true);
        var white = this.stage.drawFresh(wrap(this.shipDrawable.x), wrap(this.shipDrawable.y), SHIP_WHITE, 3, dep, 0);
        this.stage.animateAlphaPattern(white, [
            {
                value: 1,
                duration: 8,
                easing: $.Transition.LINEAR
            }, {
                value: 0,
                duration: 29,
                easing: $.Transition.LINEAR,
                callback: end
            }
        ], false);

        var self = this;

        function end() {
            self.stage.remove(shine);
            self.stage.remove(white);
        }
    };

    return CollectView;
})(Math, Transition, wrap);
