var GameWorld = (function (Object, Event) {
    "use strict";

    var OBJECT_DESTROYED = 'object_destroyed/object_destroyed';
    var ASTEROID_EXPLOSION = 'booming_rumble';
    var SHIP_HIT = 'slamming_metal_lid';
    var STAR_EXPLOSION = 'booming_reverse_01';
    var COLLECT_STAR = 'kids_cheering';

    function GameWorld(stage, events, trackedAsteroids, trackedStars, scoreDisplay, collectAnimator, scoreAnimator,
                       shipCollision, shieldsCollision, shipDrawable, shieldsDrawable, screenShaker, initialLives, endGame, sounds,
                       shipHitView, shieldsHitView, livesView, gameStats, isLowPerf) {
        this.stage = stage;
        this.events = events;
        this.trackedAsteroids = trackedAsteroids;
        this.trackedStars = trackedStars;

        this.scoreDisplay = scoreDisplay;
        this.collectAnimator = collectAnimator;
        this.scoreAnimator = scoreAnimator;

        this.shipCollision = shipCollision;
        this.shieldsCollision = shieldsCollision;

        this.shipDrawable = shipDrawable;
        this.shieldsDrawable = shieldsDrawable;

        this.shaker = screenShaker;
        this.endGame = endGame;

        this.sounds = sounds;

        this.shipHitView = shipHitView;
        this.shieldsHitView = shieldsHitView;
        this.livesView = livesView;

        this.shieldsOn = false; //part of global game state
        this.lives = initialLives; //3; //part of global game state
        this.initialLives = initialLives;
        this.points = 0; //part of global game state

        this.elemHitsShieldsSprite = stage.getSprite(OBJECT_DESTROYED, 3, false);

        this.isLowPerf = isLowPerf;
        this.gameStats = gameStats;
        this.destroyedAsteroidsInARow = 0;
        this.collectedAsteroidsInARow = 0;
        this.destroyedStarsInARow = 0;
        this.collectedStarsInARow = 0;
    }

    GameWorld.prototype.reset = function () {
        this.scoreDisplay.reset();
    };

    GameWorld.prototype.checkCollisions = function () {
        var self = this;
        Object.keys(this.trackedAsteroids).forEach(function (key) {
            var asteroid = this.trackedAsteroids[key];

            if (this.shieldsOn && needPreciseCollisionDetection(this.shieldsDrawable, asteroid) &&
                this.shieldsCollision.isHit(asteroid)) {

                // stats stuff
                this.gameStats.destroyedAsteroids++;
                this.destroyedAsteroidsInARow++;
                if (this.destroyedAsteroidsInARow > this.gameStats.destroyedAsteroidsInARow) {
                    this.gameStats.destroyedAsteroidsInARow = this.destroyedAsteroidsInARow;
                }
                this.collectedAsteroidsInARow = 0;

                this.shieldsHitView.hit();
                (function (asteroid) {
                    self.stage.remove(asteroid);
                    self.stage.animate(asteroid, self.elemHitsShieldsSprite, function () {
                        self.stage.remove(asteroid);
                    })
                })(asteroid);
                if (!this.isLowPerf)
                    this.shaker.startSmallShake();
                this.sounds.play(ASTEROID_EXPLOSION);
                delete this.trackedAsteroids[key];
                return;
            }

            if (needPreciseCollisionDetection(this.shipDrawable, asteroid) && this.shipCollision.isHit(asteroid)) {
                this.stage.remove(asteroid);
                delete this.trackedAsteroids[key];

                this._shipGotHit();
                if (!this.isLowPerf)
                    this.shaker.startBigShake();

                if (this.lives <= 0) {
                    this.endGame(this.points);
                }
                // return;
            }
        }, this);

        Object.keys(this.trackedStars).forEach(function (key) {
            var wrapper = this.trackedStars[key];
            var star = wrapper.star;
            var highlight = wrapper.highlight;

            if (this.shieldsOn && needPreciseCollisionDetection(this.shieldsDrawable, star) &&
                this.shieldsCollision.isHit(star)) {

                // stats stuff
                this.gameStats.destroyedStars++;
                this.destroyedStarsInARow++;
                if (this.destroyedStarsInARow > this.gameStats.destroyedStarsInARow) {
                    this.gameStats.destroyedStarsInARow = this.destroyedStarsInARow;
                }
                this.collectedStarsInARow = 0;

                this.shieldsHitView.hit();
                (function (star, highlight) {
                    self.stage.remove(highlight);
                    self.stage.remove(star);
                    self.stage.animate(star, self.elemHitsShieldsSprite, function () {
                        self.stage.remove(star);
                    })
                })(star, highlight);
                self.sounds.play(STAR_EXPLOSION);
                delete this.trackedStars[key];
                return;
            }

            if (needPreciseCollisionDetection(this.shipDrawable, star) && this.shipCollision.isHit(star)) {

                // stats stuff
                this.destroyedStarsInARow = 0;
                this.gameStats.collectedStars++;
                this.collectedStarsInARow++;
                if (this.collectedStarsInARow > this.gameStats.collectedStarsInARow) {
                    this.gameStats.collectedStarsInARow = this.collectedStarsInARow;
                }

                this.sounds.play(COLLECT_STAR);
                if (!this.isLowPerf)
                    this.collectAnimator.collectStar();
                this.scoreAnimator.showScoredPoints(star.x, star.y);
                var score = 10;
                this.scoreDisplay.addScore(score);
                this.points += score;

                this.stage.remove(star);
                this.stage.remove(highlight);
                delete this.trackedStars[key];
                this.events.fireSync(Event.STAR_COLLECTED);
                // return;
            }
        }, this);
    };

    GameWorld.prototype._shipGotHit = function () {
        // stats stuff
        this.destroyedAsteroidsInARow = 0;
        this.gameStats.collectedAsteroids++;
        this.collectedAsteroidsInARow++;
        if (this.collectedAsteroidsInARow > this.gameStats.collectedAsteroidsInARow) {
            this.gameStats.collectedAsteroidsInARow = this.collectedAsteroidsInARow;
        }
        this.gameStats.livesLost++;

        var currentLife = this.lives;
        this.livesView.remove(currentLife);
        if (--this.lives > 0) {
            this.sounds.play(SHIP_HIT);
            this.shipHitView.hit();
        }
        this.events.fireSync(Event.LIFE_LOST);
    };

    function needPreciseCollisionDetection(stationaryObject, movingObstacle) {
        return stationaryObject.getCornerY() <= movingObstacle.getEndY();
    }

    return GameWorld;
})(Object, Event);