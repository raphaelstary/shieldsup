var Shop = (function (Width, Height, add, Font, ScreenShaker, localStorage, Event) {
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

    var GAME_KEY = 'shields_up-';
    var TOTAL_STARS = GAME_KEY + 'total_stars';
    var SHOP_ENERGY = GAME_KEY + 'shop_energy';
    var SHOP_LIFE = GAME_KEY + 'shop_life';
    var SHOP_LUCK = GAME_KEY + 'shop_luck';

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

    var MENU_SETTINGS = 'settings';
    var MENU_ACHIEVEMENTS = 'achievements';

    var energyPrices = [100, 300, 900];
    var lifePrices = [200, 400, 1200];
    var luckPrices = [150, 350, 1000];

    Shop.prototype.show = function (next) {
        var self = this, totalStarsValue, starsValue, energyItem, lifeItem, luckItem;

        var header = self.stage.drawText(Width.HALF, Height.get(48, 4), self.messages.get(KEY, SHOP), Font._15, FONT,
            LIGHT_GREY);
        self.messages.add(header, header.data, KEY, SHOP);

        var starsYFn = Height.get(48, 8);
        var starLeft = self.stage.drawFresh(Width.get(10, 3), starsYFn, STAR);
        var starRight = self.stage.drawFresh(Width.get(10, 7), starsYFn, STAR);

        var symbolXFn = Width.get(32, 5);

        var energyYFn = Height.get(48, 13);
        var shields = self.stage.drawFresh(symbolXFn, add(energyYFn, Height.get(48)), SHIELDS, undefined, undefined,
            undefined, undefined, 0.2);
        var energy = self.stage.drawFresh(symbolXFn, add(energyYFn, Height.get(48, 3)), ENERGY_FULL, undefined,
            undefined, undefined, undefined, 0.2);

        var lifeYFn = Height.get(48, 20);
        var life = self.stage.drawFresh(symbolXFn, add(lifeYFn, Height.get(48)), PLAYER_LIFE);

        var luckYFn = Height.get(48, 27);
        var luck = self.stage.drawText(symbolXFn, add(luckYFn, Height.get(48)), self.messages.get(KEY, LUCK), Font._40,
            FONT, WHITE);
        self.messages.add(luck, luck.data, KEY, LUCK);

        createShopItems();
        showButtons();

        function createShopItems() {
            totalStarsValue = loadInteger(TOTAL_STARS);
            starsValue = self.stage.drawText(Width.HALF, starsYFn, totalStarsValue.toString(), Font._20, SPECIAL_FONT,
                WHITE);

            energyItem = createShopItem(energyYFn, ENERGY_DESCRIPTION, SHOP_ENERGY, energyPrices);
            lifeItem = createShopItem(lifeYFn, LIFE_DESCRIPTION, SHOP_LIFE, lifePrices);
            luckItem = createShopItem(luckYFn, LUCK_DESCRIPTION, SHOP_LUCK, luckPrices);
        }

        function removeShopItems() {
            self.stage.remove(starsValue);

            removeShopItem(energyItem);
            removeShopItem(lifeItem);
            removeShopItem(luckItem);
        }

        function loadInteger(key) {
            var value = localStorage.getItem(key);
            if (value == null)
                return 0;
            return parseInt(value);
        }

        function createShopItem(yFn, descriptionKey, storageKey, prices) {
            var upgrades = loadInteger(storageKey);
            var price = prices[upgrades];

            var shaker = new ScreenShaker(self.device);
            var shakerResizeId = self.events.subscribe(Event.RESIZE, shaker.resize.bind(shaker));
            var shakerTickId = self.events.subscribe(Event.TICK_MOVE, shaker.update.bind(shaker));

            var line = drawLine(yFn, upgrades);
            var canBuy = true;
            var button = self.buttons.createSecondaryButton(Width.get(32, 27), add(yFn, Height.get(48)),
                price.toString(), function () {
                    if (canBuy) {
                        localStorage.setItem(storageKey, (++upgrades).toString());
                        localStorage.setItem(TOTAL_STARS, totalStarsValue - price);

                        removeShopItems();
                        createShopItems();
                    } else {
                        shaker.startSmallShake();
                    }
                }, 3, true, buttonsWidth);
            shaker.add(button.text);
            shaker.add(button.background);
            var description = drawDescription(add(yFn, Height.get(48, 2)), self.messages.get(KEY, descriptionKey));
            self.messages.add(description, description.data, KEY, descriptionKey);
            var background = drawBackGround(yFn);

            if (price > totalStarsValue) {
                canBuy = false;
                button.text.data.color = DARK_GRAY;
            }

            return {
                shaker: shaker,
                shakerResizeId: shakerResizeId,
                shakerTickId: shakerTickId,
                line: line,
                button: button,
                description: description,
                background: background
            }
        }

        function removeShopItem(item) {
            self.events.unsubscribe(item.shakerResizeId);
            self.events.unsubscribe(item.shakerTickId);
            item.line.forEach(self.stage.remove.bind(self.stage));
            self.buttons.remove(item.button);
            self.messages.remove(item.description);
            self.stage.remove(item.description);
            self.stage.remove(item.background);
        }

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
                self.sceneStorage.menuScene = MENU_SETTINGS;
                showSettingsScreen();
            }

            function goToAchievements() {
                self.sceneStorage.menuScene = MENU_ACHIEVEMENTS;
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
            self.messages.resetStorage();

            next();
        }
    };

    return Shop;
})(Width, Height, add, Font, ScreenShaker, lclStorage, Event);