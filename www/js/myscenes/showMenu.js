var showMenu = (function (Menu) {
    "use strict";

    return function (stage, buttons, messages, events, sceneStorage, device, sounds, missions, nextCallback) {
        var menu = new Menu({
            stage: stage,
            buttons: buttons,
            messages: messages,
            events: events,
            sceneStorage: sceneStorage,
            device: device,
            sounds: sounds,
            missions: missions
        });
        menu.show(nextCallback);
    };
})(Menu);