var FullScreenController = (function (document) {
    "use strict";

    function FullScreenController(screen) {
        this.screen = screen;

        this.isSupported = document.fullscreenEnabled || document.webkitFullscreenEnabled ||
        document.mozFullScreenEnabled || document.msFullscreenEnabled;
    }

    FullScreenController.prototype.request = function () {
        if (this.isSupported) {
            if (this.screen.requestFullscreen) {
                this.screen.requestFullscreen();
            } else if (this.screen.webkitRequestFullscreen) {
                this.screen.webkitRequestFullscreen();
            } else if (this.screen.mozRequestFullScreen) {
                this.screen.mozRequestFullScreen();
            } else if (this.screen.msRequestFullscreen) {
                this.screen.msRequestFullscreen();
            }
        }
        return this.isFullScreen();
    };

    FullScreenController.prototype.isFullScreen = function () {
        return document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement ||
            document.msFullscreenElement;
    };

    FullScreenController.prototype.exit = function () {
        if (this.isSupported) {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }

        return !this.isFullScreen();
    };

    document.addEventListener("fullscreenchange", fullScreenDebugHandler);
    document.addEventListener("webkitfullscreenchange", fullScreenDebugHandler);
    document.addEventListener("mozfullscreenchange", fullScreenDebugHandler);
    document.addEventListener("MSFullscreenChange", fullScreenDebugHandler);

    function fullScreenDebugHandler() {
        console.log('full screen event fired');
        var isFs = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement ||
            document.msFullscreenElement;
        console.log('is full screen: ' + isFs);
    }

    return FullScreenController;
})(window.document);