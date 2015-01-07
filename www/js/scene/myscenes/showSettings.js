var showSettings = (function (Settings) {
    "use strict";

    return function (stage, buttons, messages, events, sceneStorage, device, nextCallback) {
        var settings = new Settings({
            stage: stage,
            buttons: buttons,
            messages: messages,
            events: events,
            sceneStorage: sceneStorage,
            device: device
        });
        settings.show(nextCallback);
    };
})(Settings);