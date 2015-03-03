var Achievements = (function (Width, Height, Font, subtract, add, Math) {
    "use strict";

    function Achievements(services) {
        this.stage = services.stage;
        this.messages = services.messages;
        this.buttons = services.buttons;
        this.sceneStorage = services.sceneStorage;
    }

    var KEY = 'achievements';
    var DONE = 'done';
    var CONQUEROR = 'conqueror';
    var SHOPPING_QUEEN = 'shopping_queen';
    var CLOSER = 'closer';
    var LIVE_ONCE = 'live_once';
    var STAR_GAZER = 'star_gazer';
    var FASTER_THAN_LIGHT = 'faster_than_light';

    var COMMON_KEY = 'common_buttons';
    var BACK = 'back';

    var FONT = 'GameFont';
    var SPECIAL_FONT = 'SpecialGameFont';
    var WHITE = '#fff';
    var VIOLET = '#3a2e3f';
    var GOLD = '#ffd700';
    var DARK_GOLD = '#B8860B';
    var LIGHT_GREY = '#c4c4c4';

    Achievements.prototype.show = function (next) {
        var self = this;
        var drawables = [];

        var backButton = self.buttons.createSecondaryButton(Width.get(32, 5), Height.get(48, 3),
            self.messages.get(COMMON_KEY, BACK), endScene, 7);
        self.sceneStorage.menuSceneButtons.push(backButton);

        drawAchievement(Height.get(48, 8), CONQUEROR);
        drawAchievement(Height.get(48, 14), SHOPPING_QUEEN);
        drawAchievement(Height.get(48, 20), CLOSER, true);
        drawAchievement(Height.get(48, 26), LIVE_ONCE);
        drawAchievement(Height.get(48, 32), STAR_GAZER);
        drawAchievement(Height.get(48, 38), FASTER_THAN_LIGHT);

        function drawAchievement(yFn, header, complete) {
            var achievement_1_bg = self.stage.drawRectangle(Width.HALF, yFn, Width.get(10, 9), Height.get(480, 50),
                complete ? DARK_GOLD : VIOLET, true, undefined, 7);
            if (complete) {
                drawables.push(self.stage.drawText(Width.get(20, 17), subtract(yFn, Height.get(480, 10)),
                    self.messages.get(KEY, DONE), Font._40, SPECIAL_FONT, GOLD, 8, undefined, Math.PI / 8));
            }
            var achievement_1_header = self.stage.drawText(Width.HALF, subtract(yFn, Height.get(480, 13)),
                self.messages.get(KEY, header), Font._40, SPECIAL_FONT, WHITE, 8);
            var achievement_1_text = self.stage.drawText(Width.HALF, add(yFn, Height.get(480, 10)),
                self.messages.get(KEY, header + '_description'), Font._60, FONT, LIGHT_GREY, 8);
            drawables.push(achievement_1_bg, achievement_1_header, achievement_1_text);
        }

        function endScene() {
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

    return Achievements;
})(Width, Height, Font, subtract, add, Math);