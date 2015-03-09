var MissionControl = (function (localStorage, loadInteger, loadObject, saveObject) {
    "use strict";

    function MissionControl(missions) {
        this.missions = missions;
    }

    var MAX_ACTIVE = 3;
    var ACTIVE = 'shields_up-mission_active';
    var COMPLETE = 'shields_up-mission_complete';
    var COMPLETE_COUNT = 'shields_up-mission_complete_count';

    MissionControl.prototype.getActiveMissions = function () {
        var activeMissions = this.__getActiveMissions();

        if (activeMissions.length >= MAX_ACTIVE)
            return activeMissions;

        var completeMissions = this.__getCompleteMissions();

        while (activeMissions.length < 3) {
            activeMissions.push(this.missions.getNext(activeMissions, completeMissions));
        }

        saveObject(ACTIVE, activeMissions);

        return activeMissions;
    };

    MissionControl.prototype.__getActiveMissions = function () {
        return this.activeMissions ? this.activeMissions : (this.activeMissions = (loadObject(ACTIVE) || []));
    };

    MissionControl.prototype.__getCompleteMissions = function () {
        return this.completeMisssions ? this.completeMissions : (this.completeMissions = (loadObject(COMPLETE) || []));
    };

    MissionControl.prototype.checkActiveMissions = function (gameStats) {
        var activeMissions = this.__getActiveMissions();

        var completeMissions = [];
        var updateActiveMissions = false;
        activeMissions.forEach(function (mission, index, missions) {
            var result = this.missions.check(mission, gameStats);
            if (result == 'success') {
                completeMissions = mission.id;
                missions.splice(index, 1);
                updateActiveMissions = true;
            } else if (result == 'evolution') {
                updateActiveMissions = true;
            }
        }, this);

        if (updateActiveMissions) {
            saveObject(ACTIVE, activeMissions);
        }
        if (completeMissions.length > 0) {
            var allCompleteMissions = this.__getCompleteMissions();
            saveObject(COMPLETE, allCompleteMissions.push.apply(allCompleteMissions, completeMissions));
            localStorage.setItem(COMPLETE_COUNT, loadInteger(COMPLETE_COUNT) + completeMissions.length);
        }

        return completeMissions;
    };

    return MissionControl;
})(lclStorage, loadInteger, loadObject, saveObject);