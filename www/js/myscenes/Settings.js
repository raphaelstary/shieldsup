var Settings = (function (Width, Height, changeSign, Transition, Event, Credits) {
    "use strict";

    function Settings(services) {
        this.stage = services.stage;
        this.buttons = services.buttons;
        this.messages = services.messages;
        this.events = services.events;
        this.sceneStorage = services.sceneStorage;
        this.device = services.device;
        this.sounds = services.sounds;
    }

    var SETTINGS_KEY = 'settings';
    var OK = 'ok';
    var FULL_SCREEN = 'full_screen';
    var SOUND = 'sound';
    var NO_SOUND = 'no_sound';
    //var MUSIC = 'music';
    var LANGUAGE = 'language';
    var ON = 'on';
    var OFF = 'off';
    var CREDITS = 'credits';
    var RESET_GAME = 'reset_game';

    var FONT = 'GameFont';
    var WHITE = '#fff';

    Settings.prototype.show = function (next) {
        this.sceneStorage.settingsOn = true;
        var self = this;
        var backBlur, fsText, soundText;
        // var menuBack;
        //var musicText;
        var languageText;
        var sceneButtons = [];
        var resume = self.events.subscribe(Event.RESUME_SETTINGS, function () {
            sceneButtons.forEach(self.buttons.enable.bind(self.buttons));
        });

        showSettings();

        function showSettings() {

            backBlur = self.stage.drawRectangle(changeSign(Width.HALF), Height.HALF, Width.FULL, Height.FULL, '#000',
                true, undefined, 6, 0.8);
            //menuBack = self.stage.drawRectangle(changeSign(Width.HALF), Height.HALF, Width.get(10, 9),
            //    Height.get(10, 9), '#fff', true, undefined, 6, 0.5);
            self.stage.move(backBlur, Width.HALF, Height.HALF, 15, Transition.EASE_IN_EXPO, false,
                createSettingsSettingsPage);
        }

        function hideSettings() {
            self.events.unsubscribe(resume);

            destructSettingsSettingsPage();

            self.stage.move(backBlur, changeSign(Width.HALF), Height.HALF, 15, Transition.EASE_OUT_EXPO, false,
                function () {
                    //self.stage.remove(menuBack);
                    self.stage.remove(backBlur);
                    self.events.fire(Event.RESUME);
                    self.sceneStorage.settingsOn = false;
                    next();
                });
        }

        function destructSettingsSettingsPage() {
            if (fsText)
                removeTxt(fsText);
            removeTxt(soundText);
            //removeTxt(musicText);
            removeTxt(languageText);

            sceneButtons.forEach(removeBtn);

            function removeBtn(button) {
                self.messages.remove(button.text);
                self.buttons.remove(button);
            }

            function removeTxt(drawable) {
                self.messages.remove(drawable);
                self.stage.remove(drawable);
            }
        }

        function createSettingsSettingsPage() {

            if (self.device.isFullScreenSupported()) {
                fsText = getMenuText(Height.get(20, 4), FULL_SCREEN);
                var fsOn = getOnButton(Height.get(20, 4), function () {
                    resetButton(fsOff);
                    styleSelectButton(fsOn);

                    self.sceneStorage.fsUserRequest = true;
                    self.events.fire(Event.FULL_SCREEN, false);

                }, self.device.isFullScreen());
                sceneButtons.push(fsOn);
                var fsOff = getOffButton(Height.get(20, 4), function () {
                    resetButton(fsOn);
                    styleSelectButton(fsOff);

                    self.device.exitFullScreen();

                }, !self.device.isFullScreen());
                sceneButtons.push(fsOff);
            }

            if (self.sounds.isSupported()) {
                soundText = getMenuText(Height.get(40, 13), SOUND);
                var sfxOn = getOnButton(Height.get(40, 13), function () {
                    resetButton(sfxOff);
                    styleSelectButton(sfxOn);

                    self.sounds.unmuteAll();
                    self.sceneStorage.sfxOn = true;
                }, self.sceneStorage.sfxOn);
                sceneButtons.push(sfxOn);
                var sfxOff = getOffButton(Height.get(40, 13), function () {
                    resetButton(sfxOn);
                    styleSelectButton(sfxOff);

                    self.sounds.muteAll();
                    self.sceneStorage.sfxOn = false;
                }, !self.sceneStorage.sfxOn);
                sceneButtons.push(sfxOff);
            } else {
                soundText = getMenuText(Height.get(40, 13), NO_SOUND);
            }

            languageText = getMenuText(Height.get(40, 18), LANGUAGE);

            var raster = [
                {
                    x: Width.get(40, 29),
                    y: Height.get(40, 18)
                }, {
                    x: Width.get(40, 29),
                    y: Height.get(40, 21)
                }, {
                    x: Width.get(40, 29),
                    y: Height.get(40, 24)
                }, {
                    x: Width.get(40, 29),
                    y: Height.get(40, 27)
                }, {
                    x: Width.get(40, 29),
                    y: Height.get(40, 30)
                }, {
                    x: Width.get(40, 29),
                    y: Height.get(40, 33)
                }
            ];

            var languageBtns = {};
            self.messages.getLanguages().forEach(function (language) {
                var position = raster.shift();
                languageBtns[language.language] = getLanguageButton(position.x, position.y, language.name,
                    getSetLanguageFn(language.language), false);
                sceneButtons.push(languageBtns[language.language]);
            });

            var usedLanguageButton = languageBtns[self.messages.language];
            styleSelectButton(usedLanguageButton);

            function getSetLanguageFn(language) {
                return function () {
                    resetButton(usedLanguageButton);
                    usedLanguageButton = languageBtns[language];
                    changeLanguage(language);
                };
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
                var drawable = self.stage.drawText(Width.THIRD, yFn, self.messages.get(SETTINGS_KEY, msgKey), Font._30,
                    FONT, WHITE, 8);
                self.messages.add(drawable, drawable.data, SETTINGS_KEY, msgKey);

                return drawable;
            }

            function getOnButton(yFn, callback, selected) {
                return getOnOffButton(Width.get(40, 25), yFn, ON, callback, selected);
            }

            function getOffButton(yFn, callback, selected) {
                return getOnOffButton(Width.get(10, 8), yFn, OFF, callback, selected);
            }

            function getLanguageButton(xFn, yFn, msg, callback, selected) {
                var button = self.buttons.createSecondaryButton(xFn, yFn, msg, callback, 7, false, Width.THIRD);
                button.reset = false;
                if (selected) {
                    styleSelectButton(button);
                }

                return button;
            }

            function getOnOffButton(xFn, yFn, msgKey, callback, selected) {
                var button = self.buttons.createSecondaryButton(xFn, yFn, self.messages.get(SETTINGS_KEY, msgKey),
                    callback, 7);
                self.messages.add(button.text, button.text.data, SETTINGS_KEY, msgKey);
                if (selected) {
                    button.text.alpha = 1;
                    button.background.data.filled = true;
                    button.used = true;
                }
                return button;
            }

            var resetGameButton = self.buttons.createSecondaryButton(Width.HALF, Height.get(20, 13),
                self.messages.get(SETTINGS_KEY, RESET_GAME), resetGameData, 7);
            self.messages.add(resetGameButton.text, resetGameButton.text.data, SETTINGS_KEY, RESET_GAME);
            sceneButtons.push(resetGameButton);

            var creditsButton = self.buttons.createSecondaryButton(Width.HALF, Height.get(20, 15),
                self.messages.get(SETTINGS_KEY, CREDITS), showCredits, 7);
            self.messages.add(creditsButton.text, creditsButton.text.data, SETTINGS_KEY, CREDITS);
            sceneButtons.push(creditsButton);

            var resumeButton = self.buttons.createPrimaryButton(Width.HALF, Height.get(40, 35),
                self.messages.get(SETTINGS_KEY, OK), hideSettings, 7);
            self.messages.add(resumeButton.text, resumeButton.text.data, SETTINGS_KEY, OK);
            sceneButtons.push(resumeButton);

        }

        function showCredits() {
            var creditsScreen = new Credits({
                stage: self.stage,
                messages: self.messages,
                buttons: self.buttons
            });

            destructSettingsSettingsPage();

            creditsScreen.show(createSettingsSettingsPage);
        }

        function resetGameData() {

        }

        function changeLanguage(languageCode) {
            self.messages.setLanguage(languageCode);
            self.device.forceResize();
        }
    };

    return Settings;
})(Width, Height, changeSign, Transition, Event, Credits);