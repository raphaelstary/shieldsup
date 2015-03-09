var Missions = (function () {
    "use strict";

    function Missions() {
        this.missions = [
            {
                id: 0,
                msgKey: 'destroy_100_asteroids',
                allTime: true,
                constraintKey: 'destroyedAsteroids',
                constraintValue: 100
            }, {
                id: 1,
                msgKey: 'destroy_50_asteroids_game',
                allTime: false,
                constraintKey: 'destroyedAsteroids',
                constraintValue: 50
            }, {
                id: 2,
                msgKey: 'destroy_100_asteroids',
                allTime: true,
                constraintKey: 'destroyedAsteroids',
                constraintValue: 100
            }, {
                id: 3,
                msgKey: 'destroy_50_asteroids_game',
                allTime: false,
                constraintKey: 'destroyedAsteroids',
                constraintValue: 50
            }, {
                id: 4,
                msgKey: 'destroy_100_asteroids',
                allTime: true,
                constraintKey: 'destroyedAsteroids',
                constraintValue: 100
            }, {
                id: 5,
                msgKey: 'destroy_50_asteroids_game',
                allTime: false,
                constraintKey: 'destroyedAsteroids',
                constraintValue: 50
            }, {
                id: 6,
                msgKey: 'destroy_50_asteroids_game',
                allTime: false,
                constraintKey: 'destroyedAsteroids',
                constraintValue: 50
            }, {
                id: 7,
                msgKey: 'destroy_100_asteroids',
                allTime: true,
                constraintKey: 'destroyedAsteroids',
                constraintValue: 100
            }, {
                id: 8,
                msgKey: 'destroy_50_asteroids_game',
                allTime: false,
                constraintKey: 'destroyedAsteroids',
                constraintValue: 50
            }, {
                id: 9,
                msgKey: 'destroy_100_asteroids',
                allTime: true,
                constraintKey: 'destroyedAsteroids',
                constraintValue: 100
            }
        ]
    }

    Missions.prototype.getNext = function (activeMissions, completeMissions) {
        var nextMission;
        this.missions.some(function (mission) {

            var isAlreadyActive = activeMissions.some(function (active) {
                return active.id == mission.id;
            });
            if (isAlreadyActive)
                return false;

            var isAlreadyComplete = completeMissions.some(function (completeId) {
                return completeId == mission.id;
            });
            if (isAlreadyComplete)
                return false;

            nextMission = {
                id: mission.id,
                msgKey: mission.msgKey,
                count: 0
            };

            return true;
        });

        return nextMission;
    };

    Missions.prototype.check = function (mission, gameStats) {
        var missionEntity;
        this.missions.some(function (entity) {
            var missionFound = entity.id == mission.id;
            if (missionFound) {
                missionEntity = entity;
            }
            return missionFound;
        });
        if (!missionEntity)
            return 'failure';

        var expected = missionEntity.constraintValue;
        var actual = gameStats[missionEntity.constraintKey];
        if (expected <= actual) {
            return 'success';

        } else if (missionEntity.allTime) {
            mission.count += actual;

            if (expected <= mission.count) {
                return 'success';
            } else {
                return 'evolution'
            }
        }

        return 'failure';
    };

    return Missions;
})();