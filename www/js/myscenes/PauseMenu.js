var PauseMenu = (function (Settings, Achievements, Width, Height, Font, loadInteger) {
    "use strict";

    function PauseMenu(services) {
        this.stage = services.stage;
        this.messages = services.messages;
        this.buttons = services.buttons;
        this.sceneStorage = services.sceneStorage;
        this.events = services.events;
        this.sounds = services.sounds;
        this.device = services.device;
        this.missions = services.missions;
    }

    var KEY = 'pause_menu';
    var MISSIONS = 'missions';
    var COMPLETE = 'complete';
    var MISSION_KEY = 'mission';
    var BUTTON_KEY = 'common_buttons';
    var ACHIEVEMENTS = 'achievements';
    var SETTINGS = 'settings';
    var RESUME = 'resume';

    var FONT = 'GameFont';
    var SPECIAL_FONT = 'SpecialGameFont';
    var WHITE = '#fff';
    var LIGHT_GREY = '#c4c4c4';
    var VIOLET = '#3a2e3f';

    var GAME_KEY = 'shields_up-';
    var STORAGE_MISSIONS_COMPLETE = GAME_KEY + 'mission_complete_count';
    var TOTAL_MISSIONS = 40;

    PauseMenu.prototype.show = function (next) {
        var self = this;
        var drawables;
        var translatedDrawables;

        constructPauseMenu();

        function destructPauseMenu() {
            self.sceneStorage.menuSceneButtons.forEach(self.buttons.remove.bind(self.buttons));
            drawables.forEach(self.stage.remove.bind(self.stage));
            drawables = undefined;
            self.sceneStorage.menuSceneButtons = [];
            translatedDrawables.forEach(self.messages.remove.bind(self.messages));
            translatedDrawables = undefined;
        }

        function constructPauseMenu() {
            drawables = [];
            translatedDrawables = [];

            var quests_header = self.stage.drawText(Width.THIRD, Height.get(48, 5), self.messages.get(KEY, MISSIONS),
                Font._30, SPECIAL_FONT, WHITE, 8);
            drawables.push(quests_header);

            var quest_count_txt = self.stage.drawText(Width.THREE_QUARTER, Height.get(48, 5),
                loadInteger(STORAGE_MISSIONS_COMPLETE) + ' / ' + TOTAL_MISSIONS + ' ' +
                self.messages.get(KEY, COMPLETE), Font._60, FONT, LIGHT_GREY, 8);
            drawables.push(quest_count_txt);

            var activeMissions = self.missions.softCheck(self.sceneStorage.gameStats);
            activeMissions.forEach(function (mission, index) {
                showQuest(Height.get(48, index * 7 + 10), mission);
            });

            function showQuest(yFn, mission) {
                var background = self.stage.drawRectangle(Width.HALF, yFn, Width.get(10, 9), Height.get(48, 6), VIOLET,
                    true, undefined, 7);
                var msgKey = mission.msgKey;
                var msg = self.messages.get(MISSION_KEY, msgKey);
                if (mission.allTime)
                    msg += '\u00A0' + ' (\u00A0' + mission.count + '\u00A0/\u00A0' + mission.max + '\u00A0)';

                var textDrawable = self.stage.drawText(Width.HALF, yFn, msg, Font._40, FONT, LIGHT_GREY, 8, undefined,
                    undefined, undefined, Width.get(10, 8), Height.get(25));
                drawables.push(background, textDrawable);
                self.messages.add(textDrawable, textDrawable.data, MISSION_KEY, msgKey);
                translatedDrawables.push(textDrawable);
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
})(Settings, Achievements, Width, Height, Font, loadInteger);