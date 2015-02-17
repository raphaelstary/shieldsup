var ObstaclesView = (function (Transition, range, calcScreenConst, changeCoords, changePath, Math) {
    "use strict";

    function ObstaclesView(stage, trackedAsteroids, trackedStars) {
        this.stage = stage;

        this.trackedAsteroids = trackedAsteroids;
        this.trackedStars = trackedStars;
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

        var DURATION = 15;
        this.stage.animateAlphaPattern(highlightWrapper.drawable, [
            {
                value: 1,
                duration: DURATION,
                easing: Transition.LINEAR
            }, {
                value: 0,
                duration: DURATION,
                easing: Transition.LINEAR
            }
        ], true);

        //this.stage.animateScalePattern(highlightWrapper.drawable, [
        //    {
        //        value: 1,
        //        duration: DURATION,
        //        easing: Transition.LINEAR
        //    }, {
        //        value: 0.75,
        //        duration: DURATION,
        //        easing: Transition.LINEAR
        //    }
        //], true);

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
        var asteroidPath = ASTEROID + _ + range(1, 4);

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

    return ObstaclesView;
})(Transition, range, calcScreenConst, changeCoords, changePath, Math);
