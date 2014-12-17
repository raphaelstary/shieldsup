var showSettings = (function (Settings) {
    "use strict";

    return function (stage, buttons, messages, resize, events, sceneStorage, nextCallback) {
        var settings = new Settings({
            stage: stage,
            buttons: buttons,
            messages: messages,
            resize: resize,
            events: events,
            sceneStorage: sceneStorage
        });
        settings.show(nextCallback);
    };
})(Settings);