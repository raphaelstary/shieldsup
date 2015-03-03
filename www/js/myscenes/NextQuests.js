var NextQuests = (function (Width, Height, changeSign, Font, Transition, add) {
    "use strict";

    function NextQuests(services) {
        this.stage = services.stage;
        this.messages = services.messages;
        this.buttons = services.buttons;
        this.sceneStorage = services.sceneStorage;
        this.timer = services.timer;
    }

    var KEY = 'quests';

    var FONT = 'GameFont';
    var WHITE = '#fff';
    var VIOLET = '#3a2e3f';
    var LIGHT_GREY = '#c4c4c4';

    NextQuests.prototype.show = function (next) {
        var self = this;
        var speed = this.sceneStorage.do30fps ? 45 : 90;

        questIn(Height.get(48, 10), 'Reach 500 meters');
        questIn(Height.get(48, 18), 'Destroy 10 asteroids in one run without taking a hit', 10);
        questIn(Height.get(48, 26), 'Collect 10 stars in a row', 20, true);

        function questIn(yFn, name, delay, forceNext) {
            var bg = self.stage.drawRectangle(changeSign(Width.HALF), yFn, Width.get(10, 9), Height.get(480, 60), WHITE,
                true, undefined, 4, 0.5);
            var txt = self.stage.drawText(changeSign(Width.HALF), yFn, name, Font._40, FONT, WHITE, 5, undefined,
                undefined, undefined, Width.get(10, 8), Height.get(80, 3));

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
        }

        function questOut(drawable, yFn, forceNext) {
            return function () {
                self.timer.doLater(function () {
                    self.stage.move(drawable, add(Width.HALF, Width.FULL), yFn, speed, Transition.EASE_OUT_SIN, false,
                        function () {
                            self.stage.remove(drawable);
                            if (forceNext) {
                                next();
                            }
                        });
                }, speed * 2);
            };
        }
    };

    return NextQuests;
})(Width, Height, changeSign, Font, Transition, add);