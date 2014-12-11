var SplashScreen = (function (Width, Height, Math, Font, Transition, Fire) {
    "use strict";

    function SplashScreen(services) {
        this.stage = services.stage;
        this.messages = services.messages;
        this.buttons = services.buttons;
        this.fullScreen = services.fullScreen;
        this.device = services.device;
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
        var screen = document.getElementsByTagName('canvas')[0];
        var parent = screen.parentNode;
        var wrapper = document.createElement('div');
        parent.replaceChild(wrapper, screen);
        wrapper.appendChild(screen);

        if (window.PointerEvent) {
            wrapper.addEventListener('pointerdown', handleClick);

        } else if (window.MSPointerEvent) {
            wrapper.addEventListener('MSPointerDown', handleClick);

        } else {
            if ('ontouchstart' in window) {
                wrapper.addEventListener('touchstart', handleClick);
            }

            wrapper.addEventListener('click', handleClick);
        }
        function handleClick(event) {
            event.preventDefault();

            if (window.PointerEvent) {
                wrapper.removeEventListener('pointerdown', handleClick);

            } else if (window.MSPointerEvent) {
                wrapper.removeEventListener('MSPointerDown', handleClick);

            } else {
                if ('ontouchstart' in window) {
                    wrapper.removeEventListener('touchstart', handleClick);
                }

                wrapper.removeEventListener('click', handleClick);
            }

            wrapper.parentNode.replaceChild(screen, wrapper);
            goFullScreen();
        }

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

            self.fullScreen.request();

            if ('orientation' in window.screen && 'angle' in window.screen.orientation) {
                window.screen.orientation.lock('portrait-primary');
            } else { // old API version
                //if (self.device.isMobile) {
                if (window.screen.lockOrientation) {
                    window.screen.lockOrientation('portrait-primary');
                } else if (window.screen.msLockOrientation) {
                    window.screen.msLockOrientation('portrait-primary');
                } else if (window.mozLockOrientation) {
                    window.screen.mozLockOrientation('portrait-primary');
                }
                //}
            }
            next();
        }
    };

    return SplashScreen;
})(Width, Height, Math, Font, Transition, Fire);