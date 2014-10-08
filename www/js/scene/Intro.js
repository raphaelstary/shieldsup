var Intro = (function (Transition, calcScreenConst, changeCoords, changePath, SpeedStripesHelper) {
    "use strict";

    function Intro(stage, sceneStorage, gameLoop, resizeBus) {
        this.stage = stage;
        this.sceneStorage = sceneStorage;
        this.gameLoop = gameLoop;
        this.resizeBus = resizeBus;
    }

    var SPEED = 'speed';
    var BACKGROUND_STAR = 'background_star';

    var LOGO_TXT = 'RAPHAEL STARY';
    var LOGO_FONT = 'LogoFont';
    var GAME_LOGO_TXT = 'SHIELDS UP';
    var PRESENTS_TXT = 'PRESENTS';
    var GAME_LOGO_FONT = 'KenPixelBlocks';
    var WHITE = '#fff';
    var LIGHT_GRAY = '#D3D3D3';
    var DARK_GRAY = '#A9A9A9';

    Intro.prototype._createDrawables = function (screenWidth, screenHeight) {
        var drawableStorage = {};

        var screenWidthHalf = calcScreenConst(screenWidth, 2);
        var screenHeightHalf = calcScreenConst(screenHeight, 2);
        var screenWidthThird = calcScreenConst(screenWidth, 3);
        var screenHeightThird = calcScreenConst(screenHeight, 3);
        var screenWidthTwoThird = calcScreenConst(screenWidth, 3, 2);
        var screenHeightTwoThird = calcScreenConst(screenHeight, 3, 2);
        var screenWidthQuarter = calcScreenConst(screenWidth, 4);
        var screenHeightQuarter = calcScreenConst(screenHeight, 4);
        var screenWidthThreeQuarter = calcScreenConst(screenWidth, 4, 3);
        var screenHeightThreeQuarter = calcScreenConst(screenHeight, 4, 3);

        drawableStorage.firstBg = [
            this.stage.drawFresh(screenWidthHalf, screenHeightHalf, BACKGROUND_STAR, 0, 1, 0, 0.5),
            this.stage.drawFresh(screenWidthThird, screenHeightQuarter, BACKGROUND_STAR, 0, 0.75, 0, 0.75),
            this.stage.drawFresh(screenWidthQuarter, screenHeightTwoThird, BACKGROUND_STAR, 0, 0.5, 0, 1),
            this.stage.drawFresh(screenWidthThreeQuarter, screenHeightThird, BACKGROUND_STAR, 0, 1, 0, 0.5),
            this.stage.drawFresh(screenWidthTwoThird, screenHeightHalf, BACKGROUND_STAR, 0, 0.5, 0, 0.75),
            this.stage.drawFresh(screenWidthHalf, screenHeightQuarter, BACKGROUND_STAR, 0, 0.75, 0, 1),
            this.stage.drawFresh(screenWidthTwoThird, screenHeightThreeQuarter, BACKGROUND_STAR, 0, 1, 0, 0.5)
        ];

        drawableStorage.scrollingBackGround = [
            this.stage.drawFresh(screenWidthHalf, screenHeightHalf + screenHeight, BACKGROUND_STAR, 0, 1, 0, 0.5),
            this.stage.drawFresh(screenWidthThird, screenHeightQuarter + screenHeight, BACKGROUND_STAR, 0, 0.75, 0, 0.75),
            this.stage.drawFresh(screenWidthQuarter, screenHeightTwoThird + screenHeight, BACKGROUND_STAR, 0, 0.5, 0, 1),
            this.stage.drawFresh(screenWidthThreeQuarter, screenHeightThird + screenHeight, BACKGROUND_STAR, 0, 1, 0, 0.5),
            this.stage.drawFresh(screenWidthTwoThird, screenHeightHalf + screenHeight, BACKGROUND_STAR, 0, 0.5, 0, 0.75),
            this.stage.drawFresh(screenWidthHalf, screenHeightQuarter + screenHeight, BACKGROUND_STAR, 0, 0.75, 0, 1),
            this.stage.drawFresh(screenWidthTwoThird, screenHeightThreeQuarter + screenHeight, BACKGROUND_STAR, 0, 1, 0, 0.5)
        ];

        var speedY = 0; // 600

        drawableStorage.speedDrawableOne = this.stage.getDrawable(calcScreenConst(screenWidth, 4), speedY, SPEED, 1);
        drawableStorage.speedDrawableTwo = this.stage.getDrawable(calcScreenConst(screenWidth, 8, 7),
                speedY - calcScreenConst(screenHeight, 5), SPEED, 1);
        drawableStorage.speedDrawableThree = this.stage.getDrawable(calcScreenConst(screenWidth, 16),
                speedY - calcScreenConst(screenHeight, 5, 2), SPEED, 1);
        drawableStorage.speedDrawableFour = this.stage.getDrawable(calcScreenConst(screenWidth, 16, 7),
                speedY - calcScreenConst(screenHeight, 5, 3), SPEED, 1);
        drawableStorage.speedDrawableFive = this.stage.getDrawable(calcScreenConst(screenWidth, 16),
                speedY - calcScreenConst(screenHeight, 5, 4), SPEED, 1);
        drawableStorage.speedDrawableSix = this.stage.getDrawable(calcScreenConst(screenWidth, 3, 2),
                speedY - calcScreenConst(screenHeight, 16, 5), SPEED, 1);

        var irgendwas = calcScreenConst(screenHeight, 12);
        var x = screenWidthHalf,
            y = screenHeight + irgendwas;

        var irgendwasLogo = calcScreenConst(screenHeight, 48, 5);


        drawableStorage.logoDrawable = this.stage.getDrawableText(x, y + irgendwasLogo, 2, LOGO_TXT,
            calcScreenConst(screenHeight, 480, 97), LOGO_FONT, WHITE);

        drawableStorage.presentsDrawable = this.stage.getDrawableText(x, y, 2, PRESENTS_TXT,
            calcScreenConst(screenHeight, 480, 22), GAME_LOGO_FONT, LIGHT_GRAY);

        drawableStorage.gameLogoDrawable = this.stage.getDrawableText(x, y, 2, GAME_LOGO_TXT,
            calcScreenConst(screenHeight, 480, 34), GAME_LOGO_FONT, DARK_GRAY);
        drawableStorage.gameLogoDrawableHighlight = this.stage.getDrawableText(x, y, 3, GAME_LOGO_TXT,
            calcScreenConst(screenHeight, 480, 34), GAME_LOGO_FONT, WHITE, 0, 0);

        return drawableStorage;
    };

    Intro.prototype._resizeDrawables = function (screenWidth, screenHeight, drawableStorage) {

        var screenWidthHalf = calcScreenConst(screenWidth, 2);
        var screenHeightHalf = calcScreenConst(screenHeight, 2);
        var screenWidthThird = calcScreenConst(screenWidth, 3);
        var screenHeightThird = calcScreenConst(screenHeight, 3);
        var screenWidthTwoThird = calcScreenConst(screenWidth, 3, 2);
        var screenHeightTwoThird = calcScreenConst(screenHeight, 3, 2);
        var screenWidthQuarter = calcScreenConst(screenWidth, 4);
        var screenHeightQuarter = calcScreenConst(screenHeight, 4);
        var screenWidthThreeQuarter = calcScreenConst(screenWidth, 4, 3);
        var screenHeightThreeQuarter = calcScreenConst(screenHeight, 4, 3);

        changeCoords(drawableStorage.firstBg[0], screenWidthHalf, screenHeightHalf);
        changeCoords(drawableStorage.firstBg[1], screenWidthThird, screenHeightQuarter);
        changeCoords(drawableStorage.firstBg[2], screenWidthQuarter, screenHeightTwoThird);
        changeCoords(drawableStorage.firstBg[3], screenWidthThreeQuarter, screenHeightThird);
        changeCoords(drawableStorage.firstBg[4], screenWidthTwoThird, screenHeightHalf);
        changeCoords(drawableStorage.firstBg[5], screenWidthHalf, screenHeightQuarter);
        changeCoords(drawableStorage.firstBg[6], screenWidthTwoThird, screenHeightThreeQuarter);

        if (this.backGroundHasNewPosition) {
            changeCoords(drawableStorage.scrollingBackGround[0], screenWidthHalf, screenHeightHalf);
            changeCoords(drawableStorage.scrollingBackGround[1], screenWidthThird, screenHeightQuarter);
            changeCoords(drawableStorage.scrollingBackGround[2], screenWidthQuarter, screenHeightTwoThird);
            changeCoords(drawableStorage.scrollingBackGround[3], screenWidthThreeQuarter, screenHeightThird);
            changeCoords(drawableStorage.scrollingBackGround[4], screenWidthTwoThird, screenHeightHalf);
            changeCoords(drawableStorage.scrollingBackGround[5], screenWidthHalf, screenHeightQuarter);
            changeCoords(drawableStorage.scrollingBackGround[6], screenWidthTwoThird, screenHeightThreeQuarter);

        } else {
            changeCoords(drawableStorage.scrollingBackGround[0], screenWidthHalf, screenHeightHalf + screenHeight);
            changeCoords(drawableStorage.scrollingBackGround[1], screenWidthThird, screenHeightQuarter + screenHeight);
            changeCoords(drawableStorage.scrollingBackGround[2], screenWidthQuarter, screenHeightTwoThird + screenHeight);
            changeCoords(drawableStorage.scrollingBackGround[3], screenWidthThreeQuarter, screenHeightThird + screenHeight);
            changeCoords(drawableStorage.scrollingBackGround[4], screenWidthTwoThird, screenHeightHalf + screenHeight);
            changeCoords(drawableStorage.scrollingBackGround[5], screenWidthHalf, screenHeightQuarter + screenHeight);
            changeCoords(drawableStorage.scrollingBackGround[6], screenWidthTwoThird, screenHeightThreeQuarter + screenHeight);
        }

        var speedY = 0; // 600
        changeCoords(drawableStorage.speedDrawableOne, calcScreenConst(screenWidth, 4), speedY);
        changeCoords(drawableStorage.speedDrawableTwo, calcScreenConst(screenWidth, 8, 7),
                speedY - calcScreenConst(screenHeight, 5));
        changeCoords(drawableStorage.speedDrawableThree, calcScreenConst(screenWidth, 16),
                speedY - calcScreenConst(screenHeight, 5, 2));
        changeCoords(drawableStorage.speedDrawableFour, calcScreenConst(screenWidth, 16, 7),
                speedY - calcScreenConst(screenHeight, 5, 3));
        changeCoords(drawableStorage.speedDrawableFive, calcScreenConst(screenWidth, 16),
                speedY - calcScreenConst(screenHeight, 5, 4));
        changeCoords(drawableStorage.speedDrawableSix, calcScreenConst(screenWidth, 3, 2),
                speedY - calcScreenConst(screenHeight, 16, 5));

        var irgendwas = calcScreenConst(screenHeight, 12);
        var x = screenWidthHalf,
            y = screenHeight + irgendwas;

        var irgendwasLogo = calcScreenConst(screenHeight, 48, 5);

        changeCoords(drawableStorage.logoDrawable, x, y + irgendwasLogo);

        changeCoords(drawableStorage.presentsDrawable, x, y);
        changeCoords(drawableStorage.gameLogoDrawable, x, y);
        changeCoords(drawableStorage.gameLogoDrawableHighlight, x, y);

        drawableStorage.logoDrawable.txt.size = calcScreenConst(screenHeight, 480, 97);
        drawableStorage.presentsDrawable.txt.size = calcScreenConst(screenHeight, 480, 22);
        drawableStorage.gameLogoDrawable.txt.size = calcScreenConst(screenHeight, 480, 34);
        drawableStorage.gameLogoDrawableHighlight.txt.size = calcScreenConst(screenHeight, 480, 34);
    };

    Intro.prototype._createMotion = function (screenWidth, screenHeight) {
        var motionStorage = {};

        var screenWidthHalf = calcScreenConst(screenWidth, 2);
        var screenHeightHalf = calcScreenConst(screenHeight, 2);
        var self = this;
        motionStorage.firstBgPath = [];
        this.drawableStorage.firstBg.forEach(function (firstBg) {
            motionStorage.firstBgPath.push(self.stage.getPath(firstBg.x, firstBg.y,
                firstBg.x, firstBg.y - screenHeight, 120, Transition.LINEAR))
        });

        motionStorage.scrollingBgPath = [];
        this.drawableStorage.scrollingBackGround.forEach(function (scrollingBackGround) {
            motionStorage.scrollingBgPath.push(self.stage.getPath(scrollingBackGround.x,
                scrollingBackGround.y, scrollingBackGround.x, scrollingBackGround.y - screenHeight, 120,
                Transition.LINEAR));
        });

        var irgendwas = calcScreenConst(screenHeight, 12);
        var x = screenWidthHalf,
            y = screenHeight + irgendwas,
            yEnd = - irgendwas;

        var irgendwasLogo = calcScreenConst(screenHeight, 48, 5);
        var irgendwasPresents = irgendwasLogo * 2;

        var logoYEnd = calcScreenConst(screenHeight, 32, 7);

        motionStorage.logoDrawablePath = this.stage.getPath(x, y + irgendwasLogo, x, yEnd - irgendwasLogo, 120,
            Transition.EASE_OUT_IN_SIN);

        motionStorage.presentsPath = this.stage.getPath(x, y + irgendwasPresents, x, yEnd + irgendwasLogo, 120,
            Transition.EASE_OUT_IN_SIN);

        motionStorage.logoInPath = this.stage.getPath(x, y, x, logoYEnd, 120, Transition.EASE_OUT_QUAD);

        return motionStorage;
    };

    Intro.prototype._resizeMotion = function (screenWidth, screenHeight, motionStorage) {
        var screenWidthHalf = calcScreenConst(screenWidth, 2);
        var screenHeightHalf = calcScreenConst(screenHeight, 2);

        changePath(motionStorage.firstBgPath ,screenWidthHalf, screenHeightHalf,
            screenWidthHalf, screenHeightHalf - screenHeight);

        changePath(motionStorage.scrollingBgPath ,screenWidthHalf,
                screenHeightHalf + screenHeight, screenWidthHalf,
            screenHeightHalf);

        this.drawableStorage.firstBg.forEach(function (firstBg, i) {
            changePath(motionStorage.firstBgPath[i], firstBg.x, firstBg.y, firstBg.x, firstBg.y - screenHeight);
        });

        this.drawableStorage.scrollingBackGround.forEach(function (scrollingBackGround, i) {
            changePath(motionStorage.scrollingBgPath[i], scrollingBackGround.x, scrollingBackGround.y + screenHeight,
                scrollingBackGround.x, scrollingBackGround.y);
        });

        var irgendwas = calcScreenConst(screenHeight, 12);
        var x = screenWidthHalf,
            y = screenHeight + irgendwas,
            yEnd = - irgendwas;

        var irgendwasLogo = calcScreenConst(screenHeight, 48, 5);
        var irgendwasPresents = irgendwasLogo * 2;

        var logoYEnd = calcScreenConst(screenHeight, 32, 7);

        changePath(motionStorage.logoDrawablePath, x, y + irgendwasLogo, x, yEnd - irgendwasLogo);

        changePath(motionStorage.presentsPath, x, y + irgendwasPresents, x, yEnd + irgendwasLogo);

        changePath(motionStorage.logoInPath, x, y, x, logoYEnd);
    };

    Intro.prototype.show = function (nextScene, screenWidth, screenHeight) {
        this.resizeBus.add('intro_scene', this.resize.bind(this));

        this.drawableStorage = this._createDrawables(screenWidth, screenHeight);
        this.motionStorage = this._createMotion(screenWidth, screenHeight);

        var self = this;
        var speedos = [this.drawableStorage.speedDrawableOne, this.drawableStorage.speedDrawableTwo,
            this.drawableStorage.speedDrawableThree, this.drawableStorage.speedDrawableFour,
            this.drawableStorage.speedDrawableFive, this.drawableStorage.speedDrawableSix];

        speedos.forEach(function (speeeed) {
            self.stage.draw(speeeed);
        });

        this.speedos = speedos;
        this.lastY = this.drawableStorage.logoDrawable.y;
        this.hasNotStarted = true;
        this.yVelocity = calcScreenConst(screenHeight, 48);
        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;
        this.nextScene = nextScene;

        this.gameLoop.add('z_parallax', this._parallaxUpdate.bind(this));


    };

    Intro.prototype._parallaxUpdate = function () {
        var delta = this.lastY - this.drawableStorage.logoDrawable.y;
        this.lastY = this.drawableStorage.logoDrawable.y;
        var self = this;
        this.speedos.forEach(function (speeeeeeed) {
            speeeeeeed.y += self.yVelocity;

            speeeeeeed.y -= delta * 2;

            if (speeeeeeed.y > 600) {
                self.stage.remove(speeeeeeed);
            }
        });

        if (this.drawableStorage.speedDrawableOne.y >= this.screenHeight && this.hasNotStarted) {
            this.hasNotStarted = false;

            this.drawableStorage.firstBg.forEach(function (firstBg, i) {
                self.stage.move(firstBg, self.motionStorage.firstBgPath[i], function () {
                    self.stage.remove(firstBg);
                });
            });
            this.drawableStorage.scrollingBackGround.forEach(function (scrollingBackGround, i) {
                self.stage.move(scrollingBackGround, self.motionStorage.scrollingBgPath[i], function () {
                    self.backGroundHasNewPosition = true;
                });
            });
            self.stage.move(this.drawableStorage.logoDrawable, this.motionStorage.logoDrawablePath, function () {
                self.stage.remove(self.drawableStorage.logoDrawable);
            });

            self.stage.move(this.drawableStorage.presentsDrawable, this.motionStorage.presentsPath, function () {
                self.stage.remove(self.drawableStorage.presentsDrawable);
            });

            var speedStripes;
            self.stage.moveLater({item: this.drawableStorage.gameLogoDrawable, path: this.motionStorage.logoInPath,
                ready: function () {

                    self.next(self.nextScene, self.drawableStorage.gameLogoDrawable, speedStripes,
                        self.drawableStorage.scrollingBackGround);

                }}, 90, function () {
                var delay = 30;
                speedStripes = SpeedStripesHelper.draw(self.stage, delay, self.screenWidth, self.screenHeight);
            });
            self.stage.moveLater({item: this.drawableStorage.gameLogoDrawableHighlight,
                path: this.motionStorage.logoInPath}, 90, function () {
                self.stage.animateAlphaPattern(self.drawableStorage.gameLogoDrawableHighlight,
                    [{value: 1, duration: 30, easing: Transition.LINEAR}, {value: 0, duration: 30, easing: Transition.LINEAR}],
                    true);
            });
        }
    };

    Intro.prototype.resize = function (width, height) {
        this.yVelocity = calcScreenConst(height, 48);
        this.screenWidth = width;
        this.screenHeight = height;

        this._resizeDrawables(width, height, this.drawableStorage);
        this._resizeMotion(width, height, this.motionStorage);
    };

    Intro.prototype.next = function (nextScene, logoDrawable, speedStripes, backGround) {
        delete this.speedos;
        delete this.lastY;
        delete this.hasNotStarted;
        delete this.yVelocity;
        delete this.screenWidth;
        delete this.screenHeight;
        delete this.nextScene;
        delete this.backGroundHasNewPosition;

        delete this.drawableStorage;
        delete this.motionStorage;

        this.resizeBus.remove('intro_scene');
        this.gameLoop.remove('z_parallax');

        this.sceneStorage.logo = logoDrawable;
        this.sceneStorage.speedStripes = speedStripes;
        this.sceneStorage.backGround = backGround;

        nextScene();
    };

    return Intro;
})(Transition, calcScreenConst, changeCoords, changePath, SpeedStripesHelper);
