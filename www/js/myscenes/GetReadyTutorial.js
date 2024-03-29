var GetReadyTutorial = (function (Transition, calcScreenConst, changeSign, Width, Height, Font, multiply) {
    "use strict";

    function GetReadyTutorial(services) {
        this.stage = services.stage;
        this.messages = services.messages;
        this.sounds = services.sounds;
        this.sceneStorage = services.sceneStorage;
    }

    var KEY = 'tutorial';
    var GET_READY = 'tutorial';
    var FONT = 'GameFont';
    var LIGHT_GRAY = '#D3D3D3';

    var MUSIC = 'neon';

    GetReadyTutorial.prototype.show = function (nextScene) {
        var self = this;
        var speed = this.sceneStorage.do30fps ? 90 : 180;
        var readyDrawable = self.stage.moveFreshText(changeSign(Width.FULL), Height.THIRD,
            self.messages.get(KEY, GET_READY), Font._15, FONT, LIGHT_GRAY, multiply(Width.FULL, 2), Height.THIRD, speed,
            Transition.EASE_OUT_IN_SIN, false, function () {

                self.stage.remove(readyDrawable);
                nextScene();
            }, undefined, 5).drawable;
    };

    return GetReadyTutorial;
})(Transition, calcScreenConst, changeSign, Width, Height, Font, multiply);
