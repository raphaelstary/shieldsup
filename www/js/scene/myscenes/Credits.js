var Credits = (function (Transition, window, calcScreenConst, subtract, add, Width, Height, Font) {
    "use strict";

    function Credits(services) {
        this.stage = services.stage;
        this.messages = services.messages;
        this.buttons = services.buttons;
    }

    var KEY = 'credits';
    var GAME_MSG = 'game';
    var A_MSG = 'a';
    var BACK_MSG = 'back';
    var BY_MSG = 'by';
    var FACEBOOK = 'facebook';
    var TWITTER = 'twitter';
    var WWW = 'www';
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

        var backButton = self.buttons.createSecondaryButton(Width.get(10), Height.get(25, 2),
            self.messages.get(KEY, BACK_MSG),
            endScene);
        var game_txt = self.stage.drawText(Width.HALF, Height.QUARTER, self.messages.get(KEY, GAME_MSG), Font._15,
            SPECIAL_FONT, LIGHT_GREY);
        var a_txt = self.stage.drawText(Width.HALF, subtract(Height.QUARTER, Font._15.bind(0, 0)),
            self.messages.get(KEY, A_MSG), Font._30, SPECIAL_FONT, LIGHT_GREY);
        var by_txt = self.stage.drawText(Width.HALF, add(Height.QUARTER, Font._15.bind(0, 0)),
            self.messages.get(KEY, BY_MSG), Font._30, SPECIAL_FONT, LIGHT_GREY);

        var raphaelStary = self.stage.drawText(Width.HALF, Height.get(48, 22), RAPHAEL_STARY, Font._5, LOGO_FONT,
            WHITE);

        var fb = self.buttons.createSecondaryButton(Width.HALF, Height.get(48, 28), FACEBOOK, function () {
            window.open(FACEBOOK_URL, _BLANK);
        }, true);
        var twitter = self.buttons.createSecondaryButton(Width.HALF, Height.get(48, 31), TWITTER, function () {
            window.open(TWITTER_URL, _BLANK);
        }, true);
        var www = self.buttons.createSecondaryButton(Width.HALF, Height.get(48, 34), WWW, function () {
            window.open(SITE_URL, _BLANK);
        }, true);

        var graphics_txt = self.stage.drawText(Width.HALF, Height.FOUR_FIFTH, self.messages.get(KEY, GRAPHICS_MSG),
            Font._35, SPECIAL_FONT, LIGHT_GREY);
        var kenney = self.stage.drawText(Width.HALF, Height._400, KENNEY_MSG, Font._60, FONT, LIGHT_GREY);

        function endScene() {
            function removeDrawables() {
                self.stage.remove(game_txt);
                self.stage.remove(a_txt);
                self.stage.remove(by_txt);
                self.stage.remove(raphaelStary);
                self.stage.remove(graphics_txt);
                self.stage.remove(kenney);
            }

            function removeButtons() {
                self.buttons.remove(fb);
                self.buttons.remove(twitter);
                self.buttons.remove(www);
                self.buttons.remove(backButton);
            }

            removeDrawables();
            removeButtons();
            nextScene();
        }
    };

    return Credits;
})(Transition, window, calcScreenConst, subtract, add, Width, Height, Font);
