var EnergyStateMachine = (function () {
    "use strict";

    function EnergyStateMachine(stage, world, shieldsDrawable, shieldsUpSprite, shieldsDownSprite, sounds,
        energyBarView) {
        this.stage = stage;
        this.world = world;
        this.shieldsDrawable = shieldsDrawable;
        this.shieldsUpSprite = shieldsUpSprite;
        this.shieldsDownSprite = shieldsDownSprite;
        this.sounds = sounds;
        this.energyBarView = energyBarView;
    }

    EnergyStateMachine.prototype.drainEnergy = function () {
        var self = this;

        function turnShieldsOn() {
            self.sounds.play('shields-up');
            self.world.shieldsOn = true;
            self.stage.animate(self.shieldsDrawable, self.shieldsUpSprite, function () {
                self.shieldsDrawable.data = self.stage.getGraphic('shields');
            });
        }

        turnShieldsOn();
        this.energyBarView.drain(self.energyEmpty.bind(self));
    };

    EnergyStateMachine.prototype.energyEmpty = function () {
        this.turnShieldsOff();
    };

    EnergyStateMachine.prototype.turnShieldsOff = function () {
        var self = this;
        //        self.sounds.play('shields-down');
        this.world.shieldsOn = false;
        self.stage.animate(self.shieldsDrawable, self.shieldsDownSprite, function () {
            self.stage.hide(self.shieldsDrawable);
        });
    };

    EnergyStateMachine.prototype.loadEnergy = function () {
        if (this.world.shieldsOn) {
            this.turnShieldsOff();
        }
        this.energyBarView.load();
    };

    return EnergyStateMachine;
})();
