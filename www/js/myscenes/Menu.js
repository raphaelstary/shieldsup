var Menu = (function (Width, Height, changeSign, Transition, Event, Settings) {
    "use strict";

    function Menu(services) {
        this.stage = services.stage;
        this.buttons = services.buttons;
        this.messages = services.messages;
        this.events = services.events;
        this.sceneStorage = services.sceneStorage;
        this.device = services.device;
        this.sounds = services.sounds;
    }

    Menu.prototype.show = function (next) {
        this.sceneStorage.menuOn = true;
        var self = this;
        var backBlur;
        this.sceneStorage.menuSceneButtons = [];
        var resume = self.events.subscribe(Event.RESUME_MENU, function () {
            self.sceneStorage.menuSceneButtons.forEach(self.buttons.enable.bind(self.buttons));
        });

        showMenu();

        function showMenu() {

            backBlur = self.stage.drawRectangle(changeSign(Width.HALF), Height.HALF, Width.FULL, Height.FULL, '#000',
                true, undefined, 6, 0.8);
            self.stage.move(backBlur, Width.HALF, Height.HALF, 15, Transition.EASE_IN_EXPO, false, showSettings);
        }

        function hideMenu() {
            self.events.unsubscribe(resume);

            delete self.sceneStorage.menuSceneButtons;

            self.stage.move(backBlur, changeSign(Width.HALF), Height.HALF, 15, Transition.EASE_OUT_EXPO, false,
                function () {
                    self.stage.remove(backBlur);
                    self.events.fire(Event.RESUME);
                    self.sceneStorage.menuOn = false;
                    next();
                });
        }

        function showSettings() {
            var settings = new Settings({
                stage: self.stage,
                buttons: self.buttons,
                messages: self.messages,
                events: self.events,
                sceneStorage: self.sceneStorage,
                device: self.device,
                sounds: self.sounds
            });
            settings.show(hideMenu);
        }
    };

    return Menu;
})(Width, Height, changeSign, Transition, Event, Settings);