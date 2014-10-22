var Stage = (function (Sprites, Drawables, Paths, Animations) {
    "use strict";

    function Stage(gfxCache, motions, motionTimer, motionHelper, spriteAnimations, spriteTimer, animations,
        animationHelper, animationTimer, propertyAnimations, renderer) {
        this.gfxCache = gfxCache;
        this.motions = motions;
        this.motionTimer = motionTimer;
        this.motionHelper = motionHelper;
        this.spriteTimer = spriteTimer;
        this.spriteAnimations = spriteAnimations;
        this.animations = animations;
        this.animationHelper = animationHelper;
        this.animationTimer = animationTimer;
        this.propertyAnimations = propertyAnimations;
        this.renderer = renderer;

        this._id = 0;
    }

    Stage.prototype.getDrawable = function (x, y, imgPathName, zIndex, alpha, rotation, scale) {
        return Drawables.getGraphic(this.gfxCache, ++this._id, x, y, imgPathName, zIndex, alpha, rotation, scale);
    };

    Stage.prototype.getDrawableText = function (x, y, zIndex, msg, size, fontFamily, color, rotation, alpha,
        maxLineLength, lineHeight) {
        return Drawables.getTxt(++this._id, x, y, zIndex, msg, size, fontFamily, color, rotation, alpha, maxLineLength,
            lineHeight);
    };

    Stage.prototype.getSprite = function (imgPathName, numberOfFrames, loop) {
        return Sprites.get(this.gfxCache, imgPathName, numberOfFrames, loop);
    };

    Stage.prototype.getPath = function (x, y, endX, endY, speed, spacingFn, loop) {
        return Paths.get(x, y, endX, endY, speed, spacingFn, loop);
    };

    Stage.prototype.getGraphic = function (imgPathName) {
        return this.gfxCache.get(imgPathName);
    };

    Stage.prototype.animateFresh = function (x, y, imgPathName, numberOfFrames, loop, zIndex, alpha, rotation, scale) {
        var sprite = this.getSprite(imgPathName, numberOfFrames, loop);
        var drawable = this.getDrawable(x, y, imgPathName, zIndex, alpha, rotation, scale);

        this.animate(drawable, sprite);

        return {
            drawable: drawable,
            sprite: sprite
        };
    };

    Stage.prototype.animate = function (drawable, sprite, callback) {
        this.spriteAnimations.animate(drawable, sprite, callback);
        this.__softAdd(drawable);
    };

    Stage.prototype.__softAdd = function (drawable) {
        if (!this.renderer.has(drawable)) {
            this.renderer.add(drawable);
        }
    };

    Stage.prototype.animateLater = function (drawableToAdd, duration, callback) {
        var extendedCallback;
        if (this.renderer.has(drawableToAdd.item)) {
            extendedCallback = callback;
        } else {
            var self = this;
            extendedCallback = function () {
                self.renderer.add(drawableToAdd.item);
                if (callback !== undefined) {
                    callback();
                }
            }
        }
        this.spriteTimer.animateLater(drawableToAdd, duration, extendedCallback);
    };

    Stage.prototype.moveFresh = function (x, y, imgName, endX, endY, speed, spacing, loop, callback, zIndex, alpha,
        rotation, scale) {
        var drawable = this.getDrawable(x, y, imgName, zIndex, alpha, rotation, scale);
        var path = this.getPath(x, y, endX, endY, speed, spacing, loop);

        this.move(drawable, path, callback);

        return {
            drawable: drawable,
            path: path
        };
    };

    Stage.prototype.moveFreshText = function (x, y, msg, size, fontFamily, color, endX, endY, speed, spacing, loop,
        callback, zIndex, alpha, rotation, maxLineLength, lineHeight) {
        var drawable = this.getDrawableText(x, y, zIndex, msg, size, fontFamily, color, rotation, alpha, maxLineLength,
            lineHeight);
        var path = this.getPath(x, y, endX, endY, speed, spacing, loop);

        this.move(drawable, path, callback);

        return {
            drawable: drawable,
            path: path
        };
    };

    Stage.prototype.moveFreshRoundTrip = function (x, y, imgName, endX, endY, speed, spacing, loopTheTrip, callbackTo,
        callbackReturn, zIndex, alpha, rotation, scale) {
        var drawable = this.getDrawable(x, y, imgName, zIndex, alpha, rotation, scale);
        var pathTo = this.getPath(x, y, endX, endY, speed, spacing);
        var pathReturn = this.getPath(endX, endY, x, y, speed, spacing);

        this.moveRoundTrip(drawable, pathTo, pathReturn, loopTheTrip, callbackTo, callbackReturn);

        return {
            drawable: drawable,
            pathTo: pathTo,
            pathReturn: pathReturn
        }
    };

    Stage.prototype.moveFreshLater = function (x, y, imgName, endX, endY, speed, spacing, delay, loop, callback,
        startedMovingCallback, zIndex, alpha, rotation, scale) {
        var drawable = this.getDrawable(x, y, imgName, zIndex, alpha, rotation, scale);
        var path = this.getPath(x, y, endX, endY, speed, spacing, loop);

        var movedItem = {item: drawable, path: path, ready: callback};
        this.moveLater(movedItem, delay, startedMovingCallback);

        return {
            drawable: drawable,
            path: path
        };
    };

    Stage.prototype.move = function (drawable, path, callback) {
        this.motions.move(drawable, path, callback);
        this.__softAdd(drawable);
    };

    Stage.prototype.moveRoundTrip = function (drawable, pathTo, pathReturn, loopTheTrip, callbackTo, callbackReturn) {
        this.motionHelper.moveRoundTrip(drawable, pathTo, pathReturn, loopTheTrip, callbackTo, callbackReturn);
        this.__softAdd(drawable);
    };

    Stage.prototype.moveLater = function (drawableToAdd, duration, callback) {
        var extendedCallback;
        if (this.renderer.has(drawableToAdd.item)) {
            extendedCallback = callback;
        } else {
            var self = this;
            extendedCallback = function () {
                self.renderer.add(drawableToAdd.item);
                if (callback !== undefined) {
                    callback();
                }
            }
        }
        this.motionTimer.moveLater(drawableToAdd, duration, extendedCallback);
    };

    Stage.prototype.drawFresh = function (x, y, imgName, zIndex, alpha, rotation, scale) {
        var drawable = this.getDrawable(x, y, imgName, zIndex, alpha, rotation, scale);
        this.draw(drawable);

        return drawable;
    };

    Stage.prototype.draw = function (drawable) {
        this.renderer.add(drawable);
    };

    Stage.prototype.drawText = function (x, y, text, size, font, color, zIndex, rotation, alpha, maxLineLength,
        lineHeight) {
        var drawable = this.getDrawableText(x, y, zIndex, text, size, font, color, rotation, alpha, maxLineLength,
            lineHeight);
        this.draw(drawable);

        return drawable;
    };

    Stage.prototype.animateAlpha = function (drawable, value, duration, easing, loop, callback) {
        this.propertyAnimations.animateAlpha(drawable, value, duration, easing, loop, callback);
    };

    Stage.prototype.animateAlphaPattern = function (drawable, valuePairs, loop) {
        this.propertyAnimations.animateAlphaPattern(drawable, valuePairs, loop);
    };

    Stage.prototype.animateRotation = function (drawable, value, duration, easing, loop, callback) {
        this.propertyAnimations.animateRotation(drawable, value, duration, easing, loop, callback);
    };

    Stage.prototype.animateRotationPattern = function (drawable, valuePairs, loop) {
        this.propertyAnimations.animateRotationPattern(drawable, valuePairs, loop);
    };

    Stage.prototype.animateScale = function (drawable, value, duration, easing, loop, callback) {
        this.propertyAnimations.animateScale(drawable, value, duration, easing, loop, callback);
    };

    Stage.prototype.animateScalePattern = function (drawable, valuePairs, loop) {
        this.propertyAnimations.animateScalePattern(drawable, valuePairs, loop);
    };

    Stage.prototype.basicAnimation = function (drawable, setter, animation, callback) {
        this.animations.animate(drawable, setter, animation, callback);
    };

    Stage.prototype.basicAnimationLater = function (drawableToAdd, duration, callback) {
        this.animationTimer.animateLater(drawableToAdd, duration, callback);
    };

    Stage.prototype.basicAnimationPattern = function (drawableWrapperList, loop) {
        this.animationHelper.animateWithKeyFrames(drawableWrapperList, loop);
    };

    Stage.prototype.getAnimation = function (startValue, endValue, speed, spacingFn, loop) {
        return Animations.get(startValue, endValue, speed, spacingFn, loop);
    };

    Stage.prototype.remove = function (drawable) {
        if (this.spriteAnimations.has(drawable)) {
            this.spriteAnimations.remove(drawable);
        }
        if (this.animations.has(drawable)) {
            this.animations.remove(drawable);
        }
        if (this.motions.has(drawable)) {
            this.motions.remove(drawable);
        }
        if (this.renderer.has(drawable)) {
            this.renderer.remove(drawable);
        }
    };

    Stage.prototype.has = function (drawable) {
        return this.renderer.has(drawable) || this.motions.has(drawable) || this.spriteAnimations.has(drawable) ||
            this.animations.has(drawable);
    };

    Stage.prototype.update = function () {
        this.renderer.draw();
        this.motionTimer.update();
        this.motions.update();
        this.spriteTimer.update();
        this.spriteAnimations.update();
        this.animationTimer.update();
        this.animations.update();
    };

    Stage.prototype.resize = function (width, height) {
        this.renderer.resize(width, height);
    };

    Stage.prototype.pause = function (drawable) {
        this.motions.pause(drawable);
    };

    Stage.prototype.play = function (drawable) {
        this.motions.play(drawable);
    };

    return Stage;
})(Sprites, Drawables, Paths, Animations);