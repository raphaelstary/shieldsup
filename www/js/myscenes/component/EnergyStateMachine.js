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

    var SHIELDS_DOWN_SOUND = 'servo_movement_02';
    var SHIELDS_UP_SOUND = 'hydraulics_engaged';
    var SHIELDS_ON_SOUND = 'warp_engineering_05';
    var ALARM = 'alarm';

    EnergyStateMachine.prototype.drainEnergy = function () {
        var self = this;

        function turnShieldsOn() {
            self.sounds.play(SHIELDS_UP_SOUND);
            self.world.shieldsOn = true;
            self.stage.animate(self.shieldsDrawable, self.shieldsUpSprite, function () {
                self.shieldsDrawable.data = self.stage.getGraphic('shields');
                self.__onSound = self.sounds.play(SHIELDS_ON_SOUND);
            });
        }

        turnShieldsOn();
        this.energyBarView.drain(self.energyEmpty.bind(self));
    };

    EnergyStateMachine.prototype.energyEmpty = function () {
        this.__alarmSound = this.sounds.play(ALARM);
        this.__alarmOn = true;
        this.turnShieldsOff();
    };

    EnergyStateMachine.prototype.turnShieldsOff = function () {
        var self = this;
        //self.sounds.stop(self.__onSound);
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
        if (this.__alarmOn) {
            this.sounds.stop(this.__alarmSound);
        }
    };

    return EnergyStateMachine;
})();