var PauseMenu = (function (Settings, Achievements, Width, Height) {
    "use strict";

    function PauseMenu(services) {
        this.stage = services.stage;
        this.messages = services.messages;
        this.buttons = services.buttons;
        this.sceneStorage = services.sceneStorage;
        this.events = services.events;
        this.sounds = services.sounds;
        this.device = services.device;
    }

    var KEY = 'pause_menu';
    var MISSIONS = 'missions';
    var COMPLETE = 'complete';

    var BUTTON_KEY = 'common_buttons';
    var ACHIEVEMENTS = 'achievements';
    var SETTINGS = 'settings';
    var RESUME = 'resume';

    var FONT = 'GameFont';
    var SPECIAL_FONT = 'SpecialGameFont';
    var WHITE = '#fff';
    var LIGHT_GREY = '#c4c4c4';
    var VIOLET = '#3a2e3f';

    PauseMenu.prototype.show = function (next) {
        var self = this;
        var drawables;

        constructPauseMenu();

        function destructPauseMenu() {
            self.sceneStorage.menuSceneButtons.forEach(function (button) {
                self.buttons.remove(button);
            });
            drawables.forEach(function (drawable) {
                self.stage.remove(drawable);
            });
            drawables = undefined;
            self.sceneStorage.menuSceneButtons = [];
        }

        function constructPauseMenu() {
            drawables = [];

            var quests_header = self.stage.drawText(Width.THIRD, Height.get(48, 5), self.messages.get(KEY, MISSIONS),
                Font._30, SPECIAL_FONT, WHITE, 8);
            drawables.push(quests_header);

            var quest_count_txt = self.stage.drawText(Width.THREE_QUARTER, Height.get(48, 5),
                '2 / 40 ' + self.messages.get(KEY, COMPLETE), Font._60, FONT, LIGHT_GREY, 8);
            drawables.push(quest_count_txt);

            showQuest(Height.get(48, 10), 'Reach 500 meters');
            showQuest(Height.get(48, 16), 'Destroy 10 asteroids in one run without taking a hit');
            showQuest(Height.get(48, 22), 'Collect 10 stars in a row');

            function showQuest(yFn, text) {
                var background = self.stage.drawRectangle(Width.HALF, yFn, Width.get(10, 9), Height.get(48, 5), VIOLET,
                    true, undefined, 7);
                var textDrawable = self.stage.drawText(Width.HALF, yFn, text, Font._60, FONT, LIGHT_GREY, 8);
                drawables.push(background, textDrawable);
            }

            var achievementsButton = self.buttons.createSecondaryButton(Width.HALF, Height.get(480, 315),
                self.messages.get(BUTTON_KEY, ACHIEVEMENTS), showAchievements, 7, false, getButtonWidth);
            self.sceneStorage.menuSceneButtons.push(achievementsButton);

            var settingsButton = self.buttons.createSecondaryButton(Width.HALF, Height.get(480, 350),
                self.messages.get(BUTTON_KEY, SETTINGS), showSettings, 7, false, getButtonWidth);
            self.sceneStorage.menuSceneButtons.push(settingsButton);

            var resumeButton = self.buttons.createPrimaryButton(Width.HALF, Height.get(48, 40),
                self.messages.get(BUTTON_KEY, RESUME), showNextScene, 7, false, getButtonWidth);
            self.sceneStorage.menuSceneButtons.push(resumeButton);

            function getButtonWidth(width, height) {
                if (width < height) {
                    return Width.HALF(width);
                }
                return Width.QUARTER(width);
            }
        }

        function showSettings() {
            destructPauseMenu();
            var settings = new Settings({
                stage: self.stage,
                buttons: self.buttons,
                messages: self.messages,
                events: self.events,
                sceneStorage: self.sceneStorage,
                device: self.device,
                sounds: self.sounds
            });
            settings.show(constructPauseMenu);
        }

        function showAchievements() {
            destructPauseMenu();
            var achievements = new Achievements({
                stage: self.stage,
                buttons: self.buttons,
                messages: self.messages,
                sceneStorage: self.sceneStorage
            });
            achievements.show(constructPauseMenu);
        }

        function showNextScene() {
            destructPauseMenu();
            next();
        }
    };

    return PauseMenu;
})(Settings, Achievements, Width, Height);