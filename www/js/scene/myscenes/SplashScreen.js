var SplashScreen = (function (Width, Height, Math, Font, Transition, Fire, document, screen,
    installOneTimeTap, window, Orientation, Event) {
    "use strict";

    function SplashScreen(services) {
        this.stage = services.stage;
        this.messages = services.messages;
        this.buttons = services.buttons;
        this.device = services.device;
        this.events = services.events;
        this.loop = services.loop;
        this.tap = services.tap;
        this.pushRelease = services.pushRelease;
        this.timer = services.timer;
        this.sceneStorage = services.sceneStorage;
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

            var goFsScreen = false;
            var rotateScreen = false;

            var usedOnce = false;
            self.events.subscribe(Event.FULL_SCREEN, function (isFullScreen) {
                if (isFullScreen) {
                    if (!usedOnce) {
                        usedOnce = true;
                        return;
                    }
                    goFsScreen = false;
                    self.events.fire(Event.REMOVE_GO_FULL_SCREEN);
                    if (!rotateScreen) {
                        if (self.sceneStorage.settingsOn) {
                            self.events.fire(Event.RESUME_SETTINGS);
                        } else {
                            self.events.fire(Event.RESUME);
                        }
                    }
                } else {
                    if (!rotateScreen) {
                        self.events.syncFire(Event.PAUSE);
                    }
                    goFsScreen = true;
                    self.events.fire(Event.SHOW_GO_FULL_SCREEN);
                }
            });

            var isFs = self.device.requestFullScreen();
            var locked = self.device.lockOrientation('portrait-primary');

            if (!locked && self.device.isMobile) {

                self.events.subscribe(Event.ORIENTATION, function (orientation) {
                    if (orientation === Orientation.PORTRAIT) {
                        rotateScreen = false;
                        self.events.fire(Event.REMOVE_ROTATE_DEVICE);
                        if (!goFsScreen) {
                            if (self.sceneStorage.settingsOn) {
                                self.events.fire(Event.RESUME_SETTINGS);
                            } else {
                                self.events.fire(Event.RESUME);
                            }
                        }
                    } else {
                        if (!goFsScreen) {
                            self.events.syncFire(Event.PAUSE);
                        }
                        rotateScreen = true;
                        self.events.fire(Event.SHOW_ROTATE_DEVICE);
                    }
                });

                var currentOrientation = self.device.orientation;
                if (currentOrientation === Orientation.LANDSCAPE) {
                    var nextScene = self.events.subscribe(Event.RESUME, function () {
                        self.events.unsubscribe(nextScene);
                        next();
                    });
                    self.events.fire(Event.SHOW_ROTATE_DEVICE);
                    self.events.fire(Event.PAUSE);
                }
            }
            if (!isFs && self.device.isMobile) {
                // do black magic
                window.scrollTo(0, 1); //maybe scrolling with larger screen element on newer browsers
            }
            if (!self.device.isMobile || locked || currentOrientation === Orientation.PORTRAIT)
                next();
        }

        self.events.subscribe(Event.PAUSE, function () {
            self.stage.pauseAll();
            self.tap.disableAll();
            self.pushRelease.disableAll();
            self.timer.pause();
            self.loop.disableMove();
            self.loop.disableCollision();
        });

        self.events.subscribe(Event.RESUME, function () {
            self.stage.playAll();
            self.tap.enableAll();
            self.pushRelease.enableAll();
            self.timer.resume();
            self.loop.enableMove();
            self.loop.enableCollision();
        });
    };

    return SplashScreen;
})(Width, Height, Math, Font, Transition, Fire, window.document, window.screen, installOneTimeTap,
    window, Orientation, Event);