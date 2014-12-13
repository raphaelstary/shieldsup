var RotateDevice = (function (Width, Height, Font) {
    "use strict";

    function RotateDevice(services) {
        this.stage = services.stage;
        this.events = services.events;
    }


    RotateDevice.prototype.show = function (next) {
        var backBlur, rotateText, self = this;

        this.events.subscribe('show_rotate_device', function () {
            backBlur = self.stage.drawRectangle(Width.HALF, Height.HALF, Width.FULL, Height.FULL, '#000', true,
                undefined, 7, 0.8);
            rotateText = self.stage.drawText(Width.HALF, Height.HALF, 'ROTATE DEVICE', Font._15, 'SpecialGameFont',
                '#fff', 8);
        });

        this.events.subscribe('remove_rotate_device', function () {
            self.stage.remove(backBlur);
            self.stage.remove(rotateText);
        });

        next();
    };

    return RotateDevice;
})(Width, Height, Font);