var KillScreen = (function () {
    "use strict";

    function KillScreen(services) {
        this.stage = services.stage;
        this.sceneStorage = services.sceneStorage;
        this.sounds = services.sounds;
    }

    var FINAL_EXPLOSION = 'final_explosion/final_explosion';
    var SHIP_EXPLOSION = 'radio_stager_01';
    var SHIP_HIT = 'slamming_metal_lid';
    var STAR_EXPLOSION = 'booming_reverse_01';
    var ASTEROID_EXPLOSION = 'booming_rumble';
    var TOTAL_WAVES = 28;

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

        self.stage.remove(fire.left);
        self.stage.remove(fire.right);

        if (this.sceneStorage.gameStats.completedWaves >= TOTAL_WAVES) {
            commonRemove();
            // do smth special

            nextScene();
            return;
        }

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
})();