var EnergyBarView = (function (Transition, EnergyBar, changeCoords, changeMask) {
    "use strict";

    var TIME = 120;
    var LAST_TICK = TIME - 1;

    function EnergyBarView(stage, drawable) {
        this.stage = stage;
        this.drawable = drawable;

        this.stage.mask(drawable, drawable.getCornerX.bind(drawable), drawable.getCornerY.bind(drawable),
            drawable.getEndX.bind(drawable), drawable.getEndY.bind(drawable));

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
        this.stage.basicAnimation(this.drawable, function (value) {
            self.drawable.mask.width = value;
        }, animation, callback);

        var position = 0;
        if (this.stage.stage.animations.has(this.drawable))
            position = LAST_TICK - this.stage.stage.animations.dict[this.drawable.id].time;

        this.stage.stage.animations.dict[this.drawable.id].time = position;
        this.drawable.mask.width = Transition.LINEAR(position, animation.start, animation.length, animation.duration);
    };

    EnergyBarView.prototype.resize = function (width, height) {
        changeCoords(this.drawable, EnergyBar.getX(width), EnergyBar.getY(height));
        changeMask(this.drawable.mask, this.drawable.getCornerX(), this.drawable.getCornerY(), this.drawable.getEndX(),
            this.drawable.getEndY());
    };

    return EnergyBarView;
})(Transition, EnergyBar, changeCoords, changeMask);
