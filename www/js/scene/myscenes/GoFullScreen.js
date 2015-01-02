var GoFullScreen = (function (Event) {
    "use strict";

    function GoFullScreen(services) {
        this.stage = services.stage;
        this.events = services.events;
    }

    GoFullScreen.prototype.show = function (next) {
        var backBlur, rotateText, self = this;

        this.events.subscribe(Event.SHOW_GO_FULL_SCREEN, function () {
            backBlur = self.stage.drawRectangle(Width.HALF, Height.HALF, Width.FULL, Height.FULL, '#000', true,
                undefined, 7, 0.8);
            rotateText = self.stage.drawText(Width.HALF, Height.HALF, 'GO FULL SCREEN, but how?', Font._15,
                'SpecialGameFont', '#fff', 8);
        });

        this.events.subscribe(Event.REMOVE_GO_FULL_SCREEN, function () {
            self.stage.remove(backBlur);
            self.stage.remove(rotateText);
        });

        next();
    };

    return GoFullScreen;
})(Event);