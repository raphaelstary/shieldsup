var ShopTutorial = (function (Width, Height, Font, subtract, add, Math) {
    "use strict";

    function ShopTutorial(services) {
        this.stage = services.stage;
        this.messages = services.messages;
        this.buttons = services.buttons;
        this.sceneStorage = services.sceneStorage;
    }

    var KEY = 'shop_tutorial';

    var COMMON_KEY = 'common_buttons';

    var FONT = 'GameFont';
    var SPECIAL_FONT = 'SpecialGameFont';
    var WHITE = '#fff';
    var VIOLET = '#3a2e3f';
    var GOLD = '#ffd700';
    var DARK_GOLD = '#B8860B';
    var LIGHT_GREY = '#c4c4c4';

    ShopTutorial.prototype.show = function (next) {
        var self = this;
        var drawables = [];

        drawables.push(self.stage.drawText(Width.HALF, Height.HALF, self.messages.get(KEY, 'shop_txt'), Font._40, FONT,
            WHITE, 7, undefined, undefined, undefined, Width.get(10, 8), Height.get(80, 3)));

        var resumeButton = self.buttons.createPrimaryButton(Width.HALF, Height.get(48, 40),
            self.messages.get(COMMON_KEY, 'resume'), endScene, 7, false, getButtonWidth);
        self.sceneStorage.menuSceneButtons.push(resumeButton);

        function getButtonWidth(width, height) {
            if (width < height) {
                return Width.HALF(width);
            }
            return Width.QUARTER(width);
        }

        var itIsOver = false;

        function endScene() {
            if (itIsOver)
                return;
            itIsOver = true;
            function removeDrawables() {
                drawables.forEach(self.stage.remove.bind(self.stage));
            }

            function removeButtons() {
                self.sceneStorage.menuSceneButtons.forEach(self.buttons.remove.bind(self.buttons));
                self.sceneStorage.menuSceneButtons = [];
            }

            removeDrawables();
            removeButtons();
            next();
        }
    };

    return ShopTutorial;
})(Width, Height, Font, subtract, add, Math);