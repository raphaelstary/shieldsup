var EnergyBarView = (function (Transition, Math) {
    "use strict";

    var TIME = 15;

    function EnergyBarView(stage, drawable, level, is30fps) {
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
        var time = TIME * level;
        var speed = is30fps ? Math.floor(time / 2) : time;
        this.lastTick = speed - 1;
        this.loadAnimation = this.stage.getAnimation(0, this.drawable.getWidth(), speed, Transition.LINEAR, false);
        this.drainAnimation = this.stage.getAnimation(this.drawable.getWidth(), 0, speed, Transition.LINEAR, false);
        this.lastAnimation = '';
    }

    EnergyBarView.prototype.drain = function (callback) {
        this.__animateMaskWidth(this.drainAnimation, 'drain', callback);
    };

    EnergyBarView.prototype.load = function (callback) {
        this.__animateMaskWidth(this.loadAnimation, 'load', callback);
    };

    EnergyBarView.prototype.__animateMaskWidth = function (animation, currentAnimation, callback) {
        var self = this;
        var position = 0;
        if (this.stage.stage.animations.has(this.drawable) && this.stage.stage.animations.dict[this.drawable.id][0]) {
            if (this.lastAnimation != currentAnimation) {
                position = this.lastTick - this.stage.stage.animations.dict[this.drawable.id][0].time;
            } else {
                position = this.stage.stage.animations.dict[this.drawable.id][0].time;
            }
        } else if (this.lastAnimation == currentAnimation) {
            return;
        }

        this.stage.stage.animations.remove(this.drawable);
        this.stage.basicAnimation(this.drawable, function (value) {
            self.drawable.mask.width = value;
        }, animation, callback);

        this.stage.stage.animations.dict[this.drawable.id][0].time = position;

        this.drawable.mask.width = Transition.LINEAR(position, animation.start, animation.length, animation.duration);
        this.lastAnimation = currentAnimation;
    };

    return EnergyBarView;
})(Transition, Math);