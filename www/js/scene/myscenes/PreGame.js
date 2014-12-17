var PreGame = (function (Transition, Credits, calcScreenConst, Width, Height, Fire, drawShields, showSettings, Event) {
    "use strict";

    function PreGame(services) {
        this.stage = services.stage;
        this.sceneStorage = services.sceneStorage;
        this.tap = services.tap;
        this.messages = services.messages;
        this.sounds = services.sounds;
        this.timer = services.timer;
        this.buttons = services.buttons;
        this.resize = services.resize;
        this.events = services.events;
    }

    var SHIP = 'ship';
    var FIRE = 'fire/fire';
    var SHIELDS = 'shields';

    var KEY = 'pre_game';
    var CREDITS = 'credits';
    var PLAY = 'play';
    var SETTINGS = 'settings';

    PreGame.prototype.show = function (nextScene) {
        var logoDrawable = this.sceneStorage.logo;
        var logoHighlightDrawable = this.sceneStorage.logoHighlight;
        delete this.sceneStorage.logoHighlight;
        delete this.sceneStorage.logo;
        var self = this;

        function getShipStartY(height) {
            return calcScreenConst(self.stage.getGraphic(SHIP).height, 2) + height;
        }

        var shipDrawable = self.stage.moveFresh(Width.HALF, getShipStartY, SHIP, Width.HALF, Height.HALF, 60,
            Transition.EASE_IN_QUAD, false, shipIsAtEndPosition, undefined, 1).drawable;

        function getFireStartY(height) {
            return getShipStartY(height) + Fire.getShipOffSet(shipDrawable);
        }

        function getFireEndY(height) {
            return Height.HALF(height) + Fire.getShipOffSet(shipDrawable);
        }

        var getLeftFireX = Fire.getLeftX.bind(undefined, shipDrawable);
        var getRightFireX = Fire.getRightX.bind(undefined, shipDrawable);

        var leftFireWrapper = self.stage.animateFresh(getLeftFireX, getFireStartY, FIRE, 10, true, [shipDrawable], 1);
        var leftFireDrawable = leftFireWrapper.drawable;
        var rightFireWrapper = self.stage.animateFresh(getRightFireX, getFireStartY, FIRE, 10, true, [shipDrawable], 1);
        var rightFireDrawable = rightFireWrapper.drawable;

        self.stage.move(leftFireDrawable, getLeftFireX, getFireEndY, 60, Transition.EASE_IN_QUAD, false, undefined,
            [shipDrawable]);
        self.stage.move(rightFireDrawable, getRightFireX, getFireEndY, 60, Transition.EASE_IN_QUAD, false, undefined,
            [shipDrawable]);

        var playButton, creditsButton, settingsButton;

        function shipIsAtEndPosition() {
            function createButtons() {
                playButton = self.buttons.createPrimaryButton(Width.HALF, Height.THREE_QUARTER,
                    self.messages.get(KEY, PLAY), startPlaying);
                self.messages.add(playButton.text, playButton.text.data, KEY, PLAY);

                shieldsDrawable.x = shipDrawable.x;
                shieldsDrawable.y = shipDrawable.y;
                shieldsAnimation();

                creditsButton = self.buttons.createSecondaryButton(Width.THREE_QUARTER, Height.get(50, 47),
                    self.messages.get(KEY, CREDITS), goToCreditsScreen);
                self.messages.add(creditsButton.text, creditsButton.text.data, KEY, CREDITS);
                settingsButton = self.buttons.createSecondaryButton(Width.QUARTER, Height.get(50, 47),
                    self.messages.get(KEY, SETTINGS), showSettingsScreen);
                self.messages.add(settingsButton.text, settingsButton.text.data, KEY, SETTINGS);
            }

            function showSettingsScreen() {
                self.events.fire(Event.PAUSE);
                showSettings(self.stage, self.buttons, self.messages, self.resize, self.events, self.sceneStorage,
                    hideSettings)
            }

            function hideSettings() {
                settingsButton.used = false;
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
                self.buttons.remove(settingsButton);

                creditsScreen.show(continuePreGame);
            }
        }

        function startPlaying() {
            self.timer.doLater(endOfScreen.bind(self), 31);
        }

        var shieldsWrapper = drawShields(self.stage, shipDrawable);
        var shieldsDownSprite = shieldsWrapper.downSprite;
        var shieldsUpSprite = shieldsWrapper.upSprite;
        var shieldsDrawable = shieldsWrapper.drawable;

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
            [playButton, creditsButton, settingsButton].forEach(self.buttons.remove.bind(self.buttons));
            // end event
            function getLogoY(height) {
                return calcScreenConst(height, 32, 7) + height;
            }

            self.stage.move(logoDrawable, Width.HALF, getLogoY, 30, Transition.EASE_IN_EXPO, false, function () {
                self.stage.remove(logoDrawable);
            });
            self.stage.move(logoHighlightDrawable, Width.HALF, getLogoY, 30, Transition.EASE_IN_EXPO, false,
                function () {
                    self.stage.remove(logoHighlightDrawable);
                });

            doTheShields = false;
            self.stage.remove(shieldsDrawable);

            self.stage.move(shipDrawable, Width.HALF, Height._400, 30, Transition.EASE_IN_EXPO, false, function () {
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
        this.sceneStorage.shields = {
            drawable: shields,
            upSprite: shieldsUpSprite,
            downSprite: shieldsDownSprite
        };

        nextScene();
    };

    return PreGame;
})(Transition, Credits, calcScreenConst, Width, Height, Fire, drawShields, showSettings, Event);