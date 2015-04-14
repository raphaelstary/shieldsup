var ShowMenuEvented = (function (Event, showMenu) {
    "use strict";

    function ShowMenuEvented(services) {
        this.events = services.events;
        this.stage = services.stage;
        this.buttons = services.buttons;
        this.messages = services.messages;
        this.sceneStorage = services.sceneStorage;
        this.device = services.device;
        this.sounds = services.sounds;
        this.missions = services.missions;
    }

    ShowMenuEvented.prototype.show = function (next) {
        var self = this;

        function resume() {
            self.events.fire(Event.RESUME_AFTER_MENU);
        }

        this.events.subscribe(Event.SHOW_MENU, function () {
            showMenu(self.stage, self.buttons, self.messages, self.events, self.sceneStorage, self.device, self.sounds,
                self.missions, resume);
        });

        next();
    };

    return ShowMenuEvented;
})(Event, showMenu);