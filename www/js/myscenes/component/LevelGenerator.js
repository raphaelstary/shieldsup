var LevelGenerator = (function (range) {
    "use strict";

    function LevelGenerator(drawHelper, is30fps) {
        this.drawHelper = drawHelper;
        this.is30fps = is30fps;

        this.levels = [
            {
                id: 0,
                showMessage: false,
                maxObstacles: 1,

                timeToFirst: 30,
                percentageForAsteroid: 100,

                asteroidSpeed: 240,
                pauseAfterAsteroid: 0,
                maxTimeToNextAfterAsteroid: 0,

                starSpeed: 0,
                pauseAfterStar: 0,
                maxTimeToNextAfterStar: 0
            }, {
                id: 1,
                showMessage: false,
                maxObstacles: 1,

                timeToFirst: 240,
                percentageForAsteroid: 0,

                asteroidSpeed: 0,
                pauseAfterAsteroid: 0,
                maxTimeToNextAfterAsteroid: 0,

                starSpeed: 180,
                pauseAfterStar: 0,
                maxTimeToNextAfterStar: 0
            }, {
                id: 2,
                showMessage: true,
                messageNr: '1',
                maxObstacles: 20,

                timeToFirst: 240,
                percentageForAsteroid: 80,

                asteroidSpeed: 120,
                pauseAfterAsteroid: 30,
                maxTimeToNextAfterAsteroid: 50,

                starSpeed: 120,
                pauseAfterStar: 20,
                maxTimeToNextAfterStar: 50
            }, {
                id: 3,
                showMessage: true,
                messageNr: '2',
                maxObstacles: 20,

                timeToFirst: 240,
                percentageForAsteroid: 80,

                minAsteroidSpeed: 120,
                maxAsteroidSpeed: 180,
                pauseAfterAsteroid: 20,
                maxTimeToNextAfterAsteroid: 30,

                starSpeed: 210,
                pauseAfterStar: 50,
                maxTimeToNextAfterStar: 90
            }, {
                id: 4,
                showMessage: true,
                messageNr: '3',
                maxObstacles: 20,

                timeToFirst: 240,
                percentageForAsteroid: 80,

                asteroidSpeed: 180,
                pauseAfterAsteroid: 60,
                maxTimeToNextAfterAsteroid: 90,
                percentageForAsteroidGroup: 70,
                percentageForStarInAsteroidGroup: 0,
                minAsteroidGroup: 3,
                maxAsteroidGroup: 6,
                asteroidGroupSpawnPause: 20,

                starSpeed: 210,
                pauseAfterStar: 50,
                maxTimeToNextAfterStar: 90
            }, {
                id: 5,
                showMessage: true,
                messageNr: '4',
                maxObstacles: 50,

                timeToFirst: 240,
                percentageForAsteroid: 100,

                asteroidSpeed: 150,
                pauseAfterAsteroid: 60,
                maxTimeToNextAfterAsteroid: 90,
                percentageForAsteroidGroup: 70,
                percentageForStarInAsteroidGroup: 100,
                minAsteroidGroup: 5,
                maxAsteroidGroup: 7,
                asteroidGroupSpawnPause: 20,

                starSpeed: 210,
                pauseAfterStar: 50,
                maxTimeToNextAfterStar: 90
            }, {
                id: 'last',
                showMessage: true,
                messageNr: 'last',
                maxObstacles: 100000000,

                timeToFirst: 480,
                percentageForAsteroid: 90,

                asteroidSpeed: 60,
                pauseAfterAsteroid: 10,
                maxTimeToNextAfterAsteroid: 20,

                starSpeed: 40,
                pauseAfterStar: 50,
                maxTimeToNextAfterStar: 100
            }
        ];

        this.initLevel(this.levels.shift());
    }

    LevelGenerator.prototype.initLevel = function (level) {
        if (level.showMessage) {
            this.drawHelper.showWaveMessage(level.messageNr);
        }

        this.level = level;

        if (this.is30fps) {
            Object.keys(this.level).forEach(function (key) {
                this.level[key] /= 2;
            }, this);
        }

        this.obstaclesCount = 0;
        this.counter = 0;
        this.nextCount = this.level.timeToFirst;
        this.asteroidGroupIsOn = false;
        this.groupCount = 0;
        this.maxGroup = 0;
        this.groupDiamond = false;
    };

    LevelGenerator.prototype.update = function () {
        if (++this.counter <= this.nextCount)
            return;

        this.counter = 0;

        if (this.asteroidGroupIsOn || range(1, 100) <= this.level.percentageForAsteroid) {

            var asteroidSpeed;
            if (this.level.minAsteroidSpeed != undefined) {
                asteroidSpeed = range(this.level.minAsteroidSpeed, this.level.maxAsteroidSpeed);
            } else {
                asteroidSpeed = this.level.asteroidSpeed;
            }

            if (!this.asteroidGroupIsOn && this.level.percentageForAsteroidGroup != undefined &&
                range(1, 100) <= this.level.percentageForAsteroidGroup) {

                this.asteroidGroupIsOn = true;
                this.groupCount = 0;
                this.maxGroup = range(this.level.minAsteroidGroup, this.level.maxAsteroidGroup);
                this.groupDiamond = range(1, 100) <= this.level.percentageForStarInAsteroidGroup;
                this.diamondAtStart = range(1, 100) <= 50;

                if (this.groupDiamond && this.diamondAtStart) {
                    this.groupDiamond = false;
                    this.drawHelper.drawRandomStar(asteroidSpeed);
                } else {
                    this.drawHelper.drawRandomAsteroid(asteroidSpeed);
                }
            } else {
                if (this.asteroidGroupIsOn && this.groupDiamond && !this.diamondAtStart &&
                    this.groupCount + 1 == this.maxGroup) {
                    this.groupDiamond = false;
                    this.drawHelper.drawRandomStar(asteroidSpeed);
                } else {
                    this.drawHelper.drawRandomAsteroid(asteroidSpeed);
                }
            }
            this.obstaclesCount++;

            if (this.asteroidGroupIsOn && ++this.groupCount < this.maxGroup) {
                this.nextCount = this.level.asteroidGroupSpawnPause;
            } else {
                this.asteroidGroupIsOn = false;
                this.nextCount = this.level.pauseAfterAsteroid + range(0, this.level.maxTimeToNextAfterAsteroid);
            }

        } else {
            this.drawHelper.drawRandomStar(this.level.starSpeed);
            this.obstaclesCount++;
            this.nextCount = this.level.pauseAfterStar + range(0, this.level.maxTimeToNextAfterStar);
        }

        if (this.obstaclesCount >= this.level.maxObstacles)
            this.initLevel(this.levels.shift());
    };

    return LevelGenerator;
})(range);
