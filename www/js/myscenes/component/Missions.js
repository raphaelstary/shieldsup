var Missions = (function () {
    "use strict";

    function Missions() {
        this.missions = [
            {
                id: 0,
                msgKey: 'destroy_10_asteroids_once',
                allTime: false,
                constraintKey: 'destroyedAsteroids',
                constraintValue: 10
            }, {
                id: 1,
                msgKey: 'collect_5_stars_once',
                allTime: false,
                constraintKey: 'collectedStars',
                constraintValue: 5
            }, {
                id: 2,
                msgKey: 'reach_1000_once',
                allTime: false,
                constraintKey: 'timePlayed',
                constraintValue: 1000
            }, {
                id: 3,
                msgKey: 'destroy_100_asteroids_total',
                allTime: true,
                constraintKey: 'destroyedAsteroids',
                constraintValue: 100
            }, {
                id: 4,
                msgKey: 'destroy_30_stars_total',
                allTime: true,
                constraintKey: 'destroyedStars',
                constraintValue: 30
            }, {
                id: 5,
                msgKey: 'collect_50_stars_total',
                allTime: true,
                constraintKey: 'collectedStars',
                constraintValue: 50
            }, {
                id: 6,
                msgKey: 'destroy_50_asteroids_once',
                allTime: false,
                constraintKey: 'destroyedAsteroids',
                constraintValue: 50
            }, {
                id: 7,
                msgKey: 'reach_10000_total',
                allTime: true,
                constraintKey: 'timePlayed',
                constraintValue: 10000
            }, {
                id: 8,
                msgKey: 'collect_10_asteroids_total',
                allTime: true,
                constraintKey: 'collectedAsteroids',
                constraintValue: 10
            }, {
                id: 9,
                msgKey: 'collect_20_stars_once',
                allTime: false,
                constraintKey: 'collectedStars',
                constraintValue: 20
            }, {
                id: 10,
                msgKey: 'travel_3000_shields_on_total',
                allTime: true,
                constraintKey: 'timeShieldsOn',
                constraintValue: 3000
            }, {
                id: 11,
                msgKey: '1_perfect_waves_once',
                allTime: false,
                constraintKey: 'perfectWaves',
                constraintValue: 1
            }, {
                id: 12,
                msgKey: 'collect_150_stars_total',
                allTime: true,
                constraintKey: 'collectedStars',
                constraintValue: 150
            }, {
                id: 13,
                msgKey: 'out_of_energy_20_total',
                allTime: true,
                constraintKey: 'outOfEnergy',
                constraintValue: 20
            }, {
                id: 14,
                msgKey: 'destroy_500_asteroids_total',
                allTime: true,
                constraintKey: 'destroyedAsteroids',
                constraintValue: 500
            }, {
                id: 15,
                msgKey: '1500_without_shields_once',
                allTime: false,
                constraintKey: 'timeShieldsOff',
                constraintValue: 1500
            }, {
                id: 16,
                msgKey: '10_perfect_waves_total',
                allTime: true,
                constraintKey: 'perfectWaves',
                constraintValue: 10
            }, {
                id: 17,
                msgKey: 'destroy_20_stars_once',
                allTime: false,
                constraintKey: 'destroyedStars',
                constraintValue: 20
            }, {
                id: 18,
                msgKey: 'reach_3000_once',
                allTime: false,
                constraintKey: 'timePlayed',
                constraintValue: 3000
            }, {
                id: 19,
                msgKey: 'collect_15_asteroids_total',
                allTime: true,
                constraintKey: 'collectedAsteroids',
                constraintValue: 15
            }, {
                id: 20,
                msgKey: 'out_of_energy_10_once',
                allTime: false,
                constraintKey: 'outOfEnergy',
                constraintValue: 10
            }, {
                id: 21,
                msgKey: 'destroy_200_asteroids_row',
                allTime: false,
                constraintKey: 'destroyedAsteroidsInARow',
                constraintValue: 200
            }, {
                id: 22,
                msgKey: 'collect_20_stars_row',
                allTime: false,
                constraintKey: 'collectedStarsInARow',
                constraintValue: 20
            }, {
                id: 23,
                msgKey: 'lose_2_lives_once',
                allTime: false,
                constraintKey: 'livesLost',
                constraintValue: 2
            }, {
                id: 24,
                msgKey: '5_waves_without_life_once',
                allTime: false,
                constraintKey: 'wavesWithoutLifeLost',
                constraintValue: 5
            }, {
                id: 25,
                msgKey: 'destroy_20_stars_row',
                allTime: false,
                constraintKey: 'destroyedStarsInARow',
                constraintValue: 20
            }, {
                id: 26,
                msgKey: 'out_of_energy_15_row',
                allTime: false,
                constraintKey: 'outOfEnergyInARow',
                constraintValue: 15
            }, {
                id: 27,
                msgKey: 'travel_5000_without_out_of_energy_once',
                allTime: false,
                constraintKey: 'timeWithoutAlarm',
                constraintValue: 5000
            }, {
                id: 28,
                msgKey: '20_waves_without_life_total',
                allTime: true,
                constraintKey: 'wavesWithoutLifeLost',
                constraintValue: 20
            }, {
                id: 29,
                msgKey: 'lose_3_lives_once',
                allTime: false,
                constraintKey: 'livesLost',
                constraintValue: 3
            }, {
                id: 30,
                msgKey: '10_perfect_waves_row',
                allTime: false,
                constraintKey: 'perfectWavesInARow',
                constraintValue: 10
            }, {
                id: 31,
                msgKey: '5_waves_without_life_row',
                allTime: false,
                constraintKey: 'wavesWithoutLifeLostInARow',
                constraintValue: 5
            }, {
                id: 32,
                msgKey: 'collect_500_stars_total',
                allTime: true,
                constraintKey: 'collectedStars',
                constraintValue: 500
            }, {
                id: 33,
                msgKey: 'survive_50_waves_total',
                allTime: true,
                constraintKey: 'completedWaves',
                constraintValue: 50
            }, {
                id: 34,
                msgKey: 'travel_5000_without_getting_hit_once',
                allTime: false,
                constraintKey: 'timeWithoutLifeLost',
                constraintValue: 5000
            }, {
                id: 35,
                msgKey: 'lose_4_lives_once',
                allTime: false,
                constraintKey: 'livesLost',
                constraintValue: 4
            }, {
                id: 36,
                msgKey: 'earn_500_points_once',
                allTime: false,
                constraintKey: 'points',
                constraintValue: 500
            }, {
                id: 37,
                msgKey: 'travel_5000_without_collecting_star_once',
                allTime: false,
                constraintKey: 'timeWithoutStarCollected',
                constraintValue: 5000
            }, {
                id: 38,
                msgKey: 'destroy_5000_asteroids_total',
                allTime: true,
                constraintKey: 'destroyedAsteroids',
                constraintValue: 5000
            }, {
                id: 39,
                msgKey: 'earn_5000_points_total',
                allTime: true,
                constraintKey: 'points',
                constraintValue: 5000
            }
        ];
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
                count: 0,
                success: false,
                max: mission.constraintValue,
                allTime: mission.allTime
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
            mission.count += actual;
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