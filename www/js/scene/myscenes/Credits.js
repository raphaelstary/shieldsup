var Credits = (function (Transition, window, calcScreenConst, widthHalf, heightQuarter, fontSize_15, subtract,
    fontSize_30, heightHalf, add, heightThreeQuarter, heightFourFifth, fontSize_35) {
    "use strict";

    function Credits(services) {
        this.stage = services.stage;
        this.tap = services.tap;
        this.messages = services.messages;
        this.sounds = services.sounds;
        this.buttons = services.buttons;
    }

    var KEY = 'credits';
    var GAME_MSG = 'game';
    var A_MSG = 'a';
    var BACK_MSG = 'back';
    var BY_MSG = 'by';
    var FACEBOOK = 'facebook.com/RaphaelStary';
    var TWITTER = 'twitter.com/RaphaelStary';
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

        function getBackX(width) {
            return calcScreenConst(width, 10);
        }

        function getBackY(height) {
            return calcScreenConst(height, 25, 2);
        }

        var backButton = self.buttons.createSecondaryButton(getBackX, getBackY, self.messages.get(KEY, BACK_MSG),
            endScene);
        var game_txt = self.stage.drawText(widthHalf, heightQuarter, self.messages.get(KEY, GAME_MSG), fontSize_15,
            SPECIAL_FONT, LIGHT_GREY);
        var a_txt = self.stage.drawText(widthHalf, subtract(heightQuarter, fontSize_15), self.messages.get(KEY, A_MSG),
            fontSize_30, SPECIAL_FONT, LIGHT_GREY);
        var by_txt = self.stage.drawText(widthHalf, add(heightQuarter, fontSize_15), self.messages.get(KEY, BY_MSG),
            fontSize_30, SPECIAL_FONT, LIGHT_GREY);

        var raphaelStary = self.stage.drawText(widthHalf, heightHalf, RAPHAEL_STARY, fontSize_15, LOGO_FONT, WHITE);
        var fb = self.buttons.createSecondaryButton(widthHalf, add(heightHalf, fontSize_15), FACEBOOK, function () {
            window.open(FACEBOOK_URL, _BLANK);
        }, true);
        var twitter = self.buttons.createSecondaryButton(widthHalf, add(heightHalf, fontSize_15), TWITTER, function () {
            window.open(TWITTER_URL, _BLANK);
        }, true);
        var www = self.buttons.createSecondaryButton(widthHalf, add(heightHalf, fontSize_15), WWW, function () {
            window.open(SITE_URL, _BLANK);
        }, true);

        var graphics_txt = self.stage.drawText(widthHalf, heightThreeQuarter, self.messages.get(KEY, GRAPHICS_MSG),
            fontSize_35, SPECIAL_FONT, LIGHT_GREY);
        var kenney = self.stage.drawText(widthHalf, heightFourFifth, KENNEY_MSG, fontSize_35, FONT, LIGHT_GREY);

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
})(Transition, window, calcScreenConst, widthHalf, heightQuarter, fontSize_15, subtract, fontSize_30, heightHalf, add,
    heightThreeQuarter, heightFourFifth, fontSize_35);
