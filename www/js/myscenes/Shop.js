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

    var FONT = 'GameFont';
    var SPECIAL_FONT = 'SpecialGameFont';
    var WHITE = '#fff';
    var VIOLET = '#3a2e3f';
    var GOLD = '#ffd700';
    var DARK_GOLD = '#B8860B';
    var LIGHT_GREY = '#c4c4c4';

    Shop.prototype.show = function (next) {
        var self = this;

        var header = self.stage.drawText(Width.HALF, Height.get(48, 5), 'Shop', Font._15, FONT, LIGHT_GREY);

        var starsYFn = Height.get(48, 10);
        var starLeft = self.stage.drawFresh(Width.get(10, 3), starsYFn, 'star');
        var starValues = self.stage.drawText(Width.HALF, starsYFn, '350', Font._20, SPECIAL_FONT, WHITE);
        var starRight = self.stage.drawFresh(Width.get(10, 7), starsYFn, 'star');

        var symbolXFn = Width.get(32, 4);
        var buttonXFn = Width.get(32, 27);

        var energyYFn = Height.get(48, 16);
        var shields = self.stage.drawFresh(symbolXFn, energyYFn, 'shields', undefined, undefined, undefined, undefined,
            0.2);
        var energy = self.stage.drawFresh(symbolXFn, add(energyYFn, Height.get(48, 2)), 'energy_full', undefined,
            undefined, undefined, undefined, 0.2);
        var energyLine = drawLine(energyYFn, 2);
        var energyButton = self.buttons.createSecondaryButton(buttonXFn, energyYFn, '150', function () {
        }, 5, true, buttonsWidth);

        var lifeYFn = Height.get(48, 22);
        var life = self.stage.drawFresh(symbolXFn, lifeYFn, 'player_life');
        var lifeLine = drawLine(lifeYFn, 0);
        var lifeButton = self.buttons.createSecondaryButton(buttonXFn, lifeYFn, '250', function () {
        }, 5, true, buttonsWidth);

        var luckYFn = Height.get(48, 28);
        var luck = self.stage.drawText(symbolXFn, luckYFn, 'luck', Font._40, FONT, WHITE);
        var luckLine = drawLine(luckYFn, 3);
        var luckButton = self.buttons.createSecondaryButton(buttonXFn, luckYFn, '200', function () {
        }, 5, true, buttonsWidth);

        showButtons();

        function buttonsWidth(width) {
            return Width.get(32, 5)(width);
        }

        function drawLine(yFn, fullCount) {
            var one = drawOne(Width.get(32, 10), yFn, fullCount > 0);
            var two = drawOne(Width.get(32, 15), yFn, fullCount > 1);
            var three = drawOne(Width.get(32, 20), yFn, fullCount > 2);
            return [one, two, three];
        }

        function drawOne(xFn, yFn, filled) {
            return self.stage.drawRectangle(xFn, yFn, Width.get(32, 5), Height.get(48), LIGHT_GREY, filled);
        }

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