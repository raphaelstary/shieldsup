var ObstaclesView = (function (Transition, range, calcScreenConst, changeCoords, changePath, Math, changeSign, Width,
    Height, Font, multiply) {
    "use strict";

    function ObstaclesView(stage, trackedAsteroids, trackedStars, messages, is30fps) {
        this.stage = stage;
        this.messages = messages;

        this.trackedAsteroids = trackedAsteroids;
        this.trackedStars = trackedStars;

        this.is30fps = is30fps;
    }

    var STAR = 'star';
    var STAR_WHITE = 'star_white';
    var ASTEROID = 'asteroid';
    var _ = '_';
    var SHIP = 'ship';
    var Z_INDEX = 4;

    ObstaclesView.prototype.drawStar = function (rotation, xFn, speed) {
        var self = this;

        function getStartY() {
            return -calcScreenConst(self.stage.getImageHeight(STAR), 2);
        }

        function getEndY(height) {
            return height + Math.abs(getStartY());
        }

        function moveStar(img, zIndex, alpha, scale) {
            return self.stage.moveFresh(xFn, getStartY, img, xFn, getEndY, speed, Transition.LINEAR, false, undefined,
                undefined, zIndex, alpha, rotation, scale);
        }

        var starWrapper = moveStar(STAR, Z_INDEX, 1, 0.75);
        var highlightWrapper = moveStar(STAR_WHITE, Z_INDEX + 1, 0, 1);

        var DURATION = this.is30fps ? 7 : 15;
        this.stage.animateAlphaPattern(highlightWrapper.drawable, [
            {
                value: 0.8,
                duration: DURATION,
                easing: Transition.EASE_IN_QUAD
            }, {
                value: 0,
                duration: DURATION,
                easing: Transition.EASE_OUT_QUAD
            }
        ], true);

        this.stage.animateScalePattern(starWrapper.drawable, [
            {
                value: 1,
                duration: DURATION,
                easing: Transition.LINEAR
            }, {
                value: 0.75,
                duration: DURATION,
                easing: Transition.LINEAR
            }
        ], true);


        this.trackedStars[starWrapper.drawable.id] = {
            star: starWrapper.drawable,
            highlight: highlightWrapper.drawable
        };

        return {
            star: starWrapper,
            highlight: highlightWrapper
        };
    };

    ObstaclesView.prototype._getStarStartRange = function () {
        var singleStarWidth = this.stage.getImageWidth(STAR);
        var shipWidth = this.stage.getImageWidth(SHIP);

        return function (width) {
            return calcScreenConst(width + shipWidth, 2) - singleStarWidth;
        }
    };

    ObstaclesView.prototype._getStarEndRange = function (startRange) {
        return function (width) {
            return width - startRange(width);
        };
    };

    ObstaclesView.prototype.drawRandomStar = function (speed) {
        var startRangeFn = this._getStarStartRange();
        var endRangeFn = this._getStarEndRange(startRangeFn);
        var relativePosition = range(0, 100);

        function getX(width) {
            var start = startRangeFn(width);
            var length = endRangeFn(width) - start;
            return start + calcScreenConst(length, 100, relativePosition);
        }

        return this.drawStar(range(0, 2 * Math.PI), getX, speed);
    };

    ObstaclesView.prototype.drawAsteroid = function (imgName, xFn, speed) {
        var self = this;

        function getStartY() {
            return -calcScreenConst(self.stage.getImageHeight(imgName), 2);
        }

        function getEndY(height) {
            return height + Math.abs(getStartY());
        }

        var asteroidWrapper = this.stage.moveFresh(xFn, getStartY, imgName, xFn, getEndY, speed, Transition.LINEAR,
            undefined, undefined, undefined, Z_INDEX + 1);
        this.trackedAsteroids[asteroidWrapper.drawable.id] = asteroidWrapper.drawable;

        return asteroidWrapper;
    };

    ObstaclesView.prototype.drawRandomAsteroid = function (speed) {
        var asteroidPath = ASTEROID + _ + range(1, 3);

        var startRangeFn = this._getAsteroidStartRange(asteroidPath);
        var endRangeFn = this._getAsteroidEndRange(startRangeFn);
        var relativePosition = range(0, 100);

        function getX(width) {
            var start = startRangeFn(width);
            var length = endRangeFn(width) - start;
            return start + calcScreenConst(length, 100, relativePosition);
        }

        return this.drawAsteroid(asteroidPath, getX, speed);
    };

    ObstaclesView.prototype._getAsteroidStartRange = function (asteroidPath) {
        var asteroidWidth = this.stage.getImageWidth(asteroidPath);
        var shipWidth = this.stage.getImageWidth('ship');

        return function (width) {
            return calcScreenConst(width + shipWidth, 2) - asteroidWidth;
        }
    };

    ObstaclesView.prototype._getAsteroidEndRange = function (startRange) {
        return function (width) {
            return width - startRange(width);
        }
    };

    var KEY = 'obstacles_view';
    var WAVE = 'wave';
    var FONT = 'GameFont';
    var LIGHT_GRAY = '#D3D3D3';

    ObstaclesView.prototype.showWaveMessage = function (numberString) {
        var self = this;
        var speed = this.is30fps ? 90 : 180;
        var delay = this.is30fps ? 45 : 90;
        var msg = self.messages.get(KEY, WAVE) + " " + numberString;
        var waveWrapper = self.stage.moveFreshTextLater(changeSign(Width.FULL), Height.THIRD, msg, Font._15, FONT,
            LIGHT_GRAY, multiply(Width.FULL, 2), Height.THIRD, speed, Transition.EASE_OUT_IN_SIN, delay, false,
            function () {
                self.stage.remove(waveWrapper.drawable);
            }, undefined, undefined, 5);
    };

    return ObstaclesView;
})(Transition, range, calcScreenConst, changeCoords, changePath, Math, changeSign, Width, Height, Font, multiply);