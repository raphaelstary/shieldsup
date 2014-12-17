var Settings = (function (Width, Height, changeSign, Transition, Event) {
    "use strict";

    function Settings(services) {
        this.stage = services.stage;
        this.buttons = services.buttons;
        this.messages = services.messages;
        this.resize = services.resize;
        this.events = services.events;
        this.sceneStorage = services.sceneStorage;
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
        var backBlur, menuBack, resumeButton, fsText, fsOnButton, fsOffButton, soundText, soundOnButton;
        var soundOffButton, musicText, musicOnButton, musicOffButton, languageText, germanButton, englishButton;
        var spanishButton, frenchButton, italianButton, portugueseButton;

        var resume = self.events.subscribe(Event.RESUME_SETTINGS, function () {
            sceneButtons.forEach(self.buttons.enable.bind(self.buttons));
        });

        showSettings();
        var sceneButtons = [
            resumeButton,
            fsOnButton,
            fsOffButton,
            soundOnButton,
            soundOffButton,
            musicOnButton,
            musicOffButton,
            germanButton,
            englishButton,
            spanishButton,
            frenchButton,
            italianButton,
            portugueseButton
        ];

        function showSettings() {

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
                englishButton = getLanguageButton(Width.get(10, 3), Height.get(20, 14), 'english', setEnglish, false);
                germanButton = getLanguageButton(Width.get(10, 7), Height.get(20, 14), 'deutsch', setGerman, false);
                frenchButton = getLanguageButton(Width.get(10, 3), Height.get(40, 31), 'Francais', undefined, false);
                spanishButton = getLanguageButton(Width.get(10, 7), Height.get(40, 31), 'Espanol', undefined, false);
                portugueseButton = getLanguageButton(Width.get(10, 3), Height.get(40, 34), 'Portugues', undefined,
                    false);
                italianButton = getLanguageButton(Width.get(10, 7), Height.get(40, 34), 'Italiano', undefined, false);

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
                        Font._30, FONT, WHITE, 9);
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
                    var button = self.buttons.createSecondaryButton(xFn, yFn, self.messages.get(SETTINGS_KEY, msgKey),
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
            self.events.unsubscribe(resume);

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
                    self.events.fire(Event.RESUME);
                    self.sceneStorage.settingsOn = false;
                    next();
                });
        }

        function changeLanguage(languageCode) {
            self.messages.setLanguage(languageCode);
            self.resize.forceResize();
        }
    };

    return Settings;
})(Width, Height, changeSign, Transition, Event);