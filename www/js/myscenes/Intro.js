var Intro = (function ($) {
    "use strict";

    function Intro(services) {
        this.stage = services.stage;
        this.sceneStorage = services.sceneStorage;
        this.events = services.events;
        this.sounds = services.sounds;
        this.device = services.device;
        this.timer = services.timer;
    }

    var SPEED = 'speed';
    var BACKGROUND_STAR = 'background_star';

    var LOGO_TXT = 'RAPHAEL STARY';
    var LOGO_FONT = 'LogoFont';
    var GAME_LOGO_TXT = 'SHIELDS UP';
    var PRESENTS_TXT = 'PRESENTS';
    var FONT = 'GameFont';
    var SPECIAL_FONT = 'SpecialGameFont';
    var WHITE = '#fff';
    var LIGHT_GRAY = '#D3D3D3';
    var DARK_GRAY = '#A9A9A9';

    var NAME_FLY_BY = 'electric_fly_by_01';
    var Z_INDEX_SPEEDOS = 1;
    var Z_INDEX_SCROLLING_BG = 0;

    Intro.prototype.show = function (next) {
        var devicePixelRatio = $.getDevicePixelRatio();
        this.device.width = $.Math.floor($.window.innerWidth * devicePixelRatio);
        this.device.height = $.Math.floor($.window.innerHeight * devicePixelRatio);
        this.device.cssHeight = $.window.innerHeight;
        this.device.cssWidth = $.window.innerWidth;
        this.device.devicePixelRatio = devicePixelRatio;
        this.device.forceResize();
        var self = this;
        this.timer.doLater(function () {
            self.__show(next);
        }, 6);
    };

    Intro.prototype.__show = function (nextScene) {
        this.sounds.play(NAME_FLY_BY);
        this.firstBg = $.drawBackGround(this.stage);
        this.speedos = [
            this.stage.drawFresh($.Width.QUARTER, $.zero, SPEED, Z_INDEX_SPEEDOS),
            this.stage.drawFresh($.Width.get(8, 7), $.changeSign($.Height.TWO_FIFTH), SPEED, Z_INDEX_SPEEDOS),
            this.stage.drawFresh($.Width.get(16), $.changeSign($.Height.TWO_FIFTH), SPEED, Z_INDEX_SPEEDOS),
            this.stage.drawFresh($.Width.get(16, 7), $.changeSign($.Height.THREE_FIFTH), SPEED, Z_INDEX_SPEEDOS),
            this.stage.drawFresh($.Width.get(16), $.changeSign($.Height.FOUR_FIFTH), SPEED, Z_INDEX_SPEEDOS),
            this.stage.drawFresh($.Width.TWO_THIRD, $.changeSign($.Height.get(16, 5)), SPEED, Z_INDEX_SPEEDOS)
        ];
        if (!this.logoDrawable)
            this.logoDrawable = {};

        this.logoDrawable.y = $.add(y, irgendwasLogo)(this.stage.height);
        this.lastY = this.logoDrawable.y;
        this.hasNotStarted = true;
        this.yVelocity = $.calcScreenConst(this.stage.height, 48); // todo resize
        if (this.sceneStorage.do30fps)
            this.yVelocity *= 2;
        this.nextScene = nextScene;
        this.parallaxId = this.events.subscribe($.Event.TICK_MOVE, this._parallaxUpdate.bind(this));
    };

    function font_97of480(width, height) {
        return $.calcScreenConst(height, 480, 97);
    }

    function y(height) {
        return $.Height.FULL(height) + $.calcScreenConst(height, 12);
    }

    function irgendwasLogo(height) {
        return $.calcScreenConst(height, 48, 5);
    }

    function presentYStart(height) {
        return y(height) + irgendwasLogo(height) * 2;
    }

    function yEnd(height) {
        return -$.calcScreenConst(height, 12);
    }

    function logoYEnd(height) {
        return $.calcScreenConst(height, 32, 7);
    }

    Intro.prototype._parallaxUpdate = function () {
        var delta = this.lastY - this.logoDrawable.y;
        this.lastY = this.logoDrawable.y;
        var self = this;
        if (!this.speedos)
            return;
        this.speedos.forEach(function (speeeeeeed) {
            speeeeeeed.y += self.yVelocity;

            speeeeeeed.y -= delta * 2;

            if (speeeeeeed.y > self.stage.height + speeeeeeed.getHeight()) {
                self.stage.remove(speeeeeeed);
            }
        });

        if (this.speedos[0].y >= this.stage.height && this.hasNotStarted) {
            this.hasNotStarted = false;

            var speed = 120;
            if (self.sceneStorage.do30fps)
                speed /= 2;

            this.firstBg.forEach(function (firstBg) {
                function xBg() {
                    return firstBg.x;
                }

                function yBg(height) {
                    return firstBg.y - height;
                }

                self.stage.move(firstBg, xBg, yBg, speed, $.Transition.LINEAR, false, function () {
                    self.stage.remove(firstBg);
                }, [firstBg]);
            });

            var scrollingBackGround = [
                this.stage.moveFresh($.Width.HALF, $.add($.Height.HALF, $.Height.FULL), BACKGROUND_STAR, $.Width.HALF,
                    $.Height.HALF, speed, $.Transition.LINEAR, false, undefined, undefined, Z_INDEX_SCROLLING_BG, 1, 0,
                    0.5),
                this.stage.moveFresh($.Width.THIRD, $.add($.Height.QUARTER, $.Height.FULL), BACKGROUND_STAR,
                    $.Width.THIRD, $.Height.QUARTER, speed, $.Transition.LINEAR, false, undefined, undefined,
                    Z_INDEX_SCROLLING_BG, 0.75, 0, 0.75),
                this.stage.moveFresh($.Width.QUARTER, $.add($.Height.TWO_THIRD, $.Height.FULL), BACKGROUND_STAR,
                    $.Width.QUARTER, $.Height.TWO_THIRD, speed, $.Transition.LINEAR, false, undefined, undefined,
                    Z_INDEX_SCROLLING_BG, 0.5, 0, 1),
                this.stage.moveFresh($.Width.THREE_QUARTER, $.add($.Height.THIRD, $.Height.FULL), BACKGROUND_STAR,
                    $.Width.THREE_QUARTER, $.Height.THIRD, speed, $.Transition.LINEAR, false, undefined, undefined,
                    Z_INDEX_SCROLLING_BG, 1, 0, 0.5),
                this.stage.moveFresh($.Width.TWO_THIRD, $.add($.Height.HALF, $.Height.FULL), BACKGROUND_STAR,
                    $.Width.TWO_THIRD, $.Height.HALF, speed, $.Transition.LINEAR, false, undefined, undefined,
                    Z_INDEX_SCROLLING_BG, 0.5, 0, 0.75),
                this.stage.moveFresh($.Width.HALF, $.add($.Height.QUARTER, $.Height.FULL), BACKGROUND_STAR,
                    $.Width.HALF, $.Height.QUARTER, speed, $.Transition.LINEAR, false, undefined, undefined,
                    Z_INDEX_SCROLLING_BG, 0.75, 0, 1),
                this.stage.moveFresh($.Width.TWO_THIRD, $.add($.Height.THREE_QUARTER, $.Height.FULL), BACKGROUND_STAR,
                    $.Width.TWO_THIRD, $.Height.THREE_QUARTER, speed, $.Transition.LINEAR, false, undefined, undefined,
                    Z_INDEX_SCROLLING_BG, 1, 0, 0.5)
            ];

            this.logoDrawable = self.stage.moveFreshText($.Width.HALF, $.add(y, irgendwasLogo), LOGO_TXT, font_97of480,
                LOGO_FONT, WHITE, $.Width.HALF, $.subtract(yEnd, irgendwasLogo), speed, $.Transition.EASE_OUT_IN_SIN,
                false, function () {
                    self.stage.remove(self.logoDrawable);
                }).drawable;

            var presentsDrawable = self.stage.moveFreshText($.Width.HALF, presentYStart, PRESENTS_TXT, $.Font._30, FONT,
                LIGHT_GRAY, $.Width.HALF, $.add(yEnd, irgendwasLogo), speed, $.Transition.EASE_OUT_IN_SIN, false,
                function () {
                    self.stage.remove(presentsDrawable);
                }).drawable;

            var speedStripes;
            var wrapperLogo = self.stage.moveFreshTextLater($.Width.HALF, y, GAME_LOGO_TXT, $.Font._15, SPECIAL_FONT,
                DARK_GRAY, $.Width.HALF, logoYEnd, speed, $.Transition.EASE_OUT_QUAD, 90, false, function () {
                    self.next(self.nextScene, wrapperLogo.drawable, wrapperLogoHighlight.drawable, speedStripes,
                        scrollingBackGround);
                }, function () {
                    var delay = 30;
                    speedStripes = $.drawSpeedStripes(self.stage, delay, self.sceneStorage.do30fps);
                });

            var wrapperLogoHighlight = self.stage.moveFreshTextLater($.Width.HALF, y, GAME_LOGO_TXT, $.Font._15,
                SPECIAL_FONT, WHITE, $.Width.HALF, logoYEnd, speed, $.Transition.EASE_OUT_QUAD, 90, false, undefined,
                function () {
                    var duration = 30;
                    if (self.sceneStorage.do30fps)
                        duration /= 2;
                    self.stage.animateAlphaPattern(wrapperLogoHighlight.drawable, [
                        {
                            value: 1,
                            duration: duration,
                            easing: $.Transition.LINEAR
                        }, {
                            value: 0,
                            duration: duration,
                            easing: $.Transition.LINEAR
                        }
                    ], true);
                }, undefined, 4);
        }
    };

    Intro.prototype.next = function (nextScene, logoDrawable, logoHighlightDrawable, speedStripes, backGround) {
        this.speedos.forEach(function (speeeeeeed) {
            this.stage.remove(speeeeeeed);
        }, this);

        delete this.speedos;
        delete this.lastY;
        delete this.hasNotStarted;
        delete this.yVelocity;
        delete this.nextScene;
        delete this.firstBg;
        this.events.unsubscribe(this.parallaxId);

        this.sceneStorage.logo = logoDrawable;
        this.sceneStorage.logoHighlight = logoHighlightDrawable;
        this.sceneStorage.speedStripes = speedStripes;
        this.sceneStorage.backGround = backGround;

        nextScene();
    };

    return Intro;
})({
    Transition: Transition,
    calcScreenConst: calcScreenConst,
    drawSpeedStripes: drawSpeedStripes,
    changeSign: changeSign,
    zero: zero,
    add: add,
    subtract: subtract,
    drawBackGround: drawBackGround,
    Font: Font,
    Height: Height,
    Width: Width,
    Event: Event,
    window: window,
    getDevicePixelRatio: getDevicePixelRatio,
    Math: Math
});