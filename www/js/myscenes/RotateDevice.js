var RotateDevice = (function (Width, Height, Font, Event) {
    "use strict";

    function RotateDevice(services) {
        this.stage = services.stage;
        this.events = services.events;
        this.messages = services.messages;
    }

    var KEY = 'rotate';
    var ROTATE_DEVICE = 'rotate_device';
    var FONT = 'GameFont';
    var BLACK = '#000';
    var WHITE = '#fff';

    RotateDevice.prototype.show = function (next) {
        var backBlur, rotateText, self = this;

        this.events.subscribe(Event.SHOW_ROTATE_DEVICE, function () {

            backBlur = self.stage.drawRectangle(Width.HALF, Height.HALF, Width.FULL, Height.FULL, BLACK, true,
                undefined, 9, 0.8);

            rotateText = self.stage.drawText(Width.HALF, Height.HALF, self.messages.get(KEY, ROTATE_DEVICE), Font._15,
                FONT, WHITE, 11);
        });

        this.events.subscribe(Event.REMOVE_ROTATE_DEVICE, function () {
            self.stage.remove(backBlur);
            self.stage.remove(rotateText);
        });

        next();
    };

    return RotateDevice;
})(Width, Height, Font, Event);