var PreGame = (function (Transition, Credits, calcScreenConst, Width, Height, Fire, drawShields, showSettings, Event,
    checkAndSet30fps) {
    "use strict";

    function PreGame(services) {
        this.stage = services.stage;
        this.sceneStorage = services.sceneStorage;
        this.messages = services.messages;
        this.sounds = services.sounds;
        this.timer = services.timer;
        this.buttons = services.buttons;
        this.events = services.events;
        this.device = services.device;
        this.shaker = services.shaker;
    }

    var SHIP = 'ship';
    var FIRE = 'fire/fire';
    var SHIELDS = 'shields';

    var KEY = 'pre_game';
    var CREDITS = 'credits';
    var PLAY = 'play';
    var SETTINGS = 'settings';
    var SHIELDS_UP_SOUND = 'hydraulics_engaged';
    var SHIELDS_ON_SOUND = 'warp_engineering_05';
    var SHIP_ARRIVES = 'star_drive_engaged';
    var BACK_GROUND_MUSIC = 'space_log';
    var BUTTON_KEY = 'common_buttons';
    var ACHIEVEMENTS = 'achievements';
    var MORE_GAMES = 'more_games';

    PreGame.prototype.show = function (nextScene) {
        var logoDrawable = this.sceneStorage.logo;
        var logoHighlightDrawable = this.sceneStorage.logoHighlight;
        delete this.sceneStorage.logoHighlight;
        delete this.sceneStorage.logo;
        var self = this;

        var speed60 = 60;
        var speed30 = 30;
        if (this.sceneStorage.do30fps) {
            speed60 /= 2;
            speed30 /= 2;
        }

        function getShipStartY(height) {
            return calcScreenConst(self.stage.getImageHeight(SHIP), 2) + height;
        }

        var shipDrawable = self.stage.moveFresh(Width.HALF, getShipStartY, SHIP, Width.HALF, Height.HALF, speed60,
            Transition.EASE_IN_QUAD, false, shipIsAtEndPosition).drawable;
        var sounds = [];
        sounds.push(this.sounds.play(SHIP_ARRIVES));

        function getFireStartY(height) {
            return getShipStartY(height) + Fire.getShipOffSet(shipDrawable);
        }

        function getFireEndY(height) {
            return Height.HALF(height) + Fire.getShipOffSet(shipDrawable);
        }

        var getLeftFireX = Fire.getLeftX.bind(undefined, shipDrawable);
        var getRightFireX = Fire.getRightX.bind(undefined, shipDrawable);

        var leftFireWrapper = self.stage.animateFresh(getLeftFireX, getFireStartY, FIRE, 10, true, [shipDrawable]);
        var leftFireDrawable = leftFireWrapper.drawable;
        var rightFireWrapper = self.stage.animateFresh(getRightFireX, getFireStartY, FIRE, 10, true, [shipDrawable]);
        var rightFireDrawable = rightFireWrapper.drawable;

        self.stage.move(leftFireDrawable, getLeftFireX, getFireEndY, speed60, Transition.EASE_IN_QUAD, false, undefined,
            [shipDrawable]);
        self.stage.move(rightFireDrawable, getRightFireX, getFireEndY, speed60, Transition.EASE_IN_QUAD, false,
            undefined,
            [shipDrawable]);

        var playButton, creditsButton, settingsButton, achievementsButton, moreGamesButton;

        function shipIsAtEndPosition() {
            sounds.push(self.sounds.play(BACK_GROUND_MUSIC));

            function createButtons() {
                function getButtonWidth(width, height) {
                    if (width < height) {
                        return Width.HALF(width);
                    }
                    return Width.QUARTER(width);
                }

                playButton = self.buttons.createPrimaryButton(Width.HALF, Height.THREE_QUARTER,
                    self.messages.get(KEY, PLAY), startPlaying, 3, false, getButtonWidth);
                self.messages.add(playButton.text, playButton.text.data, KEY, PLAY);

                shieldsDrawable.x = shipDrawable.x;
                shieldsDrawable.y = shipDrawable.y;
                shieldsAnimation();

                achievementsButton = self.buttons.createSecondaryButton(Width.HALF, Height.get(50, 41),
                    self.messages.get(BUTTON_KEY, ACHIEVEMENTS), showSettingsScreen, 3, false, getButtonWidth);
                self.messages.add(achievementsButton.text, achievementsButton.text.data, BUTTON_KEY, ACHIEVEMENTS);

                settingsButton = self.buttons.createSecondaryButton(Width.HALF, Height.get(50, 44),
                    self.messages.get(BUTTON_KEY, SETTINGS), showSettingsScreen, 3, false, getButtonWidth);
                self.messages.add(settingsButton.text, settingsButton.text.data, KEY, SETTINGS);

                moreGamesButton = self.buttons.createSecondaryButton(Width.HALF, Height.get(50, 47),
                    self.messages.get(BUTTON_KEY, MORE_GAMES), showMoreGames, 3, false, getButtonWidth);
                self.messages.add(moreGamesButton.text, moreGamesButton.text.data, BUTTON_KEY, MORE_GAMES);

                function showMoreGames() {
                    window.location.href = window.moreGamesLink;
                }

                //creditsButton = self.buttons.createSecondaryButton(Width.THREE_QUARTER, Height.get(50, 47),
                //    self.messages.get(KEY, CREDITS), goToCreditsScreen, 3);
                //self.messages.add(creditsButton.text, creditsButton.text.data, KEY, CREDITS);
            }

            function showSettingsScreen() {
                self.events.fireSync(Event.PAUSE);
                showSettings(self.stage, self.buttons, self.messages, self.events, self.sceneStorage, self.device,
                    self.sounds,
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
            self.sounds.play('door_air_lock_closing');
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
                    var shieldsOn = self.sounds.play(SHIELDS_ON_SOUND, false, 0.1);
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
                    }, 48, function () {
                        self.sounds.stop(shieldsOn);
                        checkIfShouldStopThisMadness();
                    });
                }
            }, startTimer, function () {
                self.sounds.play(SHIELDS_UP_SOUND, false, 0.1);
                checkIfShouldStopThisMadness();
            });

            function checkIfShouldStopThisMadness() {
                if (!doTheShields) {
                    self.stage.hide(shieldsDrawable);
                }
            }
        }

        // end of screen

        function endOfScreen() {
            checkAndSet30fps(self.sceneStorage, self.stage, self.shaker);

            self.sceneStorage.speedStripes.forEach(function (speedStripeWrapper) {
                self.stage.remove(speedStripeWrapper.drawable);
            });
            delete self.sceneStorage.speedStripes;

            [playButton, creditsButton, settingsButton].forEach(self.buttons.remove.bind(self.buttons));
            // end event
            function getLogoY(height) {
                return calcScreenConst(height, 32, 7) + height;
            }

            self.stage.move(logoDrawable, Width.HALF, getLogoY, speed30, Transition.EASE_IN_EXPO, false, function () {
                self.stage.remove(logoDrawable);
            });
            self.stage.move(logoHighlightDrawable, Width.HALF, getLogoY, speed30, Transition.EASE_IN_EXPO, false,
                function () {
                    self.stage.remove(logoHighlightDrawable);
                });

            doTheShields = false;
            self.stage.remove(shieldsDrawable);

            self.stage.move(shipDrawable, Width.HALF, Height._400, speed30, Transition.EASE_IN_EXPO, false,
                function () {
                // next scene
                    self.next(nextScene, shipDrawable, leftFireDrawable, rightFireDrawable, sounds);
            });
            var getFireY = function (height) {
                return Height._400(height) + Fire.getShipOffSet(shipDrawable);
            };
            self.stage.move(leftFireDrawable, getLeftFireX, getFireY, speed30, Transition.EASE_IN_EXPO);
            self.stage.move(rightFireDrawable, getRightFireX, getFireY, speed30, Transition.EASE_IN_EXPO);
        }
    };

    PreGame.prototype.next = function (nextScene, ship, leftFire, rightFire, sounds) {

        sounds.forEach(function (sound) {
            this.sounds.stop(sound);
        }, this);

        this.sceneStorage.ship = ship;
        this.sceneStorage.fire = {
            left: leftFire,
            right: rightFire
        };

        nextScene();
    };

    return PreGame;
})(Transition, Credits, calcScreenConst, Width, Height, Fire, drawShields, showSettings, Event, checkAndSet30fps);