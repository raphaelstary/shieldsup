var GoFullScreen = (function (Event, Width, Height, installOneTimeTap, isHit) {
    "use strict";

    function GoFullScreen(services) {
        this.stage = services.stage;
        this.events = services.events;
        this.buttons = services.buttons;
        this.messages = services.messages;
        this.device = services.device;
        this.sceneStorage = services.sceneStorage;
    }

    var KEY = 'go_full_screen';
    var GO_FS = 'go_full_screen';
    var CANCEL = 'cancel';
    var FS_REQUEST = 'exit_full_screen';

    var BLACK = '#000';
    var WHITE = '#fff';
    var FONT = 'GameFont';

    GoFullScreen.prototype.show = function (next) {
        var backBlur, rotateText, self = this, goFsBtn, cancelBtn;

        this.events.subscribe(Event.SHOW_GO_FULL_SCREEN, function () {

            backBlur = self.stage.drawRectangle(Width.HALF, Height.HALF, Width.FULL, Height.FULL, BLACK, true,
                undefined, 9, 0.8);

            if (self.sceneStorage.fsUserRequest) {
                self.sceneStorage.fsUserRequest = false;
                rotateText = self.stage.drawText(Width.HALF, Height.QUARTER, self.messages.get(KEY, GO_FS), Font._15,
                    FONT, WHITE, 11, undefined, undefined, undefined, Width.FULL, Height.get(15));
            } else {
                rotateText = self.stage.drawText(Width.HALF, Height.QUARTER, self.messages.get(KEY, FS_REQUEST),
                    Font._15, FONT, WHITE, 11, undefined, undefined, undefined, Width.FULL, Height.get(10));
            }

            goFsBtn = self.buttons.createPrimaryButton(Width.HALF, Height.HALF, self.messages.get(KEY, GO_FS),
                function () {
                    // sadly not working on IE11
                }, 10);

            cancelBtn = self.buttons.createSecondaryButton(Width.HALF, Height.THREE_FIFTH,
                self.messages.get(KEY, CANCEL), function () {
                    self.events.fire(Event.FULL_SCREEN, true);
                }, 10);

            // full screen hack for IE11, it accepts only calls from some DOM elements like button, link or div NOT canvas
            var screenElement = document.getElementsByTagName('canvas')[0];
            var parent = screenElement.parentNode;
            var wrapper = document.createElement('div');
            parent.replaceChild(wrapper, screenElement);
            wrapper.appendChild(screenElement);

            installOneTimeTap(wrapper, function (event) {
                wrapper.parentNode.replaceChild(screenElement, wrapper);
                if (event.clientX != undefined && event.clientY != undefined && isHit({
                        x: event.clientX,
                        y: event.clientY
                    }, cancelBtn.input)) {
                    return;
                } else {
                    var touches = event.changedTouches;
                    if (touches) {
                        for (var i = 0; i < touches.length; i++) {
                            var touch = touches[i];
                            if (isHit({
                                    x: touch.clientX,
                                    y: touch.clientY
                                }, cancelBtn.input)) {
                                return;
                            }
                        }
                    }
                }
                self.device.requestFullScreen();
            });
        });

        this.events.subscribe(Event.REMOVE_GO_FULL_SCREEN, function () {
            self.stage.remove(backBlur);
            self.stage.remove(rotateText);
            self.buttons.remove(goFsBtn);
            self.buttons.remove(cancelBtn);
        });

        next();
    };

    return GoFullScreen;
})(Event, Width, Height, installOneTimeTap, isHit);