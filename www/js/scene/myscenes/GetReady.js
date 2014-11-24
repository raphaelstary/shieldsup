var GetReady = (function (Transition, calcScreenConst, changeSign, width, fontSize_15, multiply) {
    "use strict";

    function GetReady(services) {
        this.stage = services.stage;
        this.messages = services.messages;
    }

    var GAME_MSG_KEY = 'game';
    var GET_READY = 'get_ready';
    var GAME_FONT = 'GameFont';
    var LIGHT_GRAY = '#D3D3D3';

    GetReady.prototype.show = function (nextScene) {
        var self = this;

        function getY(height) {
            return calcScreenConst(height, 3);
        }

        var readyDrawable = self.stage.moveFreshText(changeSign(width), getY,
            self.messages.get(GAME_MSG_KEY, GET_READY), fontSize_15, GAME_FONT, LIGHT_GRAY, multiply(width, 2), getY,
            180, Transition.EASE_OUT_IN_SIN, false, function () {

                // create end event method to end scene, this is endGetReadyScene
                self.stage.remove(readyDrawable);

                nextScene();
            }).drawable;
    };

    return GetReady;
})(Transition, calcScreenConst, changeSign, width, fontSize_15, multiply);
