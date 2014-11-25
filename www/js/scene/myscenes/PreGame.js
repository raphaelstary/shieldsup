var PreGame = (function (Transition, Credits, calcScreenConst, widthHalf, heightHalf, heightThreeQuarter,
    widthThreeQuarter, __400, Fire) {
    "use strict";

    function PreGame(services) {
        this.stage = services.stage;
        this.sceneStorage = services.sceneStorage;
        this.tap = services.tap;
        this.fullScreen = services.fullScreen;
        this.messages = services.messages;
        this.sounds = services.sounds;
        this.timer = services.timer;
        this.buttons = services.buttons;
    }

    var SHIP = 'ship';
    var FIRE = 'fire/fire';
    var SHIELDS = 'shields';
    var SHIELDS_DOWN = 'shields_down/shields_down';
    var SHIELDS_UP = 'shields_up/shields_up';

    var PRE_GAME_MSG_KEY = 'pre_game';
    var CREDITS_MSG = 'credits';
    var PLAY_MSG = 'play';

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

        function getFireStartY(height) {
            return getShipStartY(height) + Fire.getShipOffSet(shipDrawable);
        }

        function getFireEndY(height) {
            return heightHalf(height) + Fire.getShipOffSet(shipDrawable);
        }

        var getLeftFireX = Fire.getLeftX.bind(undefined, shipDrawable);
        var getRightFireX = Fire.getRightX.bind(undefined, shipDrawable);

        var leftFireWrapper = self.stage.animateFresh(getLeftFireX, getFireStartY, FIRE, 10, true, [shipDrawable]);
        var leftFireDrawable = leftFireWrapper.drawable;
        var rightFireWrapper = self.stage.animateFresh(getRightFireX, getFireStartY, FIRE, 10, true, [shipDrawable]);
        var rightFireDrawable = rightFireWrapper.drawable;

        self.stage.move(leftFireDrawable, getLeftFireX, getFireEndY, 60, Transition.EASE_IN_QUAD, false, undefined,
            [shipDrawable]);
        self.stage.move(rightFireDrawable, getRightFireX, getFireEndY, 60, Transition.EASE_IN_QUAD, false, undefined,
            [shipDrawable]);

        var playButton, creditsButton;

        function shipIsAtEndPosition() {
            function createButtons() {
                playButton = self.buttons.createPrimaryButton(widthHalf, heightThreeQuarter,
                    self.messages.get(PRE_GAME_MSG_KEY, PLAY_MSG), startPlaying);

                shieldsAnimation();

                function getBottomY(height) {
                    return calcScreenConst(height, 50, 47);
                }

                creditsButton = self.buttons.createSecondaryButton(widthThreeQuarter, getBottomY,
                    self.messages.get(PRE_GAME_MSG_KEY, CREDITS_MSG), goToCreditsScreen);
            }

            createButtons();
            function goToCreditsScreen() {

                var creditsScreen = new Credits({
                    stage: self.stage,
                    messages: self.messages,
                    buttons: self.buttons
                });

                var stuff = [shipDrawable, leftFireDrawable, rightFireDrawable, logoDrawable, logoHighlightDrawable];
                stuff.forEach(self.stage.hide.bind(self.stage));

                function continuePreGame() {
                    doTheShields = true;
                    createButtons();
                    stuff.forEach(self.stage.show.bind(self.stage));
                    self.stage.animate(leftFireDrawable, leftFireWrapper.sprite);
                    self.stage.animate(rightFireDrawable, rightFireWrapper.sprite);
                }

                doTheShields = false;
                self.stage.hide(shieldsDrawable);

                self.buttons.remove(playButton);
                self.buttons.remove(creditsButton);

                creditsScreen.show(continuePreGame);
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
            var getFireY = Fire.getY.bind(undefined, shipDrawable);
            self.stage.move(leftFireDrawable, getLeftFireX, getFireY, 30, Transition.EASE_IN_EXPO);
            self.stage.move(rightFireDrawable, getRightFireX, getFireY, 30, Transition.EASE_IN_EXPO);
        }
    };

    PreGame.prototype.next = function (nextScene, ship, leftFire, rightFire, shields, shieldsUpSprite,
        shieldsDownSprite) {

        this.sceneStorage.ship = ship;
        this.sceneStorage.fire = {
            left: leftFire,
            right: rightFire
        };
        this.sceneStorage.shields = shields;
        this.sceneStorage.shieldsUp = shieldsUpSprite;
        this.sceneStorage.shieldsDown = shieldsDownSprite;

        nextScene();
    };

    return PreGame;
})(Transition, Credits, calcScreenConst, widthHalf, heightHalf, heightThreeQuarter, widthThreeQuarter, __400, Fire);