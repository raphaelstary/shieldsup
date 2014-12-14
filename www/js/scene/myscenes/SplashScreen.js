var SplashScreen = (function (Width, Height, Math, Font, Transition, Fire, document, screen, ScreenOrientation,
    installOneTimeTap, window, Orientation) {
    "use strict";

    function SplashScreen(services) {
        this.stage = services.stage;
        this.messages = services.messages;
        this.buttons = services.buttons;
        this.fullScreen = services.fullScreen;
        this.device = services.device;
        this.orientation = services.orientation;
        this.events = services.events;
    }

    var KEY = 'splash_screen';
    var GAME_LOGO_TXT = 'SHIELDS UP';
    var TOUCH_TO_START = 'touch_to_start';
    var SPECIAL_FONT = 'SpecialGameFont';
    var WHITE = '#fff';

    var DARK_GRAY = '#A9A9A9';
    var ASTEROID_1 = 'asteroid_1';
    var ASTEROID_2 = 'asteroid_2';
    var ASTEROID_3 = 'asteroid_3';
    var SHIP = 'ship';
    var SHIELDS = 'shields';

    SplashScreen.prototype.show = function (next) {
        var asteroidOne = this.stage.drawFresh(Width.get(10, 8), Height.get(10, 2), ASTEROID_1);
        var asteroidTwo = this.stage.drawFresh(Width.get(10, 6), Height.get(10, 3), ASTEROID_2);
        var asteroidThree = this.stage.drawFresh(Width.get(10, 4), Height.get(10, 4), ASTEROID_3);
        var ship = this.stage.drawFresh(Width.get(10, 3), Height.get(10, 5), SHIP);
        ship.rotation = Math.PI / 4;
        var shields = this.stage.drawFresh(Width.get(10, 3), Height.get(10, 5), SHIELDS);
        shields.rotation = Math.PI / 4;
        var logo = this.stage.drawText(Width.THREE_QUARTER, Height.THIRD, GAME_LOGO_TXT, Font._15, SPECIAL_FONT,
            DARK_GRAY, 3);
        var logoHighlight = this.stage.drawText(Width.THREE_QUARTER, Height.THIRD, GAME_LOGO_TXT, Font._15,
            SPECIAL_FONT, WHITE, 4);
        var fireDict = Fire.draw(this.stage, ship);
        var offSetX = ship.x - Fire.getLeftX(ship);
        fireDict.left.anchorOffsetX = offSetX;
        fireDict.right.anchorOffsetX = -offSetX;
        var offSetY = -Fire.getShipOffSet(ship);
        fireDict.left.anchorOffsetY = offSetY;
        fireDict.right.anchorOffsetY = offSetY;
        fireDict.left.rotation = Math.PI / 4;
        fireDict.right.rotation = Math.PI / 4;

        this.stage.animateAlphaPattern(logoHighlight, [
            {
                value: 1,
                duration: 30,
                easing: Transition.LINEAR
            }, {
                value: 0,
                duration: 30,
                easing: Transition.LINEAR
            }
        ], true);
        var startButton = this.buttons.createPrimaryButton(Width.HALF, Height.THREE_QUARTER,
            this.messages.get(KEY, TOUCH_TO_START), function () {
                // sadly not working on IE11
            });

        // full screen hack for IE11, it accepts only calls from some DOM elements like button, link or div NOT canvas
        var screenElement = document.getElementsByTagName('canvas')[0];
        var parent = screenElement.parentNode;
        var wrapper = document.createElement('div');
        parent.replaceChild(wrapper, screenElement);
        wrapper.appendChild(screenElement);

        installOneTimeTap(wrapper, function () {
            wrapper.parentNode.replaceChild(screenElement, wrapper);
            goFullScreen();
        });

        var self = this;

        function removeSceneStuff() {
            self.buttons.remove(startButton);
            self.stage.remove(asteroidOne);
            self.stage.remove(asteroidTwo);
            self.stage.remove(asteroidThree);
            self.stage.remove(logo);
            self.stage.remove(logoHighlight);
            self.stage.remove(ship);
            self.stage.remove(shields);
            self.stage.remove(fireDict.left);
            self.stage.remove(fireDict.right);

        }

        function goFullScreen() {
            removeSceneStuff();

            var usedOnce = false;
            self.fullScreen.add(function (isFullScreen) {
                if (isFullScreen) {
                    if (!usedOnce) {
                        usedOnce = true;
                        return;
                    }
                    self.events.fire('remove_go_full_screen');
                    self.events.fire('resume');
                } else {
                    self.events.fire('show_go_full_screen');
                    self.events.fire('stop');
                }
            });

            var isFs = self.fullScreen.request();
            var locked = ScreenOrientation.lock('portrait-primary');

            if (!locked && self.device.isMobile) {

                var currentOrientation = self.orientation.getOrientation();

                self.orientation.add(function (orientation) {
                    if (orientation === Orientation.PORTRAIT) {
                        self.events.fire('remove_rotate_device');
                        self.events.fire('resume');
                    } else {
                        self.events.fire('show_rotate_device');
                        self.events.fire('stop');
                    }
                });

                if (currentOrientation === Orientation.LANDSCAPE) {
                    self.events.fire('show_rotate_device');
                    self.events.fire('stop');
                }
            }
            if (!isFs && self.device.isMobile) {
                // do black magic
                window.scrollTo(0, 1); //maybe scrolling with larger screen element on newer browsers
            }
            if (!self.device.isMobile || locked || currentOrientation === Orientation.PORTRAIT)
                next();
        }

        var resume = self.events.subscribe('resume', function () {

            self.events.unsubscribe(resume);
            next();

        });
    };

    return SplashScreen;
})(Width, Height, Math, Font, Transition, Fire, window.document, window.screen, OrientationLock, installOneTimeTap,
    window, Orientation);