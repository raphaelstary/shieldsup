var Achievements = (function () {
    "use strict";

    function Achievements(services) {
        this.stage = services.stage;
        this.messages = services.messages;
        this.buttons = services.buttons;
        this.sceneStorage = services.sceneStorage;
    }

    var KEY = 'achievements';
    var COMMON_KEY = 'common_buttons';
    var BACK = 'back';

    var FONT = 'GameFont';
    var SPECIAL_FONT = 'SpecialGameFont';
    var WHITE = '#fff';
    var VIOLET = '#3a2e3f';
    var GOLD = '#ffd700';
    var LIGHT_GREY = '#c4c4c4';

    Achievements.prototype.show = function (next) {
        var self = this;
        var drawables = [];

        var backButton = self.buttons.createSecondaryButton(Width.get(32, 5), Height.get(48, 3),
            self.messages.get(COMMON_KEY, BACK), endScene, 7);
        self.sceneStorage.menuSceneButtons.push(backButton);

        drawAchievement(Height.get(48, 8), 'Conqueror', 'Defeat the Monster at the End of the Asteroid');
        drawAchievement(Height.get(48, 14), 'Shopping Queen', 'Buy everything in the Shop');
        drawAchievement(Height.get(48, 20), 'The Finisher', 'Complete all Quests', true);
        drawAchievement(Height.get(48, 26), 'You Only Live Once', 'Loose no Life in a complete run.');
        drawAchievement(Height.get(48, 32), 'Star Gazer', 'Collect all Stars in a complete run');
        drawAchievement(Height.get(48, 38), 'Faster than Light', 'Complete the Quest mode in 1 hour or less');
        drawAchievement(Height.get(48, 44), 'Asteroid Miner', 'Destroy every Asteroid in a complete run');


        function drawAchievement(yFn, header, description, complete) {
            var achievement_1_bg = self.stage.drawRectangle(Width.HALF, yFn, Width.get(10, 9), Height.get(480, 50),
                complete ? GOLD : VIOLET, true, undefined, 7);
            var achievement_1_header = self.stage.drawText(Width.HALF, subtract(yFn, Height.get(480, 13)), header,
                Font._40, SPECIAL_FONT, WHITE, 8);
            var achievement_1_text = self.stage.drawText(Width.HALF, add(yFn, Height.get(480, 10)), description,
                Font._60, FONT, LIGHT_GREY, 8);
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
})();