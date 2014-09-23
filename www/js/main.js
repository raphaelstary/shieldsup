window.onload = function () {
    "use strict";

    function installResizeHandler(resizeBus) {
        var resizeHandler = new ResizeHandler(resizeBus);

        window.addEventListener('resize', resizeHandler.handleResize.bind(resizeHandler));
    }

    function installInputListeners(screen, screenInput, gameController) {
        if ('ontouchstart' in window) {
            screen.addEventListener('touchstart', screenInput.touchStart.bind(screenInput));

            screen.addEventListener('touchstart', gameController.touchStart.bind(gameController));
            screen.addEventListener('touchend', gameController.touchEnd.bind(gameController));
        }

        if(window.PointerEvent) {
            screen.addEventListener('pointerdown', screenInput.click.bind(screenInput));

            screen.addEventListener('pointerdown', gameController.mouseDown.bind(gameController));
            screen.addEventListener('pointerup', gameController.mouseUp.bind(gameController));

        } else if (window.MSPointerEvent) {
            screen.addEventListener('MSPointerDown', screenInput.click.bind(screenInput));

            screen.addEventListener('MSPointerDown', gameController.mouseDown.bind(gameController));
            screen.addEventListener('MSPointerUp', gameController.mouseUp.bind(gameController));

        } else {
            screen.addEventListener('click', screenInput.click.bind(screenInput));

            screen.addEventListener('mousedown', gameController.mouseDown.bind(gameController));
            screen.addEventListener('mouseup', gameController.mouseUp.bind(gameController));
        }
    }

    function startApp(resizeBus, screenInput, gameController, screen) {
        var ctx = screen.getContext('2d'),
            app = new App(screen, ctx, resizeBus, screenInput, gameController);

        app.start(window.innerWidth, window.innerHeight, window.screen.availWidth, window.screen.availHeight);
    }

    var resizeBus = new ResizeBus(window.innerWidth, window.innerHeight),
        screenInput = new TapController(),
        screen = document.getElementById('screen'),
        gameController = new PushReleaseController();

    installResizeHandler(resizeBus);
    installInputListeners(screen, screenInput, gameController);
    startApp(resizeBus, screenInput, gameController, screen);
};