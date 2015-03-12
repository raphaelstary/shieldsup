var CompletedQuests = (function (Width, Height, changeSign, Font, Transition, add, subtract, Math) {
    "use strict";

    function CompletedQuests(services) {
        this.stage = services.stage;
        this.messages = services.messages;
        this.buttons = services.buttons;
        this.sceneStorage = services.sceneStorage;
        this.timer = services.timer;
        this.mission = services.mission;
    }

    var DONE = 'done';
    var MISSIONS = 'missions';
    var COMPLETE = 'complete';
    var SKIP = 'skip';
    var MISSION_KEY = 'mission';

    var FONT = 'GameFont';
    var SPECIAL_FONT = 'SpecialGameFont';
    var WHITE = '#fff';
    var GOLD = '#ffd700';
    var DARK_GOLD = '#B8860B';

    CompletedQuests.prototype.show = function (next) {
        var missions = this.mission.checkActiveMissions(this.sceneStorage.gameStats);
        var showScreen = missions.some(function (mission) {
            return mission.success;
        });

        if (!showScreen) {
            next();
            return;
        }

        var self = this;
        var speed = this.sceneStorage.do30fps ? 30 : 60;
        var duration = this.sceneStorage.do30fps ? 45 : 90;
        var _10 = this.sceneStorage.do30fps ? 5 : 10;

        var quests_header = self.stage.drawText(Width.THIRD, Height.get(48, 5),
            self.messages.get('pause_menu', MISSIONS), Font._30, SPECIAL_FONT, WHITE, 5);

        //var quest_count_txt = self.stage.drawText(Width.THREE_QUARTER, Height.get(48, 5),
        //    '2 / 40 ' + self.messages.get('pause_menu', COMPLETE), Font._60, FONT, WHITE, 5);

        var drawables = [];
        if (missions.length > 0)
            drawables.push.apply(drawables,
                questIn(Height.get(48, 10), this.messages.get(MISSION_KEY, missions[0].msgKey), missions[0].success,
                    undefined, missions.length <= 1));
        if (missions.length > 1)
            drawables.push.apply(drawables,
                questIn(Height.get(48, 18), this.messages.get(MISSION_KEY, missions[1].msgKey), missions[1].success, 10,
                    missions.length <= 2));
        if (missions.length > 2)
            drawables.push.apply(drawables,
                questIn(Height.get(48, 26), this.messages.get(MISSION_KEY, missions[2].msgKey), missions[2].success, 20,
                    true));

        function questIn(yFn, name, success, delay, forceNext) {
            var bg = self.stage.drawRectangle(changeSign(Width.HALF), yFn, Width.get(10, 9), Height.get(480, 60), WHITE,
                true, undefined, 4, 0.5);
            var txt = self.stage.drawText(changeSign(Width.HALF), yFn, name, Font._40, FONT, WHITE, 5, undefined,
                undefined, undefined, Width.get(10, 8), Height.get(80, 3));

            if (delay) {
                self.stage.moveLater(bg, Width.HALF, yFn, speed, Transition.EASE_IN_EXPO, false,
                    questOut(bg, yFn, success), undefined, delay);
                self.stage.moveLater(txt, Width.HALF, yFn, speed, Transition.EASE_IN_EXPO, false,
                    questOut(txt, yFn, false, forceNext), undefined, delay);
            } else {
                self.stage.move(bg, Width.HALF, yFn, speed, Transition.EASE_IN_EXPO, false, questOut(bg, yFn, success));
                self.stage.move(txt, Width.HALF, yFn, speed, Transition.EASE_IN_EXPO, false,
                    questOut(txt, yFn, false, forceNext));
            }

            return [bg, txt];
        }

        var doOnce = true;

        function questOut(drawable, yFn, success, forceNext) {
            return function () {
                var badge;
                if (success) {
                    self.timer.doLater(function () {
                        if (itIsOver)
                            return;
                        drawable.data.color = DARK_GOLD;
                        badge = self.stage.drawText(Width.get(20, 17), subtract(yFn, Height.get(480, 10)),
                            self.messages.get('achievements', DONE), Font._40, SPECIAL_FONT, GOLD, 8, undefined,
                            Math.PI / 8);
                        drawables.push(badge);
                    }, _10);
                }
                self.timer.doLater(function () {
                    if (itIsOver)
                        return;
                    if (doOnce) {
                        doOnce = false;
                        self.stage.remove(quests_header);
                        //self.stage.remove(quest_count_txt);
                    }
                    if (badge) {
                        self.stage.remove(badge);
                    }
                    self.stage.move(drawable, add(Width.HALF, Width.FULL), yFn, speed, Transition.EASE_OUT_EXPO, false,
                        function () {
                            self.stage.remove(drawable);
                            if (forceNext) {
                                nextScene();
                            }
                        });
                }, duration * 2);
            };
        }

        var itIsOver = false;

        function nextScene() {
            if (itIsOver)
                return;
            itIsOver = true;
            self.buttons.remove(skipButton);
            next();
        }

        var skipButton = self.buttons.createSecondaryButton(Width.get(32, 24), Height.BOTTOM_RASTER,
            self.messages.get('common_buttons', SKIP), function () {
                drawables.forEach(self.stage.remove.bind(self.stage));
                self.stage.remove(quests_header);
                //self.stage.remove(quest_count_txt);
                nextScene();
            }, 3);
    };

    return CompletedQuests;
})(Width, Height, changeSign, Font, Transition, add, subtract, Math);