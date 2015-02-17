var Settings = (function (Width, Height, changeSign, Transition, Event) {
    "use strict";

    function Settings(services) {
        this.stage = services.stage;
        this.buttons = services.buttons;
        this.messages = services.messages;
        this.events = services.events;
        this.sceneStorage = services.sceneStorage;
        this.device = services.device;
    }

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

    Settings.prototype.show = function (next) {
        this.sceneStorage.settingsOn = true;
        var self = this;
        var backBlur, fsText, soundText;
        // var menuBack;
        var musicText, languageText;
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
            self.stage.move(backBlur, Width.HALF, Height.HALF, 15, Transition.EASE_IN_EXPO, false, function () {

                fsText = getMenuText(Height.get(20, 4), FULL_SCREEN);
                sceneButtons.push(getOnButton(Height.get(20, 5), undefined, false));
                sceneButtons.push(getOffButton(Height.get(20, 5), undefined, true));
                soundText = getMenuText(Height.get(20, 7), SOUND);
                sceneButtons.push(getOnButton(Height.get(20, 8), undefined, true));
                sceneButtons.push(getOffButton(Height.get(20, 8), undefined, false));
                musicText = getMenuText(Height.get(20, 10), MUSIC);
                sceneButtons.push(getOnButton(Height.get(20, 11), undefined, true));
                sceneButtons.push(getOffButton(Height.get(20, 11), undefined, false));
                languageText = getMenuText(Height.get(20, 13), LANGUAGE);

                var raster = [
                    {
                        x: Width.get(10, 3),
                        y: Height.get(20, 14)
                    }, {
                        x: Width.get(10, 7),
                        y: Height.get(20, 14)
                    }, {
                        x: Width.get(10, 3),
                        y: Height.get(40, 31)
                    }, {
                        x: Width.get(10, 7),
                        y: Height.get(40, 31)
                    }, {
                        x: Width.get(10, 3),
                        y: Height.get(40, 34)
                    }, {
                        x: Width.get(10, 7),
                        y: Height.get(40, 34)
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
                    var drawable = self.stage.drawText(Width.HALF, yFn, self.messages.get(SETTINGS_KEY, msgKey),
                        Font._30, FONT, WHITE, 8);
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
                    var button = self.buttons.createSecondaryButton(xFn, yFn, msg, callback, 7);
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
                    }
                    button.used = true;
                    return button;
                }

                var resumeButton = self.buttons.createPrimaryButton(Width.HALF, Height.get(20, 18),
                    self.messages.get(SETTINGS_KEY, OK), hideSettings, 7);
                self.messages.add(resumeButton.text, resumeButton.text.data, SETTINGS_KEY, OK);
                sceneButtons.push(resumeButton);

            });
        }

        function hideSettings() {
            self.events.unsubscribe(resume);

            removeTxt(fsText);
            removeTxt(soundText);
            removeTxt(musicText);
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

            self.stage.move(backBlur, changeSign(Width.HALF), Height.HALF, 15, Transition.EASE_OUT_EXPO, false,
                function () {
                    //self.stage.remove(menuBack);
                    self.stage.remove(backBlur);
                    self.events.fire(Event.RESUME);
                    self.sceneStorage.settingsOn = false;
                    next();
                });
        }

        function changeLanguage(languageCode) {
            self.messages.setLanguage(languageCode);
            self.device.forceResize();
        }
    };

    return Settings;
})(Width, Height, changeSign, Transition, Event);