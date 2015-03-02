var Credits = (function (Transition, window, calcScreenConst, subtract, add, Width, Height, Font) {
    "use strict";

    function Credits(services) {
        this.stage = services.stage;
        this.messages = services.messages;
        this.buttons = services.buttons;
        this.sceneStorage = services.sceneStorage;
    }

    var KEY = 'credits';
    var GAME_MSG = 'game';
    var A_MSG = 'a';
    var BACK_MSG = 'back';
    var BY_MSG = 'by';
    var FACEBOOK = 'facebook/RaphaelStary';
    var TWITTER = 'twitter/RaphaelStary';
    var WWW = 'raphaelstary.com';
    var GRAPHICS_MSG = 'graphics';
    var KENNEY_MSG = 'Kenney.nl Assets';

    var SPECIAL_FONT = 'SpecialGameFont';
    var LIGHT_GREY = '#c4c4c4';
    var FONT = 'GameFont';
    var WHITE = '#fff';
    var RAPHAEL_STARY = 'RAPHAEL STARY';
    var LOGO_FONT = 'LogoFont';

    var TWITTER_URL = 'https://twitter.com/RaphaelStary';
    var FACEBOOK_URL = 'https://facebook.com/RaphaelStary';
    var SITE_URL = 'http://raphaelstary.com';

    var _BLANK = '_blank';

    Credits.prototype.show = function (nextScene) {
        var self = this;
        var texts = [];
        var backButton = self.buttons.createSecondaryButton(Width.get(32, 5), Height.get(25, 2),
            self.messages.get('common_buttons', BACK_MSG), endScene, 7);
        self.sceneStorage.menuSceneButtons.push(backButton);
        var game_txt = self.stage.drawText(Width.HALF, Height.QUARTER, self.messages.get(KEY, GAME_MSG), Font._15,
            SPECIAL_FONT, LIGHT_GREY, 8);
        texts.push(game_txt);
        var a_txt = self.stage.drawText(Width.HALF, subtract(Height.QUARTER, Font._15.bind(0, 0)),
            self.messages.get(KEY, A_MSG), Font._30, SPECIAL_FONT, LIGHT_GREY, 8);
        texts.push(a_txt);
        var by_txt = self.stage.drawText(Width.HALF, add(Height.QUARTER, Font._15.bind(0, 0)),
            self.messages.get(KEY, BY_MSG), Font._30, SPECIAL_FONT, LIGHT_GREY, 8);
        texts.push(by_txt);
        var raphaelStary = self.stage.drawText(Width.HALF, Height.get(48, 22), RAPHAEL_STARY, Font._5, LOGO_FONT, WHITE,
            8);
        texts.push(raphaelStary);
        function buttonsWidth(width, height) {
            if (width < height * 1.2) {
                return Width.TWO_THIRD(width);
            }
            return Width.THIRD(width);
        }
        var fb = self.buttons.createSecondaryButton(Width.HALF, Height.get(48, 28), FACEBOOK, function () {
            window.open(FACEBOOK_URL, _BLANK);
        }, 7, true, buttonsWidth);
        self.sceneStorage.menuSceneButtons.push(fb);
        var twitter = self.buttons.createSecondaryButton(Width.HALF, Height.get(48, 32), TWITTER, function () {
            window.open(TWITTER_URL, _BLANK);
        }, 7, true, buttonsWidth);
        self.sceneStorage.menuSceneButtons.push(twitter);
        var www = self.buttons.createSecondaryButton(Width.HALF, Height.get(48, 36), WWW, function () {
            window.open(SITE_URL, _BLANK);
        }, 7, true, buttonsWidth);
        self.sceneStorage.menuSceneButtons.push(www);
        var graphics_txt = self.stage.drawText(Width.HALF, Height.get(48, 40), self.messages.get(KEY, GRAPHICS_MSG),
            Font._35, SPECIAL_FONT, LIGHT_GREY, 8);
        texts.push(graphics_txt);
        var kenney = self.stage.drawText(Width.HALF, Height.get(48, 42), KENNEY_MSG, Font._60, FONT, LIGHT_GREY, 8);
        texts.push(kenney);
        function endScene() {
            function removeDrawables() {
                texts.forEach(self.stage.remove.bind(self.stage));
            }

            function removeButtons() {
                self.sceneStorage.menuSceneButtons.forEach(self.buttons.remove.bind(self.buttons));
                self.sceneStorage.menuSceneButtons = [];
            }

            removeDrawables();
            removeButtons();
            nextScene();
        }
    };

    return Credits;
})(Transition, window, calcScreenConst, subtract, add, Width, Height, Font);