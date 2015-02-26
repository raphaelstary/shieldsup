var LevelGenerator = (function (range) {
    "use strict";

    function LevelGenerator(drawHelper, is30fps) {
        this.drawHelper = drawHelper;
        this.is30fps = is30fps;

        this.levels = [
            {
                id: 0,
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
                maxObstacles: 10,

                timeToFirst: 240,
                percentageForAsteroid: 90,

                asteroidSpeed: 120,
                pauseAfterAsteroid: 30,
                maxTimeToNextAfterAsteroid: 50,

                starSpeed: 120,
                pauseAfterStar: 20,
                maxTimeToNextAfterStar: 50
            }, {
                id: 'last',
                maxObstacles: 10,

                timeToFirst: 480,
                percentageForAsteroid: 90,

                asteroidSpeed: 60,
                pauseAfterAsteroid: 10,
                maxTimeToNextAfterAsteroid: 40,

                starSpeed: 40,
                pauseAfterStar: 50,
                maxTimeToNextAfterStar: 100
            }
        ];

        this.initLevel(this.levels.shift());
    }

    LevelGenerator.prototype.initLevel = function (level) {
        this.level = level;

        if (this.is30fps) {
            Object.keys(this.level).forEach(function (key) {
                this.level[key] /= 2;
            }, this);
        }

        this.obstaclesCount = 0;
        this.counter = 0;
        this.nextCount = this.level.timeToFirst;
    };

    LevelGenerator.prototype.update = function () {
        if (++this.counter <= this.nextCount)
            return;

        this.counter = 0;

        if (range(1, 100) <= this.level.percentageForAsteroid) {
            this.drawHelper.drawRandomAsteroid(this.level.asteroidSpeed);
            this.obstaclesCount++;
            this.nextCount = this.level.pauseAfterAsteroid + range(0, this.level.maxTimeToNextAfterAsteroid);
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
