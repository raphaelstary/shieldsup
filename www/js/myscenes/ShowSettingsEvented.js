var ShowSettingsEvented = (function (Event, showSettings) {
    "use strict";

    function ShowSettingsEvented(services) {
        this.events = services.events;
        this.stage = services.stage;
        this.buttons = services.buttons;
        this.messages = services.messages;
        this.sceneStorage = services.sceneStorage;
        this.device = services.device;
        this.sounds = services.sounds;
    }

    ShowSettingsEvented.prototype.show = function (next) {
        var self = this;

        function resume() {
            self.events.fire(Event.RESUME_AFTER_SETTINGS);
        }

        this.events.subscribe(Event.SHOW_SETTINGS, function () {
            showSettings(self.stage, self.buttons, self.messages, self.events, self.sceneStorage, self.device,
                self.sounds, resume);
        });

        next();
    };

    return ShowSettingsEvented;
})(Event, showSettings);