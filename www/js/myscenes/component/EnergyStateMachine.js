var EnergyStateMachine = (function (Event) {
    "use strict";

    function EnergyStateMachine(stage, events, world, shieldsDrawable, shieldsUpSprite, shieldsDownSprite, sounds,
        energyBarView, gameStats, timer) {
        this.stage = stage;
        this.events = events;
        this.world = world;
        this.shieldsDrawable = shieldsDrawable;
        this.shieldsUpSprite = shieldsUpSprite;
        this.shieldsDownSprite = shieldsDownSprite;
        this.sounds = sounds;
        this.energyBarView = energyBarView;
        this.gameStats = gameStats;
        this.currentStreak = 0;
        this.timer = timer;
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

        // stats
        this.gameStats.outOfEnergy++;
        this.currentStreak++;
        if (this.currentStreak > this.gameStats.outOfEnergyInARow) {
            this.gameStats.outOfEnergyInARow = this.currentStreak;
        }

        this.turnShieldsOff();
        this.timer.doLater(this.energyBarView.load.bind(this.energyBarView), 1);
        this.events.fireSync(Event.ALARM);
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
        } else {
            this.currentStreak = 0;
        }
    };

    return EnergyStateMachine;
})(Event);