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

        for (var i = activeMissions.length - 1; i >= 0; i--) {
            if (activeMissions[i].success)
                activeMissions.splice(i, 1);
        }

        if (activeMissions.length >= MAX_ACTIVE)
            return activeMissions;

        var completeMissions = this.__getCompleteMissions();

        var nrOfMissionsYouWant = 0;
        if (activeMissions.length == 0) {
            nrOfMissionsYouWant = 3;
        } else if (activeMissions.length < 3) {
            nrOfMissionsYouWant = activeMissions.length - 3;
        }
        for (; nrOfMissionsYouWant > 0; nrOfMissionsYouWant--) {
            var possibleNxtMission = this.missions.getNext(activeMissions, completeMissions);
            if (possibleNxtMission)
                activeMissions.push(possibleNxtMission);
        }

        saveObject(ACTIVE, activeMissions);

        return activeMissions;
    };

    MissionControl.prototype.__getActiveMissions = function () {
        return this.activeMissions ? this.activeMissions : this.activeMissions = loadObject(ACTIVE) || [];
    };

    MissionControl.prototype.__getCompleteMissions = function () {
        return this.completeMissions ? this.completeMissions : this.completeMissions = loadObject(COMPLETE) || [];
    };

    MissionControl.prototype.checkActiveMissions = function (gameStats) {
        var activeMissions = this.__getActiveMissions();

        var completeMissions = [];
        var updateActiveMissions = false;
        activeMissions.forEach(function (mission, index, missions) {
            var result = this.missions.check(mission, gameStats);
            if (result == 'success') {
                completeMissions.push(mission.id);
                mission.success = true;
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
            allCompleteMissions.push.apply(allCompleteMissions, completeMissions);
            saveObject(COMPLETE, allCompleteMissions);
            localStorage.setItem(COMPLETE_COUNT, loadInteger(COMPLETE_COUNT) + completeMissions.length);
        }

        return activeMissions;
    };

    return MissionControl;
})(lclStorage, loadInteger, loadObject, saveObject);