var PreGame = (function (Transition, Credits, window, calcScreenConst, drawSharedGameStuff, changeCoords, changePath,
    changeTouchable, ButtonFactory, fontSize_30, fontSize_40, widthHalf, heightHalf, heightThreeQuarter,
    widthThreeQuarter, __400) {
    "use strict";

    function PreGame(services) {
        this.stage = services.stage;
        this.sceneStorage = services.sceneStorage;
        this.tap = services.tap;
        this.fullScreen = services.fullScreen;
        this.messages = services.messages;
        this.sounds = services.sounds;
        this.timer = services.timer;

        this.buttons = new ButtonFactory(this.stage, this.tap, this.timer, GAME_FONT, function () {
            services.sounds.play(CLICK);
        }, WHITE, VIOLET, fontSize_30, 2, WHITE, WHITE, fontSize_40, 1.2);
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
        var logoHighlightDrawable = this.sceneStorage.logoHighlight;
        delete this.sceneStorage.logoHighlight;
        delete this.sceneStorage.logo;
        var self = this;

        function getShipStartY(height) {
            return calcScreenConst(self.stage.getGraphic(SHIP).height, 2) + height;
        }

        var shipDrawable = self.stage.moveFresh(widthHalf, getShipStartY, SHIP, widthHalf, heightHalf, 60,
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
            return heightHalf(height) + calcScreenConst(shipDrawable.getHeight(), 8, 5);
        }

        var leftFireDrawable = self.stage.animateFresh(getLeftFireX, getFireStartY, FIRE, 10, true,
            [shipDrawable]).drawable;
        var rightFireDrawable = self.stage.animateFresh(getRightFireX, getFireStartY, FIRE, 10, true,
            [shipDrawable]).drawable;

        self.stage.move(leftFireDrawable, getLeftFireX, getFireEndY, 60, Transition.EASE_IN_QUAD, false, undefined,
            [shipDrawable]);
        self.stage.move(rightFireDrawable, getRightFireX, getFireEndY, 60, Transition.EASE_IN_QUAD, false, undefined,
            [shipDrawable]);

        var playButton, creditsButton;

        function shipIsAtEndPosition() {
            playButton = self.buttons.createPrimaryButton(widthHalf, heightThreeQuarter,
                self.messages.get(PRE_GAME_MSG_KEY, PLAY_MSG), startPlaying);

            shieldsAnimation();

            function getBottomY(height) {
                return calcScreenConst(height, 50, 47);
            }

            creditsButton = self.buttons.createSecondaryButton(widthThreeQuarter, getBottomY,
                self.messages.get(PRE_GAME_MSG_KEY, CREDITS_MSG), goToCreditsScreen);

            function goToCreditsScreen() {

                var creditsScreen = new Credits(self.stage, self.tap, self.messages, self.sounds);

                //unRegisterTapListener();

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
                    creditsButton, play,
                    pressPlayTxt,
                    logoDrawable,
                    shipDrawable,
                    leftFireDrawable,
                    rightFireDrawable
                ], self.screenWidth, self.screenHeight, setFadeOffSet);
            }
        }

        function startPlaying() {
            self.fullScreen.request();
            self.timer.doLater(endOfScreen.bind(self), 31);
        }

        var shieldsDownSprite = self.stage.getSprite(SHIELDS_DOWN, 6, false);
        var shieldsUpSprite = self.stage.getSprite(SHIELDS_UP, 6, false);
        var shieldsDrawable = self.stage.drawFresh(widthHalf, heightHalf, SHIELDS);
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
            [playButton, creditsButton].forEach(self.buttons.remove.bind(self.buttons));
            // end event
            function getLogoY(height) {
                return calcScreenConst(height, 32, 7) + height;
            }

            self.stage.move(logoDrawable, widthHalf, getLogoY, 30, Transition.EASE_IN_EXPO, false, function () {
                self.stage.remove(logoDrawable);
            });
            self.stage.move(logoHighlightDrawable, widthHalf, getLogoY, 30, Transition.EASE_IN_EXPO, false,
                function () {
                    self.stage.remove(logoHighlightDrawable);
                });

            doTheShields = false;
            self.stage.remove(shieldsDrawable);

            self.stage.move(shipDrawable, widthHalf, __400, 30, Transition.EASE_IN_EXPO, false, function () {
                // next scene
                self.next(nextScene, shipDrawable, leftFireDrawable, rightFireDrawable, shieldsDrawable,
                    shieldsUpSprite, shieldsDownSprite);
            });

            function getFireGamePositionY(height) {
                return __400(height) + calcScreenConst(shipDrawable.getHeight(), 8, 5);
            }

            self.stage.move(leftFireDrawable, getLeftFireX, getFireGamePositionY, 30, Transition.EASE_IN_EXPO);
            self.stage.move(rightFireDrawable, getRightFireX, getFireGamePositionY, 30, Transition.EASE_IN_EXPO);
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
    ButtonFactory, fontSize_30, fontSize_40, widthHalf, heightHalf, heightThreeQuarter, widthThreeQuarter, __400);