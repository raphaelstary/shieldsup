var LevelGenerator = (function (range) {
    "use strict";

    function LevelGenerator(drawHelper, gameStats, is30fps) {
        this.drawHelper = drawHelper;
        this.gameStats = gameStats;
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
            }, { // same wave pattern again
                id: 6,
                showMessage: true,
                messageNr: '5',
                maxObstacles: 20,

                timeToFirst: 240,
                percentageForAsteroid: 80,

                asteroidSpeed: 90,
                pauseAfterAsteroid: 30,
                maxTimeToNextAfterAsteroid: 50,

                starSpeed: 90,
                pauseAfterStar: 20,
                maxTimeToNextAfterStar: 50
            }, {
                id: 7,
                showMessage: true,
                messageNr: '6',
                maxObstacles: 20,

                timeToFirst: 240,
                percentageForAsteroid: 80,

                minAsteroidSpeed: 90,
                maxAsteroidSpeed: 150,
                pauseAfterAsteroid: 20,
                maxTimeToNextAfterAsteroid: 30,

                starSpeed: 180,
                pauseAfterStar: 50,
                maxTimeToNextAfterStar: 90
            }, {
                id: 8,
                showMessage: true,
                messageNr: '7',
                maxObstacles: 40,

                timeToFirst: 240,
                percentageForAsteroid: 80,

                asteroidSpeed: 150,
                pauseAfterAsteroid: 60,
                maxTimeToNextAfterAsteroid: 90,
                percentageForAsteroidGroup: 70,
                percentageForStarInAsteroidGroup: 0,
                minAsteroidGroup: 6,
                maxAsteroidGroup: 10,
                asteroidGroupSpawnPause: 20,

                starSpeed: 180,
                pauseAfterStar: 50,
                maxTimeToNextAfterStar: 90
            }, {
                id: 9,
                showMessage: true,
                messageNr: '8',
                maxObstacles: 80,

                timeToFirst: 240,
                percentageForAsteroid: 100,

                asteroidSpeed: 120,
                pauseAfterAsteroid: 60,
                maxTimeToNextAfterAsteroid: 90,
                percentageForAsteroidGroup: 70,
                percentageForStarInAsteroidGroup: 100,
                minAsteroidGroup: 10,
                maxAsteroidGroup: 15,
                asteroidGroupSpawnPause: 20,

                starSpeed: 180,
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

        this.perfectWavesInARow = 0;
        this.wavesWithoutLifeLostInARow = 0;
    }

    LevelGenerator.prototype.initLevel = function (level) {
        if (level.showMessage) {
            this.drawHelper.showWaveMessage(level.messageNr);
        }

        this.level = level;

        if (this.is30fps) {
            [
                'timeToFirst',
                'asteroidSpeed',
                'pauseAfterAsteroid',
                'maxTimeToNextAfterAsteroid',
                'minAsteroidSpeed',
                'maxAsteroidSpeed',
                'asteroidGroupSpawnPause',
                'starSpeed',
                'pauseAfterStar',
                'maxTimeToNextAfterStar'
            ].forEach(function (key) {
                    if (this.level[key] !== undefined)
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

        this.snapshot = {
            collectedStars: this.gameStats.collectedStars,
            spawnedStars: this.gameStats.spawnedStars,
            destroyedAsteroids: this.gameStats.destroyedAsteroids,
            spawnedAsteroids: this.gameStats.spawnedAsteroids,
            livesLost: this.gameStats.livesLost
        }
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
                    this.gameStats.spawnedStars++;
                } else {
                    this.drawHelper.drawRandomAsteroid(asteroidSpeed);
                    this.gameStats.spawnedAsteroids++;
                }
            } else {
                if (this.asteroidGroupIsOn && this.groupDiamond && !this.diamondAtStart &&
                    this.groupCount + 1 == this.maxGroup) {
                    this.groupDiamond = false;
                    this.drawHelper.drawRandomStar(asteroidSpeed);
                    this.gameStats.spawnedStars++;
                } else {
                    this.drawHelper.drawRandomAsteroid(asteroidSpeed);
                    this.gameStats.spawnedAsteroids++;
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
            this.gameStats.spawnedStars++;
            this.obstaclesCount++;
            this.nextCount = this.level.pauseAfterStar + range(0, this.level.maxTimeToNextAfterStar);
        }

        if (this.obstaclesCount >= this.level.maxObstacles) {
            this.gameStats.completedWaves++;

            var spawnedStarsDelta = this.gameStats.spawnedStars - this.snapshot.spawnedStars;
            var spawnedAsteroidsDelta = this.gameStats.spawnedAsteroids - this.snapshot.spawnedAsteroids;
            var collectedStarsDelta = this.gameStats.collectedStars - this.snapshot.collectedStars;
            var destroyedAsteroidsDelta = this.gameStats.destroyedAsteroids - this.snapshot.destroyedAsteroids;

            var perfectWave = spawnedStarsDelta - collectedStarsDelta == 0 &&
                spawnedAsteroidsDelta - destroyedAsteroidsDelta == 0;
            if (perfectWave) {
                this.gameStats.perfectWaves++;
                this.perfectWavesInARow++;
                if (this.perfectWavesInARow > this.gameStats.perfectWavesInARow) {
                    this.gameStats.perfectWavesInARow = this.perfectWavesInARow;
                }
            } else {
                this.perfectWavesInARow = 0;
            }

            var livesLostDelta = this.gameStats.livesLost - this.snapshot.livesLost;

            var waveWithoutLifeLost = livesLostDelta == 0;
            if (waveWithoutLifeLost) {
                this.gameStats.wavesWithoutLifeLost++;
                this.wavesWithoutLifeLostInARow++;
                if (this.wavesWithoutLifeLostInARow > this.gameStats.wavesWithoutLifeLostInARow) {
                    this.gameStats.wavesWithoutLifeLostInARow = this.wavesWithoutLifeLostInARow;
                }
            } else {
                this.wavesWithoutLifeLostInARow = 0;
            }

            this.initLevel(this.levels.shift());
        }
    };

    return LevelGenerator;
})(range);
