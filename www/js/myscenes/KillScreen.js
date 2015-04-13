var KillScreen = (function (CollectView, Transition, multiply, changeSign, Height, Font, Width) {
    "use strict";

    function KillScreen(services) {
        this.stage = services.stage;
        this.sceneStorage = services.sceneStorage;
        this.sounds = services.sounds;
        this.shaker = services.shaker;
        this.messages = services.messages;
    }

    var FINAL_EXPLOSION = 'final_explosion/final_explosion';
    var SHIP_EXPLOSION = 'radio_stager_01';
    var SHIP_HIT = 'slamming_metal_lid';
    var STAR_EXPLOSION = 'booming_reverse_01';
    var ASTEROID_EXPLOSION = 'booming_rumble';
    var TOTAL_WAVES = 28;

    var KEY = 'game';
    var WAVES_COMPLETE = 'waves_complete';
    var CONGRATS = 'congrats';
    var FONT = 'GameFont';
    var LIGHT_GRAY = '#D3D3D3';
    var COLLECT_STAR = 'kids_cheering';

    KillScreen.prototype.show = function (nextScene) {
        var speedStripes = this.sceneStorage.speedStripes;
        delete this.sceneStorage.speedStripes;
        var shipDrawable = this.sceneStorage.ship;
        delete this.sceneStorage.ship;
        var fire = this.sceneStorage.fire;
        delete this.sceneStorage.fire;
        var countDrawables = this.sceneStorage.counts;
        delete this.sceneStorage.counts;
        var distanceDrawable = this.sceneStorage.distance;
        delete this.sceneStorage.distance;

        var self = this;
        speedStripes.forEach(function (speedStripeWrapper) {
            self.stage.remove(speedStripeWrapper.drawable);
        });

        if (this.sceneStorage.gameStats.completedWaves >= TOTAL_WAVES) {
            var animator = new CollectView(self.stage, shipDrawable, self.shaker, self.sceneStorage.do30fps);
            this.sounds.play(COLLECT_STAR);
            animator.collectStar();

            var speed = self.sceneStorage.do30fps ? 180 : 360;

            var congratsDrawable = self.stage.moveFreshText(changeSign(Width.FULL), Height.QUARTER,
                self.messages.get(KEY, CONGRATS), Font._30, FONT, LIGHT_GRAY, multiply(Width.FULL, 2), Height.QUARTER, speed - 60,
                Transition.EASE_OUT_IN_SIN, false, function () {
                    self.sounds.play(COLLECT_STAR);
                    animator.collectStar();
                    self.stage.remove(congratsDrawable);
                }, undefined, 5).drawable;

            var readyDrawable = self.stage.moveFreshText(changeSign(Width.FULL), Height.THIRD,
                self.messages.get(KEY, WAVES_COMPLETE), Font._30, FONT, LIGHT_GRAY, multiply(Width.FULL, 2), Height.THIRD, speed,
                Transition.EASE_OUT_IN_SIN, false, function () {
                    self.stage.remove(readyDrawable);
                    self.stage.remove(fire.left);
                    self.stage.remove(fire.right);
                    commonRemove();
                    nextScene();
                }, undefined, 5).drawable;

            return;
        }
        self.stage.remove(fire.left);
        self.stage.remove(fire.right);

        self.sounds.play(SHIP_HIT);
        self.sounds.play(STAR_EXPLOSION);
        self.sounds.play(ASTEROID_EXPLOSION);
        self.sounds.play(SHIP_EXPLOSION);

        var explosionSprite = self.stage.getSprite(FINAL_EXPLOSION, 10, false);
        self.stage.animate(shipDrawable, explosionSprite, function () {
            commonRemove();
            nextScene();
        });

        function commonRemove() {
            self.stage.remove(shipDrawable);
            countDrawables.forEach(function (count) {
                self.stage.remove(count);
            });
            self.stage.remove(distanceDrawable);
        }
    };

    return KillScreen;
})(CollectView, Transition, multiply, changeSign, Height, Font, Width);