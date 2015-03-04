var NextQuests = (function (Width, Height, changeSign, Font, Transition, add) {
    "use strict";

    function NextQuests(services) {
        this.stage = services.stage;
        this.messages = services.messages;
        this.buttons = services.buttons;
        this.sceneStorage = services.sceneStorage;
        this.timer = services.timer;
    }

    var FONT = 'GameFont';
    var WHITE = '#fff';

    NextQuests.prototype.show = function (next) {
        var self = this;
        var speed = this.sceneStorage.do30fps ? 45 : 90;

        var drawables = [];
        drawables.push.apply(drawables, questIn(Height.get(48, 10), 'Reach 500 meters'));
        drawables.push.apply(drawables,
            questIn(Height.get(48, 18), 'Destroy 10 asteroids in one run without taking a hit', 10));
        drawables.push.apply(drawables, questIn(Height.get(48, 26), 'Collect 10 stars in a row', 20, true));

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

            return [bg, txt];
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
            drawables = undefined;
            self.buttons.remove(skipButton);
            next();
        }

        var skipButton = self.buttons.createSecondaryButton(Width.THREE_QUARTER, Height._400,
            self.messages.get('common_buttons', 'skip'), function () {
                drawables.forEach(self.stage.remove.bind(self.stage));
                nextScene();
            }, 3);
    };

    return NextQuests;
})(Width, Height, changeSign, Font, Transition, add);