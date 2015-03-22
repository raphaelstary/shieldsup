var NextQuests = (function (Width, Height, changeSign, Font, Transition, add) {
    "use strict";

    function NextQuests(services) {
        this.stage = services.stage;
        this.messages = services.messages;
        this.buttons = services.buttons;
        this.sceneStorage = services.sceneStorage;
        this.timer = services.timer;
        this.missions = services.missions;
    }

    var FONT = 'GameFont';
    var WHITE = '#fff';
    var MISSION_KEY = 'mission';
    var MISSIONS = 'missions';
    var SPECIAL_FONT = 'SpecialGameFont';

    NextQuests.prototype.show = function (next) {
        var self = this;
        var speed = this.sceneStorage.do30fps ? 45 : 90;

        var drawables = [];
        var activeMissions = this.missions.getActiveMissions();
        activeMissions.forEach(function (mission, index, missions) {
            var delay = index > 0 ? index * 10 : undefined;
            var forceNext = missions.length - 1 == index;
            drawables.push.apply(drawables, questIn(Height.get(48, index * 8 + 10), mission, delay, forceNext));
        });

        var quests_header = self.stage.drawText(Width.THIRD, Height.get(48, 5),
            self.messages.get('pause_menu', MISSIONS), Font._30, SPECIAL_FONT, WHITE, 5);

        function questIn(yFn, mission, delay, forceNext) {
            var returnList = [];

            var msg = self.messages.get(MISSION_KEY, mission.msgKey);
            if (mission.allTime)
                msg += ' ( ' + mission.count + ' / ' + mission.max + ' )';

            var bg = self.stage.drawRectangle(changeSign(Width.HALF), yFn, Width.get(10, 9), Height.get(480, 60), WHITE,
                true, undefined, 4, 0.5);
            returnList.push(bg);
            var txt = self.stage.drawText(changeSign(Width.HALF), yFn, msg, Font._40, FONT, WHITE, 5, undefined,
                undefined, undefined, Width.get(10, 8), Height.get(80, 3));
            returnList.push(txt);

            if (delay) {
                self.stage.moveLater(bg, Width.HALF, yFn, speed, Transition.EASE_IN_SIN, false, questOut(bg, yFn),
                    undefined, delay);
                self.stage.moveLater(txt, Width.HALF, yFn, speed, Transition.EASE_IN_SIN, false,
                    questOut(txt, yFn, forceNext), undefined, delay);
            } else {
                self.stage.move(bg, Width.HALF, yFn, speed, Transition.EASE_IN_SIN, false, questOut(bg, yFn));
                self.stage.move(txt, Width.HALF, yFn, speed, Transition.EASE_IN_SIN, false,
                    questOut(txt, yFn, forceNext));
            }

            return returnList;
        }

        function questOut(drawable, yFn, forceNext) {
            return function () {
                self.timer.doLater(function () {
                    if (itIsOver)
                        return;
                    self.stage.move(drawable, add(Width.HALF, Width.FULL), yFn, speed, Transition.EASE_OUT_SIN, false,
                        function () {
                            self.stage.remove(drawable);
                            if (forceNext) {
                                nextScene();
                            }
                        });
                }, speed * 2);
            };
        }

        var itIsOver = false;

        function nextScene() {
            if (itIsOver)
                return;
            itIsOver = true;
            self.stage.remove(quests_header);
            drawables = undefined;
            self.buttons.remove(skipButton);
            next();
        }

        var skipButton = self.buttons.createSecondaryButton(Width.get(32, 24), Height.BOTTOM_RASTER,
            self.messages.get('common_buttons', 'skip'), function () {
                drawables.forEach(self.stage.remove.bind(self.stage));
                nextScene();
            }, 3);
    };

    return NextQuests;
})(Width, Height, changeSign, Font, Transition, add);