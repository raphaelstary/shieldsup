var Shop = (function () {
    "use strict";

    function Shop(services) {
        this.stage = services.stage;
        this.sceneStorage = services.sceneStorage;
        this.sounds = services.sounds;
        this.messages = services.messages;
        this.buttons = services.buttons;
        this.events = services.events;
        this.device = services.device;
    }

    var BUTTON_KEY = 'common_buttons';
    var PLAY = 'play';
    var SETTINGS = 'settings';
    var ACHIEVEMENTS = 'achievements';
    var MORE_GAMES = 'more_games';

    Shop.prototype.show = function (next) {
        var self = this;

        showButtons();

        var playButton, achievementsButton, settingsButton, moreGamesButton;

        function showButtons() {

            function goToSettings() {
                self.sceneStorage.menuScene = 'settings';
                showSettingsScreen();
            }

            function goToAchievements() {
                self.sceneStorage.menuScene = 'achievements';
                showSettingsScreen();
            }

            function showSettingsScreen() {
                self.events.fireSync(Event.PAUSE);
                showMenu(self.stage, self.buttons, self.messages, self.events, self.sceneStorage, self.device,
                    self.sounds, hideSettings)
            }

            function hideSettings() {
                settingsButton.used = false;
                achievementsButton.used = false;
            }

            function getButtonWidth(width, height) {
                if (width < height) {
                    return Width.HALF(width);
                }
                return Width.QUARTER(width);
            }

            function showMoreGames() {
                window.location.href = window.moreGamesLink;
            }

            playButton = self.buttons.createPrimaryButton(Width.HALF, Height.get(480, 345),
                self.messages.get(BUTTON_KEY, PLAY), nextScene, 3, false, getButtonWidth);
            self.messages.add(playButton.text, playButton.text.data, BUTTON_KEY, PLAY);

            achievementsButton = self.buttons.createSecondaryButton(Width.HALF, Height.get(480, 385),
                self.messages.get(BUTTON_KEY, ACHIEVEMENTS), goToAchievements, 3, false, getButtonWidth);
            self.messages.add(achievementsButton.text, achievementsButton.text.data, BUTTON_KEY, ACHIEVEMENTS);

            settingsButton = self.buttons.createSecondaryButton(Width.HALF, Height.get(480, 420),
                self.messages.get(BUTTON_KEY, SETTINGS), goToSettings, 3, false, getButtonWidth);
            self.messages.add(settingsButton.text, settingsButton.text.data, BUTTON_KEY, SETTINGS);

            moreGamesButton = self.buttons.createSecondaryButton(Width.HALF, Height.get(480, 455),
                self.messages.get(BUTTON_KEY, MORE_GAMES), showMoreGames, 3, false, getButtonWidth);
            self.messages.add(moreGamesButton.text, moreGamesButton.text.data, BUTTON_KEY, MORE_GAMES);
        }

        var itIsOver = false;

        function nextScene() {
            if (itIsOver)
                return;
            itIsOver = true;

            next();
        }
    };

    return Shop;
})();