var GetReady = (function (Transition, calcScreenConst, changeSign, Width, Height, Font, multiply) {
    "use strict";

    function GetReady(services) {
        this.stage = services.stage;
        this.messages = services.messages;
        this.events = services.events;
    }

    var KEY = 'game';
    var GET_READY = 'get_ready';
    var FONT = 'GameFont';
    var LIGHT_GRAY = '#D3D3D3';

    GetReady.prototype.show = function (nextScene) {
        var self = this;

        var readyDrawable = self.stage.moveFreshText(changeSign(Width.FULL), Height.THIRD,
            self.messages.get(KEY, GET_READY), Font._15, FONT, LIGHT_GRAY, multiply(Width.FULL, 2), Height.THIRD, 180,
            Transition.EASE_OUT_IN_SIN, false, function () {

                self.stage.remove(readyDrawable);
                self.events.unsubscribe(stop);
                self.events.unsubscribe(resume);
                nextScene();
            }).drawable;

        var stop = this.events.subscribe('stop', function () {
            self.stage.pause(readyDrawable);
        });
        var resume = this.events.subscribe('resume', function () {
            self.stage.play(readyDrawable);
        });
    };

    return GetReady;
})(Transition, calcScreenConst, changeSign, Width, Height, Font, multiply);
