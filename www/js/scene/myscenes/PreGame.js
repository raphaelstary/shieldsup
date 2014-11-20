var PreGame = (function (Transition, Credits, window, calcScreenConst, drawSharedGameStuff, changeCoords, changePath,
    changeTouchable, ButtonFactory) {
    "use strict";

    function PreGame(services) {
        this.stage = services.stage;
        this.sceneStorage = services.sceneStorage;
        this.tap = services.tap;
        this.fullScreen = services.fullScreen;
        this.messages = services.messages;
        this.sounds = services.sounds;

        this.buttons = new ButtonFactory(this.stage, this.tap, services.timer, GAME_FONT, function () {
            services.sounds.play(CLICK);
        }, WHITE, VIOLET, WHITE, WHITE)
    }

    var SHIP = 'ship';
    var FIRE = 'fire/fire';
    var SHIELDS = 'shields';
    var SHIELDS_DOWN = 'shields_down/shields_down';
    var SHIELDS_UP = 'shields_up/shields_up';

    var CLICK = 'click';

    var PRE_GAME_MSG_KEY = 'pre_game';
    var CREDITS_MSG = 'credits';
    var PLAY_MSG = 'play';

    var GAME_FONT = 'GameFont';
    var WHITE = '#fff';
    var BLACK = '#000';
    var VIOLET = '#3a2e3f';

    PreGame.prototype.show = function (nextScene) {
        var logoDrawable = this.sceneStorage.logo;
        delete this.sceneStorage.logo;

        this.fadeOffSet = false;

        var self = this;

        function getFadeOffSet(width) {
            if (self.fadeOffSet)
                return -width;
            return 0;
        }

        function getWidthHalf(width) {
            return calcScreenConst(width, 2) + getFadeOffSet(width);
        }

        function getShipStartY(height) {
            return calcScreenConst(self.stage.getGraphic(SHIP).height, 2) + height;
        }

        function getShipX(width) {
            return getWidthHalf(width);
        }

        function getShipEndY(height) {
            return calcScreenConst(height, 2);
        }

        var shipDrawable = self.stage.moveFresh(getShipX, getShipStartY, SHIP, getShipX, getShipEndY, 60,
            Transition.EASE_IN_QUAD, false, shipIsAtEndPosition).drawable;

        function getLeftFireX() {
            return shipDrawable.x - calcScreenConst(shipDrawable.getWidth(), 5);
        }

        function getRightFireX() {
            return shipDrawable.x + calcScreenConst(shipDrawable.getWidth(), 5);
        }

        function getFireStartY(height) {
            return getShipStartY(height) + calcScreenConst(shipDrawable.getHeight(), 8, 5);
        }

        function getFireEndY(height) {
            return getShipEndY(height) + calcScreenConst(shipDrawable.getHeight(), 8, 5);
        }

        var leftFireDrawable = self.stage.animateFresh(getLeftFireX, getFireStartY, FIRE, 10, true,
            [shipDrawable]).drawable;
        var rightFireDrawable = self.stage.animateFresh(getRightFireX, getFireStartY, FIRE, 10, true,
            [shipDrawable]).drawable;

        self.stage.move(leftFireDrawable, getLeftFireX, getFireEndY, 60, Transition.EASE_IN_QUAD, false, undefined,
            [shipDrawable]);
        self.stage.move(rightFireDrawable, getRightFireX, getFireEndY, 60, Transition.EASE_IN_QUAD, false, undefined,
            [shipDrawable]);

        var pressPlay, pressPlayTxt, credits, creditsButton;

        function shipIsAtEndPosition() {


            function createPlayButton() {
                function getPlayY(height) {
                    return calcScreenConst(height, 4, 3);
                }

                function getPlayTxtSize(width, height) {
                    return calcScreenConst(height, 24);
                }

                var newWrapper = self.buttons.createPrimaryButton(getShipX, getPlayY,
                    self.messages.get(PRE_GAME_MSG_KEY, PLAY_MSG), getPlayTxtSize, startPlaying);

                pressPlayTxt = newWrapper.text;
            }

            createPlayButton();

            shieldsAnimation();

            function getBottomY(height) {
                return calcScreenConst(height, 50, 47);
            }

            function getButtonX(width) {
                return calcScreenConst(width, 4, 3) + getFadeOffSet(width);
            }

            function getCreditsSize(width, height) {
                return 15;
            }

            credits = self.stage.drawText(getButtonX, getBottomY, self.messages.get(PRE_GAME_MSG_KEY, CREDITS_MSG),
                getCreditsSize, GAME_FONT, WHITE, 3, undefined, undefined, 0.5);

            function getCreditsButtonWidth(width) {
                return credits.getWidth();
            }

            function getCreditsButtonHeight(height) {
                return credits.getHeight();
            }

            function getCreditsLineWidth(width, height) {
                return 1;
            }

            var creditsButtonWrapper = self.stage.drawRectangleWithInput(getButtonX, getBottomY, getCreditsButtonWidth,
                getCreditsButtonHeight, WHITE, false, getCreditsLineWidth, 2, 0.5, undefined, undefined, [credits]);

            creditsButton = creditsButtonWrapper.drawable;

            function goToCreditsScreen() {

                var creditsScreen = new Credits(self.stage, self.tap, self.messages, self.sounds);

                unRegisterTapListener();

                function continuePreGame() {
                    self.fadeOffSet = false;
                    registerTapListener();
                    doTheShields = true;
                    shieldsAnimation();

                }

                function setFadeOffSet() {
                    self.fadeOffSet = true;
                }

                doTheShields = false;
                self.stage.remove(shieldsDrawable);
                creditsScreen.show(continuePreGame, [
                    credits,
                    creditsButton,
                    pressPlay,
                    pressPlayTxt,
                    logoDrawable,
                    shipDrawable,
                    leftFireDrawable,
                    rightFireDrawable
                ], self.screenWidth, self.screenHeight, setFadeOffSet);
            }
        }

        function startPlaying() {
            self.sounds.play(CLICK);

            pressPlay.data = self.stage.getGraphic(BUTTON_PRIM_ACTIVE);
            pressPlayTxt.data.color = BLACK;
            window.setTimeout(function () {
                self.fullScreen.request();
                endOfScreen();
            }, 300);
        }

        var shieldsDownSprite = self.stage.getSprite(SHIELDS_DOWN, 6, false);
        var shieldsUpSprite = self.stage.getSprite(SHIELDS_UP, 6, false);
        var shieldsDrawable = self.stage.drawFresh(getShipX, getShipEndY, SHIELDS);
        self.stage.hide(shieldsDrawable);

        var startTimer = 10;
        var doTheShields = true;

        function shieldsAnimation() {

            self.stage.animateLater({
                drawable: shieldsDrawable,
                sprite: shieldsUpSprite,
                callback: function () {

                    shieldsDrawable.data = self.stage.getGraphic(SHIELDS);
                    self.stage.animateLater({
                        drawable: shieldsDrawable,
                        sprite: shieldsDownSprite,
                        callback: function () {
                            self.stage.hide(shieldsDrawable);
                            startTimer = 20;
                            if (doTheShields) {
                                shieldsAnimation();
                            }
                        }
                    }, 48, checkIfShouldStopThisMadness);
                }
            }, startTimer, checkIfShouldStopThisMadness);

            function checkIfShouldStopThisMadness() {
                if (!doTheShields) {
                    self.stage.hide(shieldsDrawable);
                }
            }
        }

        // end of screen

        function endOfScreen() {
            [credits, creditsButton, pressPlay, pressPlayTxt].forEach(self.stage.remove.bind(self.stage));
            // end event
            unRegisterTapListener();

            var logoOut = self.stage.getPath(logoDrawable.x, logoDrawable.y, logoDrawable.x,
                logoDrawable.y + self.screenHeight, 30, Transition.EASE_IN_EXPO);
            self.stage.move(logoDrawable, logoOut, function () {
                self.stage.remove(logoDrawable);
            });
            function getLogoX(width) {
                return getWidthHalf(width);
            }

            function getLogoY(height) {
                return calcScreenConst(height, 32, 7);
            }

            self.resizeRepo.add(logoDrawable, function () {
                changeCoords(logoDrawable, getLogoX(), getLogoY());
                changePath(logoOut, logoDrawable.x, logoDrawable.y, logoDrawable.x, logoDrawable.y + self.screenHeight);
            });

            function getShipGamePositionY() {
                return calcScreenConst(self.screenHeight, 6, 5);
            }

            var dockShipToGamePosition = self.stage.getPath(shipDrawable.x, shipDrawable.y, shipDrawable.x,
                getShipGamePositionY(), 30, Transition.EASE_IN_OUT_EXPO);
            self.resizeRepo.add(shipDrawable, function () {
                changeCoords(shipDrawable, getShipX(), getShipEndY());
                changeCoords(fireDrawable, getShipX(), getShipEndY());
                changePath(dockShipToGamePosition, shipDrawable.x, shipDrawable.y, shipDrawable.x,
                    getShipGamePositionY());
            });


            doTheShields = false;
            self.stage.remove(shieldsDrawable);

            self.stage.move(shipDrawable, dockShipToGamePosition, function () {
                self.resizeRepo.add(shipDrawable, function () {
                    changeCoords(shipDrawable, getShipX(), getShipGamePositionY());
                    changeCoords(fireDrawable, getShipX(), getShipGamePositionY());
                });

                // next scene
                self.next(nextScene, shipDrawable, leftFireDrawable, rightFireDrawable, shieldsDrawable,
                    shieldsUpSprite, shieldsDownSprite);
            });

            self.stage.move(leftFireDrawable, dockShipToGamePosition);
            self.stage.move(rightFireDrawable);
        }
    };

    PreGame.prototype.next = function (nextScene, ship, leftFire, rightFire, shields, shieldsUpSprite,
        shieldsDownSprite) {

        this.sceneStorage.ship = ship;
        this.sceneStorage.leftFire = leftFire;
        this.sceneStorage.rightFire = rightFire;
        this.sceneStorage.shields = shields;
        this.sceneStorage.shieldsUp = shieldsUpSprite;
        this.sceneStorage.shieldsDown = shieldsDownSprite;

        nextScene();
    };

    return PreGame;
})(Transition, Credits, window, calcScreenConst, drawSharedGameStuff, changeCoords, changePath, changeTouchable,
    ButtonFactory);