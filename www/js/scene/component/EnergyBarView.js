var EnergyBarView = (function (Transition) {
    "use strict";

    var TIME = 120;
    var LAST_TICK = TIME - 1;

    function EnergyBarView(stage, drawable) {
        this.stage = stage;
        this.drawable = drawable;
        var self = this;

        function getA_x() {
            // hack for animation dependency on drawable
            var width = drawable.getWidth();
            if (self.loadAnimation) {
                self.loadAnimation.end = width;
                self.loadAnimation.length = width;
            }
            if (self.drainAnimation) {
                self.drainAnimation.start = width;
                self.drainAnimation.length = -width;
            }

            return drawable.getCornerX();
        }

        function getA_y() {
            return drawable.getCornerY();
        }

        function getB_x() {
            return drawable.getEndX();
        }

        function getB_y() {
            return drawable.getEndY();
        }

        this.stage.mask(drawable, getA_x, getA_y, getB_x, getB_y);

        this.loadAnimation = this.stage.getAnimation(0, this.drawable.getWidth(), TIME, Transition.LINEAR, false);
        this.drainAnimation = this.stage.getAnimation(this.drawable.getWidth(), 0, TIME, Transition.LINEAR, false);
    }

    EnergyBarView.prototype.drain = function (callback) {
        this.__animateMaskWidth(this.drainAnimation, callback);
    };

    EnergyBarView.prototype.load = function (callback) {
        this.__animateMaskWidth(this.loadAnimation, callback);
    };

    EnergyBarView.prototype.__animateMaskWidth = function (animation, callback) {
        var self = this;
        var position = 0;
        if (this.stage.stage.animations.has(this.drawable))
            position = LAST_TICK - this.stage.stage.animations.dict[this.drawable.id].time;

        this.stage.basicAnimation(this.drawable, function (value) {
            self.drawable.mask.width = value;
        }, animation, callback);

        this.stage.stage.animations.dict[this.drawable.id].time = position;
        this.drawable.mask.width = Transition.LINEAR(position, animation.start, animation.length, animation.duration);
    };

    return EnergyBarView;
})(Transition);