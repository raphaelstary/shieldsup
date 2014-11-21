var Intro = (function ($) {
    "use strict";

    function Intro(services) {
        this.stage = services.stage;
        this.sceneStorage = services.sceneStorage;
        this.loop = services.loop;
    }

    var SPEED = 'speed';
    var BACKGROUND_STAR = 'background_star';

    var LOGO_TXT = 'RAPHAEL STARY';
    var LOGO_FONT = 'LogoFont';
    var GAME_LOGO_TXT = 'SHIELDS UP';
    var PRESENTS_TXT = 'PRESENTS';
    var GAME_FONT = 'GameFont';
    var GAME_LOGO_FONT = 'SpecialGameFont';
    var WHITE = '#fff';
    var LIGHT_GRAY = '#D3D3D3';
    var DARK_GRAY = '#A9A9A9';

    Intro.prototype.show = function (nextScene) {

        this.firstBg = [
            this.stage.drawFresh($.widthHalf, $.heightHalf, BACKGROUND_STAR, 0, undefined, 1, 0, 0.5),
            this.stage.drawFresh($.widthThird, $.heightQuarter, BACKGROUND_STAR, 0, undefined, 0.75, 0, 0.75),
            this.stage.drawFresh($.widthQuarter, $.heightTwoThird, BACKGROUND_STAR, 0, undefined, 0.5, 0, 1),
            this.stage.drawFresh($.widthThreeQuarter, $.heightThird, BACKGROUND_STAR, 0, undefined, 1, 0, 0.5),
            this.stage.drawFresh($.widthTwoThird, $.heightHalf, BACKGROUND_STAR, 0, undefined, 0.5, 0, 0.75),
            this.stage.drawFresh($.widthHalf, $.heightQuarter, BACKGROUND_STAR, 0, undefined, 0.75, 0, 1),
            this.stage.drawFresh($.widthTwoThird, $.heightThreeQuarter, BACKGROUND_STAR, 0, undefined, 1, 0, 0.5)
        ];

        var self = this;

        function updateYVelocity() {
            self.yVelocity = $.calcScreenConst(self.stage.height, 48);
        }

        function widthSevenEighth(width) {
            updateYVelocity();
            return $.calcScreenConst(width, 8, 7);
        }

        function widthSixTeenth(width) {
            updateYVelocity();
            return $.calcScreenConst(width, 16);
        }

        function widthSevenSixTeenth(width) {
            updateYVelocity();
            return $.calcScreenConst(width, 16, 7);
        }

        function minusHeightFiveSixTeenth(height) {
            updateYVelocity();
            return -$.calcScreenConst(height, 16, 5);
        }

        this.speedos = [
            this.stage.drawFresh($.widthQuarter, $.zero, SPEED, 1),
            this.stage.drawFresh(widthSevenEighth, $.changeSign($.heightTwoFifth), SPEED, 1),
            this.stage.drawFresh(widthSixTeenth, $.changeSign($.heightTwoFifth), SPEED, 1),
            this.stage.drawFresh(widthSevenSixTeenth, $.changeSign($.heightThreeFifth), SPEED, 1),
            this.stage.drawFresh(widthSixTeenth, $.changeSign($.heightFourFifth), SPEED, 1),
            this.stage.drawFresh($.widthTwoThird, minusHeightFiveSixTeenth, SPEED, 1)
        ];
        if (!this.logoDrawable)
            this.logoDrawable = {};

        this.logoDrawable.y = $.add(y, irgendwasLogo)(this.stage.height);
        this.lastY = this.logoDrawable.y;

        this.hasNotStarted = true;

        this.yVelocity = $.calcScreenConst(this.stage.height, 48);

        this.nextScene = nextScene;

        this.loop.add('z_parallax', this._parallaxUpdate.bind(this));


    };

    function font_97of480(width, height) {
        return $.calcScreenConst(height, 480, 97);
    }

    function y(height) {
        return $.height(height) + $.calcScreenConst(height, 12);
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
        this.speedos.forEach(function (speeeeeeed) {
            speeeeeeed.y += self.yVelocity;

            speeeeeeed.y -= delta * 2;

            if (speeeeeeed.y > self.stage.height + $.calcScreenConst(self.stage.getGraphic('speed').width, 2)) {
                self.stage.remove(speeeeeeed);
            }
        });

        if (this.speedos[0].y >= this.stage.height && this.hasNotStarted) {
            this.hasNotStarted = false;

            this.firstBg.forEach(function (firstBg) {
                function xBg() {
                    return firstBg.x;
                }

                function yBg(height) {
                    return firstBg.y - height;
                }

                self.stage.move(firstBg, xBg, yBg, 120, $.Transition.LINEAR, false, function () {
                    self.stage.remove(firstBg);
                }, [firstBg]);
            });

            var scrollingBackGround = [
                this.stage.moveFresh($.widthHalf, $.add($.heightHalf, $.height), BACKGROUND_STAR, $.widthHalf,
                    $.heightHalf, 120, $.Transition.LINEAR, false, undefined, undefined, 0, 1, 0, 0.5),
                this.stage.moveFresh($.widthThird, $.add($.heightQuarter, $.height), BACKGROUND_STAR, $.widthThird,
                    $.heightQuarter, 120, $.Transition.LINEAR, false, undefined, undefined, 0, 0.75, 0, 0.75),
                this.stage.moveFresh($.widthQuarter, $.add($.heightTwoThird, $.height), BACKGROUND_STAR, $.widthQuarter,
                    $.heightTwoThird, 120, $.Transition.LINEAR, false, undefined, undefined, 0, 0.5, 0, 1),
                this.stage.moveFresh($.widthThreeQuarter, $.add($.heightThird, $.height), BACKGROUND_STAR,
                    $.widthThreeQuarter, $.heightThird, 120, $.Transition.LINEAR, false, undefined, undefined, 0, 1, 0,
                    0.5),
                this.stage.moveFresh($.widthTwoThird, $.add($.heightHalf, $.height), BACKGROUND_STAR, $.widthTwoThird,
                    $.heightHalf, 120, $.Transition.LINEAR, false, undefined, undefined, 0, 0.5, 0, 0.75),
                this.stage.moveFresh($.widthHalf, $.add($.heightQuarter, $.height), BACKGROUND_STAR, $.widthHalf,
                    $.heightQuarter, 120, $.Transition.LINEAR, false, undefined, undefined, 0, 0.75, 0, 1),
                this.stage.moveFresh($.widthTwoThird, $.add($.heightThreeQuarter, $.height), BACKGROUND_STAR,
                    $.widthTwoThird, $.heightThreeQuarter, 120, $.Transition.LINEAR, false, undefined, undefined, 0, 1,
                    0, 0.5)
            ];

            this.logoDrawable = self.stage.moveFreshText($.widthHalf, $.add(y, irgendwasLogo), LOGO_TXT, font_97of480,
                LOGO_FONT, WHITE, $.widthHalf, $.subtract(yEnd, irgendwasLogo), 120, $.Transition.EASE_OUT_IN_SIN,
                false, function () {
                    self.stage.remove(self.logoDrawable);
                }).drawable;

            var presentsDrawable = self.stage.moveFreshText($.widthHalf, presentYStart, PRESENTS_TXT, $.fontSize_30,
                GAME_FONT, LIGHT_GRAY, $.widthHalf, $.add(yEnd, irgendwasLogo), 120, $.Transition.EASE_OUT_IN_SIN,
                false, function () {
                    self.stage.remove(presentsDrawable);
                }).drawable;

            var speedStripes;
            var wrapperLogo = self.stage.moveFreshTextLater($.widthHalf, y, GAME_LOGO_TXT, $.fontSize_15,
                GAME_LOGO_FONT, DARK_GRAY, $.widthHalf, logoYEnd, 120, $.Transition.EASE_OUT_QUAD, 90, false,
                function () {
                    self.next(self.nextScene, wrapperLogo.drawable, wrapperLogoHighlight.drawable, speedStripes,
                        scrollingBackGround);
                }, function () {
                    var delay = 30;
                    speedStripes = $.drawSpeedStripes(self.stage, delay);
                }, undefined, 2);

            var wrapperLogoHighlight = self.stage.moveFreshTextLater($.widthHalf, y, GAME_LOGO_TXT, $.fontSize_15,
                GAME_LOGO_FONT, WHITE, $.widthHalf, logoYEnd, 120, $.Transition.EASE_OUT_QUAD, 90, false, undefined,
                function () {
                    self.stage.animateAlphaPattern(wrapperLogoHighlight.drawable, [
                        {
                            value: 1,
                            duration: 30,
                            easing: $.Transition.LINEAR
                        }, {
                            value: 0,
                            duration: 30,
                            easing: $.Transition.LINEAR
                        }
                    ], true);
                });
        }
    };

    Intro.prototype.next = function (nextScene, logoDrawable, logoHighlightDrawable, speedStripes, backGround) {
        delete this.speedos;
        delete this.lastY;
        delete this.hasNotStarted;
        delete this.yVelocity;
        delete this.nextScene;
        delete this.firstBg;

        this.loop.remove('z_parallax');

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
    changeCoords: changeCoords,
    changePath: changePath,
    drawSpeedStripes: drawSpeedStripes,
    widthHalf: widthHalf,
    heightHalf: heightHalf,
    widthThird: widthThird,
    heightThird: heightThird,
    widthTwoThird: widthTwoThird,
    heightTwoThird: heightTwoThird,
    widthQuarter: widthQuarter,
    heightQuarter: heightQuarter,
    widthThreeQuarter: widthThreeQuarter,
    heightThreeQuarter: heightThreeQuarter,
    changeSign: changeSign,
    zero: zero,
    heightFifth: heightFifth,
    heightTwoFifth: heightTwoFifth,
    heightThreeFifth: heightThreeFifth,
    heightFourFifth: heightFourFifth,
    width: width,
    height: height,
    add: add,
    subtract: subtract,
    fontSize_15: fontSize_15,
    fontSize_30: fontSize_30
});
