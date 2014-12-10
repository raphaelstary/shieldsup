var PreGame = (function (Transition, Credits, calcScreenConst, Width, Height, Fire, drawShields) {
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
        this.resize = services.resize;
    }

    var SHIP = 'ship';
    var FIRE = 'fire/fire';
    var SHIELDS = 'shields';

    var KEY = 'pre_game';
    var CREDITS = 'credits';
    var PLAY = 'play';
    var SETTINGS = 'settings';

    var SETTINGS_KEY = 'settings';
    var OK = 'ok';
    var FULL_SCREEN = 'full_screen';
    var SOUND = 'sound';
    var MUSIC = 'music';
    var LANGUAGE = 'language';
    var ON = 'on';
    var OFF = 'off';

    var FONT = 'GameFont';
    var WHITE = '#fff';

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
                    self.messages.get(KEY, SETTINGS), showSettings);
                self.messages.add(settingsButton.text, settingsButton.text.data, KEY, SETTINGS);
            }

            var backBlur, menuBack, resumeButton, fsText, fsOnButton, fsOffButton, soundText, soundOnButton;
            var soundOffButton, musicText, musicOnButton, musicOffButton, languageText, germanButton, englishButton;
            var spanishButton, frenchButton, italianButton, portugueseButton;

            function showSettings() {
                hideButton(playButton);
                hideButton(settingsButton);
                hideButton(creditsButton);
                function hideButton(button) {
                    self.stage.hide(button.text);
                    self.stage.hide(button.background);
                    self.tap.disable(button.input);
                }

                backBlur = self.stage.drawRectangle(Width.HALF, Height.HALF, Width.FULL, Height.FULL, '#000', true,
                    undefined, 7, 0.8);
                menuBack = self.stage.drawRectangle(changeSign(Width.HALF), Height.HALF, Width.get(10, 9),
                    Height.get(10, 9), '#fff', true, undefined, 8, 0.5);
                self.stage.move(menuBack, Width.HALF, Height.HALF, 15, Transition.EASE_IN_EXPO, false, function () {

                    fsText = getMenuText(Height.get(20, 4), FULL_SCREEN);
                    fsOnButton = getOnButton(Height.get(20, 5), undefined, false);
                    fsOffButton = getOffButton(Height.get(20, 5), undefined, true);
                    soundText = getMenuText(Height.get(20, 7), SOUND);
                    soundOnButton = getOnButton(Height.get(20, 8), undefined, true);
                    soundOffButton = getOffButton(Height.get(20, 8), undefined, false);
                    musicText = getMenuText(Height.get(20, 10), MUSIC);
                    musicOnButton = getOnButton(Height.get(20, 11), undefined, true);
                    musicOffButton = getOffButton(Height.get(20, 11), undefined, false);
                    languageText = getMenuText(Height.get(20, 13), LANGUAGE);
                    englishButton = getLanguageButton(Width.get(10, 3), Height.get(20, 14), 'english', setEnglish,
                        false);
                    germanButton = getLanguageButton(Width.get(10, 7), Height.get(20, 14), 'deutsch', setGerman, false);
                    frenchButton = getLanguageButton(Width.get(10, 3), Height.get(40, 31), 'Francais', undefined,
                        false);
                    spanishButton = getLanguageButton(Width.get(10, 7), Height.get(40, 31), 'Espanol', undefined,
                        false);
                    portugueseButton = getLanguageButton(Width.get(10, 3), Height.get(40, 34), 'Portugues', undefined,
                        false);
                    italianButton = getLanguageButton(Width.get(10, 7), Height.get(40, 34), 'Italiano', undefined,
                        false);

                    var usedLanguageButton;
                    var currentLanguage = self.messages.language;
                    if (currentLanguage == 'en') {
                        usedLanguageButton = englishButton;
                    } else if (currentLanguage == 'de') {
                        usedLanguageButton = germanButton;
                    }
                    styleSelectButton(usedLanguageButton);
                    function setEnglish() {
                        resetButton(usedLanguageButton);
                        usedLanguageButton = englishButton;
                        changeLanguage('en');
                    }

                    function setGerman() {
                        resetButton(usedLanguageButton);
                        usedLanguageButton = germanButton;
                        changeLanguage('de');
                    }

                    function resetButton(button) {
                        button.text.alpha = 0.5;
                        button.background.data.filled = false;
                        button.used = false;
                    }

                    function styleSelectButton(button) {
                        button.text.alpha = 1;
                        button.background.data.filled = true;
                        button.used = true;
                    }

                    function getMenuText(yFn, msgKey) {
                        var drawable = self.stage.drawText(Width.HALF, yFn, self.messages.get(SETTINGS_KEY, msgKey),
                            Font._30,
                            FONT, WHITE, 9);
                        self.messages.add(drawable, drawable.data, SETTINGS_KEY, msgKey);

                        return drawable;
                    }

                    function getOnButton(yFn, callback, selected) {
                        return getOnOffButton(Width.get(10, 4), yFn, ON, callback, selected);
                    }

                    function getOffButton(yFn, callback, selected) {
                        return getOnOffButton(Width.get(10, 6), yFn, OFF, callback, selected);
                    }

                    function getLanguageButton(xFn, yFn, msg, callback, selected) {
                        var button = self.buttons.createSecondaryButton(xFn, yFn, msg, callback);
                        button.reset = false;
                        if (selected) {
                            styleSelectButton(button);
                        }

                        return button;
                    }

                    function getOnOffButton(xFn, yFn, msgKey, callback, selected) {
                        var button = self.buttons.createSecondaryButton(xFn, yFn,
                            self.messages.get(SETTINGS_KEY, msgKey),
                            callback);
                        self.messages.add(button.text, button.text.data, SETTINGS_KEY, msgKey);
                        if (selected) {
                            button.text.alpha = 1;
                            button.background.data.filled = true;
                        }
                        button.used = true;
                        return button;
                    }

                    resumeButton = self.buttons.createPrimaryButton(Width.HALF, Height.get(20, 18),
                        self.messages.get(SETTINGS_KEY, OK), hideSettings);
                    self.messages.add(resumeButton.text, resumeButton.text.data, SETTINGS_KEY, OK);

                });
            }

            function hideSettings() {
                removeTxt(fsText);
                removeBtn(fsOnButton);
                removeBtn(fsOffButton);
                removeTxt(soundText);
                removeBtn(soundOnButton);
                removeBtn(soundOffButton);
                removeTxt(musicText);
                removeBtn(musicOnButton);
                removeBtn(musicOffButton);
                removeTxt(languageText);
                removeBtn(englishButton);
                removeBtn(germanButton);
                removeBtn(frenchButton);
                removeBtn(spanishButton);
                removeBtn(portugueseButton);
                removeBtn(italianButton);
                removeBtn(resumeButton);

                function removeBtn(button) {
                    self.messages.remove(button.text);
                    self.buttons.remove(button);
                }

                function removeTxt(drawable) {
                    self.messages.remove(drawable);
                    self.stage.remove(drawable);
                }

                self.stage.move(menuBack, changeSign(Width.HALF), Height.HALF, 15, Transition.EASE_OUT_EXPO, false,
                    function () {
                        self.stage.remove(menuBack);
                        self.stage.remove(backBlur);

                        showButton(playButton);
                        showButton(settingsButton);
                        settingsButton.used = false;
                        showButton(creditsButton);

                        function showButton(button) {
                            self.stage.show(button.text);
                            self.stage.show(button.background);
                            self.tap.enable(button.input);
                        }
                    });
            }

            function changeLanguage(languageCode) {
                self.messages.setLanguage(languageCode);
                self.resize.forceResize();
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
            self.fullScreen.request();
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
})(Transition, Credits, calcScreenConst, Width, Height, Fire, drawShields);