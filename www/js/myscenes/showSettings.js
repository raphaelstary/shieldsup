var showSettings = (function (Settings) {
    "use strict";

    return function (stage, buttons, messages, events, sceneStorage, device, sounds, nextCallback) {
        var settings = new Settings({
            stage: stage,
            buttons: buttons,
            messages: messages,
            events: events,
            sceneStorage: sceneStorage,
            device: device,
            sounds: sounds
        });
        settings.show(nextCallback);
    };
})(Settings);