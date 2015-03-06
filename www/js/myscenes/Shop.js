var Shop = (function (Width, Height, add, Font) {
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
    var DARK_GRAY = '#A9A9A9';

    var PLAYER_LIFE = 'player_life';
    var STAR = 'star';
    var SHIELDS = 'shields';
    var ENERGY_FULL = 'energy_full';

    var KEY = 'shop';
    var SHOP = 'shop';
    var ENERGY_DESCRIPTION = 'energy_description';
    var LIFE_DESCRIPTION = 'life_description';
    var LUCK = 'luck';
    var LUCK_DESCRIPTION = 'luck_description';

    Shop.prototype.show = function (next) {
        var self = this;

        var shakerEnergy = new ScreenShaker(self.device);
        var shakerEnergyResizeId = self.events.subscribe(Event.RESIZE, shakerEnergy.resize.bind(shakerEnergy));
        var shakerEnergyTickId = self.events.subscribe(Event.TICK_MOVE, shakerEnergy.update.bind(shakerEnergy));

        var shakerLife = new ScreenShaker(self.device);
        var shakerLifeResizeId = self.events.subscribe(Event.RESIZE, shakerLife.resize.bind(shakerLife));
        var shakerLifeTickId = self.events.subscribe(Event.TICK_MOVE, shakerLife.update.bind(shakerLife));

        var shakerLuck = new ScreenShaker(self.device);
        var shakerLuckResizeId = self.events.subscribe(Event.RESIZE, shakerLuck.resize.bind(shakerLuck));
        var shakerLuckTickId = self.events.subscribe(Event.TICK_MOVE, shakerLuck.update.bind(shakerLuck));

        var header = self.stage.drawText(Width.HALF, Height.get(48, 4), self.messages.get(KEY, SHOP), Font._15, FONT,
            LIGHT_GREY);
        self.messages.add(header, header.data, KEY, SHOP);

        var starsYFn = Height.get(48, 8);
        var starLeft = self.stage.drawFresh(Width.get(10, 3), starsYFn, STAR);
        var starValues = self.stage.drawText(Width.HALF, starsYFn, '350', Font._20, SPECIAL_FONT, WHITE);
        var starRight = self.stage.drawFresh(Width.get(10, 7), starsYFn, STAR);

        var symbolXFn = Width.get(32, 5);
        var buttonXFn = Width.get(32, 27);

        var energyYFn = Height.get(48, 13);
        var shields = self.stage.drawFresh(symbolXFn, add(energyYFn, Height.get(48)), SHIELDS, undefined, undefined,
            undefined, undefined,
            0.2);
        var energy = self.stage.drawFresh(symbolXFn, add(energyYFn, Height.get(48, 3)), ENERGY_FULL, undefined,
            undefined, undefined, undefined, 0.2);
        var energyLine = drawLine(energyYFn, 2);
        var energyButton = self.buttons.createSecondaryButton(buttonXFn, add(energyYFn, Height.get(48)), '150',
            function () {
            shakerEnergy.startSmallShake();
        }, 3, true, buttonsWidth);
        shakerEnergy.add(energyButton.text);
        shakerEnergy.add(energyButton.background);
        energyButton.text.data.color = DARK_GRAY;
        var energyTxt = drawDescription(add(energyYFn, Height.get(48, 2)), self.messages.get(KEY, ENERGY_DESCRIPTION));
        self.messages.add(energyTxt, energyTxt.data, KEY, ENERGY_DESCRIPTION);
        var energyBG = drawBackGround(energyYFn);

        var lifeYFn = Height.get(48, 20);
        var life = self.stage.drawFresh(symbolXFn, add(lifeYFn, Height.get(48)), PLAYER_LIFE);
        var lifeLine = drawLine(lifeYFn, 0);
        var lifeButton = self.buttons.createSecondaryButton(buttonXFn, add(lifeYFn, Height.get(48)), '250',
            function () {
                lifeLine[0].data.filled = true;
                //shakerLife.startSmallShake();
        }, 3, true, buttonsWidth);
        shakerLife.add(lifeButton.text);
        shakerLife.add(lifeButton.background);
        var lifeTxt = drawDescription(add(lifeYFn, Height.get(48, 2)), self.messages.get(KEY, LIFE_DESCRIPTION));
        self.messages.add(lifeTxt, lifeTxt.data, KEY, LIFE_DESCRIPTION);
        var lifeBG = drawBackGround(lifeYFn);

        var luckYFn = Height.get(48, 27);
        var luck = self.stage.drawText(symbolXFn, add(luckYFn, Height.get(48)), self.messages.get(KEY, LUCK), Font._40,
            FONT, WHITE);
        self.messages.add(luck, luck.data, KEY, LUCK);
        var luckLine = drawLine(luckYFn, 3);
        var luckButton = self.buttons.createSecondaryButton(buttonXFn, add(luckYFn, Height.get(48)), '200',
            function () {
            shakerLuck.startSmallShake();
        }, 3, true, buttonsWidth);
        shakerLuck.add(luckButton.text);
        shakerLuck.add(luckButton.background);
        var luckTxt = drawDescription(add(luckYFn, Height.get(48, 2)), self.messages.get(KEY, LUCK_DESCRIPTION));
        self.messages.add(luckTxt, luckTxt.data, KEY, LUCK_DESCRIPTION);
        var luckBG = drawBackGround(luckYFn);

        showButtons();

        function drawBackGround(yFn) {
            return self.stage.drawRectangle(Width.HALF, add(yFn, Height.get(48)), Width.get(10, 9), Height.get(48, 6),
                WHITE, true, undefined, 3, 0.1);
        }

        function drawDescription(yFn, txt) {
            return self.stage.drawText(Width.get(32, 16), yFn, txt, Font._60, FONT, LIGHT_GREY, undefined, undefined,
                undefined, undefined, Width.HALF, Height.get(50));
        }

        function buttonsWidth(width) {
            return Width.get(32, 5)(width);
        }

        function drawLine(yFn, fullCount) {
            var one = drawOne(Width.get(32, 11), yFn, fullCount > 0);
            var two = drawOne(Width.get(32, 16), yFn, fullCount > 1);
            var three = drawOne(Width.get(32, 21), yFn, fullCount > 2);
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
})(Width, Height, add, Font);