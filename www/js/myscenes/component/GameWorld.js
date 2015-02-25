var GameWorld = (function (Object) {
    "use strict";

    var OBJECT_DESTROYED = 'object_destroyed/object_destroyed';
    var ASTEROID_EXPLOSION = 'booming_rumble';
    var SHIP_HIT = 'slamming_metal_lid';
    var STAR_EXPLOSION = 'booming_reverse_01';
    var COLLECT_STAR = 'kids_cheering';

    function GameWorld(stage, trackedAsteroids, trackedStars, scoreDisplay, collectAnimator, scoreAnimator,
        shipCollision, shieldsCollision, shipDrawable, shieldsDrawable, screenShaker, lifeDrawablesDict, endGame,
        sounds, shipHitView, shieldsHitView, livesView) {
        this.stage = stage;
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
        this.lifeDrawablesDict = lifeDrawablesDict;
        this.endGame = endGame;

        this.sounds = sounds;

        this.shipHitView = shipHitView;
        this.shieldsHitView = shieldsHitView;
        this.livesView = livesView;

        this.shieldsOn = false; //part of global game state
        this.lives = 3; //3; //part of global game state
        this.initialLives = this.lives;
        this.points = 0; //part of global game state

        this.elemHitsShieldsSprite = stage.getSprite(OBJECT_DESTROYED, 3, false);
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

                this.shieldsHitView.hit();
                (function (asteroid) {
                    self.stage.remove(asteroid);
                    self.stage.animate(asteroid, self.elemHitsShieldsSprite, function () {
                        self.stage.remove(asteroid);
                    })
                })(asteroid);
                this.shaker.startSmallShake();
                this.sounds.play(ASTEROID_EXPLOSION);
                delete this.trackedAsteroids[key];
                return;
            }

            if (needPreciseCollisionDetection(this.shipDrawable, asteroid) && this.shipCollision.isHit(asteroid)) {
                this.stage.remove(asteroid);
                delete this.trackedAsteroids[key];

                this._shipGotHit();
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
                this.sounds.play(COLLECT_STAR);
                this.collectAnimator.collectStar(this.lives);
                this.scoreAnimator.showScoredPoints(star.x, star.y);
                var score = 10;
                this.scoreDisplay.addScore(score);
                this.points += score;

                this.stage.remove(star);
                this.stage.remove(highlight);
                delete this.trackedStars[key];
                // return;
            }
        }, this);
    };

    GameWorld.prototype._shipGotHit = function () {
        var self = this;
        var currentLife = this.lives;
        self.livesView.remove(currentLife);

        if (--this.lives > 0) {
            self.sounds.play(SHIP_HIT);
            self.shipHitView.hit();
        }
    };

    function needPreciseCollisionDetection(stationaryObject, movingObstacle) {
        return stationaryObject.getCornerY() <= movingObstacle.getEndY();
    }

    return GameWorld;
})(Object);
