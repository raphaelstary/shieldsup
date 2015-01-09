var GoFullScreen = (function (Event, Width, Height, installOneTimeTap, isHit) {
    "use strict";

    function GoFullScreen(services) {
        this.stage = services.stage;
        this.events = services.events;
        this.buttons = services.buttons;
        this.messages = services.messages;
        this.device = services.device;
    }

    GoFullScreen.prototype.show = function (next) {
        var backBlur, rotateText, self = this, goFsBtn, cancelBtn;

        this.events.subscribe(Event.SHOW_GO_FULL_SCREEN, function () {
            backBlur = self.stage.drawRectangle(Width.HALF, Height.HALF, Width.FULL, Height.FULL, '#000', true,
                undefined, 7, 0.8);
            rotateText = self.stage.drawText(Width.HALF, Height.HALF, 'GO FULL SCREEN, but how?', Font._15,
                'SpecialGameFont', '#fff', 8);

            goFsBtn = self.buttons.createPrimaryButton(Width.HALF, Height.TWO_THIRD,
                self.messages.get('go_full_screen', 'go_full_screen'), function () {
                    // sadly not working on IE11
                });

            cancelBtn = self.buttons.createSecondaryButton(Width.HALF, Height.THREE_QUARTER,
                self.messages.get('go_full_screen', 'cancel'), function () {
                    self.events.fire(Event.FULL_SCREEN, true);
                    //self.events.fire(Event.REMOVE_GO_FULL_SCREEN);
                    //self.events.fire(Event.RESUME);
                });

            // full screen hack for IE11, it accepts only calls from some DOM elements like button, link or div NOT canvas
            var screenElement = document.getElementsByTagName('canvas')[0];
            var parent = screenElement.parentNode;
            var wrapper = document.createElement('div');
            parent.replaceChild(wrapper, screenElement);
            wrapper.appendChild(screenElement);

            installOneTimeTap(wrapper, function (event) {
                wrapper.parentNode.replaceChild(screenElement, wrapper);
                if (isHit({
                        x: event.clientX,
                        y: event.clientY
                    }, cancelBtn.input)) {
                    return;
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