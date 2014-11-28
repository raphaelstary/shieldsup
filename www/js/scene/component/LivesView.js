var LivesView = (function () {
    "use strict";

    function LivesView(stage, livesDict) {
        this.stage = stage;
        this.livesDict = livesDict;
    }

    LivesView.prototype.remove = function () {
        console.log('remove life');
    };

    LivesView.prototype.add = function () {
        console.log('add life');
    };

    return LivesView;
})();