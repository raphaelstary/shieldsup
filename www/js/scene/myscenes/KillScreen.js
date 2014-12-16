var KillScreen = (function () {
    "use strict";

    function KillScreen(services) {
        this.stage = services.stage;
        this.sceneStorage = services.sceneStorage;
        this.sounds = services.sounds;
        this.events = services.events;
    }

    var FINAL_EXPLOSION = 'final_explosion/final_explosion';
    var SHIP_EXPLOSION = 'ship-explosion';

    KillScreen.prototype.show = function (nextScene) {
        var speedStripes = this.sceneStorage.speedStripes;
        delete this.sceneStorage.speedStripes;
        var shipDrawable = this.sceneStorage.ship;
        delete this.sceneStorage.ship;
        var fire = this.sceneStorage.fire;
        delete this.sceneStorage.fire;
        var countDrawables = this.sceneStorage.counts;
        delete this.sceneStorage.counts;

        var self = this;
        speedStripes.forEach(function (speedStripeWrapper) {
            self.stage.remove(speedStripeWrapper.drawable);
        });

        var explosionSprite = self.stage.getSprite(FINAL_EXPLOSION, 22, false);
        self.stage.remove(fire.left);
        self.stage.remove(fire.right);

        self.sounds.play(SHIP_EXPLOSION);
        self.stage.animate(shipDrawable, explosionSprite, function () {
            self.stage.remove(shipDrawable);
            countDrawables.forEach(function (count) {
                self.stage.remove(count);
            });

            self.events.unsubscribe(stop);
            self.events.unsubscribe(resume);

            nextScene();
        });

        var stop = this.events.subscribe('stop', function () {
            self.stage.pauseAll();
        });

        var resume = this.events.subscribe('resume', function () {
            self.stage.playAll();
        });
    };

    return KillScreen;
})();