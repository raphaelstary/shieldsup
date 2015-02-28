var checkAndSet30fps = (function (Stats) {
    "use strict";

    function checkAndSet30fps(sceneStorage, stage, shaker) {
        if (Stats.getFps() < 45) {
            if (Stats.getMs() > 15) {
                // no speed stripes, no shaker, no shine, maybe no highlight, maybe no background stars, maybe no music just sfx
            }
            sceneStorage.do30fps = true;
            stage.stage.spriteAnimations.set30fps();
            shaker.__init(true);
        } else {
            sceneStorage.do30fps = false;
            stage.stage.spriteAnimations.set30fps(false);
        }
    }

    return checkAndSet30fps;
})(Stats);