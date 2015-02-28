var SplashScreen = (function (Width, Height, Math, Font, Transition, Fire, document, screen, installOneTimeTap, window,
    Orientation, Event, Stats, checkAndSet30fps) {
    "use strict";

    function SplashScreen(services) {
        this.stage = services.stage;
        this.messages = services.messages;
        this.buttons = services.buttons;
        this.device = services.device;
        this.events = services.events;
        this.loop = services.loop;
        this.timer = services.timer;
        this.sceneStorage = services.sceneStorage;
        this.shaker = services.shaker;
        this.sounds = services.sounds;
    }

    var KEY = 'splash_screen';
    var GAME_LOGO_TXT = 'SHIELDS UP';
    var TOUCH_TO_START = 'start';
    var SPECIAL_FONT = 'SpecialGameFont';
    var WHITE = '#fff';

    var DARK_GRAY = '#A9A9A9';
    var ASTEROID_1 = 'asteroid_1';
    var ASTEROID_2 = 'asteroid_2';
    var ASTEROID_3 = 'asteroid_3';
    var SHIP = 'ship';
    var SHIELDS = 'shields';

    SplashScreen.prototype.show = function (next) {
        // samsung workaround
        this.stage.drawRectangle(Width.HALF, Height.HALF, Width.FULL, Height.FULL, '#3a2e3f', true, undefined, 0);

        // workaround for measure text
        var t1 = this.stage.drawText(Width.THREE_QUARTER, Height.THIRD, GAME_LOGO_TXT, Font._15, SPECIAL_FONT,
            '#3a2e3f');
        var t2 = this.stage.drawText(Width.THREE_QUARTER, Height.THIRD, GAME_LOGO_TXT, Font._35, 'LogoFont', '#3a2e3f');
        var t3 = this.stage.drawText(Width.THREE_QUARTER, Height.THIRD, GAME_LOGO_TXT, Font._40, 'GameFont', '#3a2e3f');
        var self = this;
        this.timer.doLater(function () {
            self.stage.remove(t1);
            self.stage.remove(t2);
            self.stage.remove(t3);

            self.later(next);
        }, 3);
    };

    SplashScreen.prototype.later = function (next) {
        var ms = this.stage.drawText(Width.get(100, 90), Height.get(8), '0', Font._60, 'GameFont', 'white', 11);
        var fps = this.stage.drawText(Width.get(100, 90), Height.get(7), '0', Font._60, 'GameFont', 'white', 11);
        var statsStart = this.events.subscribe(Event.TICK_START, Stats.start);
        var statsRender = this.events.subscribe(Event.TICK_DRAW, function () {
            ms.data.msg = Stats.getMs().toString() + " ms";
            fps.data.msg = Stats.getFps().toString() + " fps";
        });
        var statsEnd = this.events.subscribe(Event.TICK_END, Stats.end);

        var asteroidOne = this.stage.drawFresh(Width.get(10, 8), Height.get(10, 2), ASTEROID_1);
        var asteroidTwo = this.stage.drawFresh(Width.get(10, 6), Height.get(10, 3), ASTEROID_2);
        var asteroidThree = this.stage.drawFresh(Width.get(10, 4), Height.get(10, 4), ASTEROID_3);
        var ship = this.stage.drawFresh(Width.get(10, 3), Height.get(10, 5), SHIP);
        ship.rotation = Math.PI / 4;
        var shields = this.stage.drawFresh(Width.get(10, 3), Height.get(10, 5), SHIELDS);
        shields.rotation = Math.PI / 4;
        var logo = this.stage.drawText(Width.HALF, Height.QUARTER, GAME_LOGO_TXT, Font._15, SPECIAL_FONT, DARK_GRAY, 4);
        var logoHighlight = this.stage.drawText(Width.HALF, Height.QUARTER, GAME_LOGO_TXT, Font._15, SPECIAL_FONT,
            WHITE, 5);
        var fireDict = Fire.draw(this.stage, ship);
        var offSetX = ship.x - Fire.getLeftX(ship);
        fireDict.left.rotationAnchorOffsetX = offSetX;
        fireDict.right.rotationAnchorOffsetX = -offSetX;
        var offSetY = -Fire.getShipOffSet(ship);
        fireDict.left.rotationAnchorOffsetY = offSetY;
        fireDict.right.rotationAnchorOffsetY = offSetY;
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
        var startButton;

        // full screen hack for IE11, it accepts only calls from some DOM elements like button, link or div NOT canvas
        var screenElement = document.getElementsByTagName('canvas')[0];
        var parent = screenElement.parentNode;
        var wrapper = document.createElement('div');
        parent.replaceChild(wrapper, screenElement);
        wrapper.appendChild(screenElement);
        var self = this;

        var loading = this.stage.drawText(Width.HALF, Height.THREE_QUARTER, 'loading', Font._35, SPECIAL_FONT,
            DARK_GRAY);
        var loadingHighlight = this.stage.drawText(Width.HALF, Height.THREE_QUARTER, 'loading', Font._35, SPECIAL_FONT,
            WHITE, 4);
        this.stage.animateAlphaPattern(loadingHighlight, [
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
        var coolDownTime = 60 * 6;
        this.timer.doLater(function () {
            checkAndSet30fps(self.sceneStorage, self.stage, self.shaker);
            self.stage.remove(loading);
            self.stage.remove(loadingHighlight);

            startButton = self.buttons.createPrimaryButton(Width.HALF, Height.THREE_QUARTER,
                self.messages.get(KEY, TOUCH_TO_START), function () {
                    // sadly not working on IE11
                }, 3);

            installOneTimeTap(wrapper, function () {

                wrapper.parentNode.replaceChild(screenElement, wrapper);
                goFullScreen();
            });
        }, coolDownTime);

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
            var shouldShowGoFsScreen = false;
            var rotateScreen = false;
            var shouldShowRotateScreen = false;

            var usedOnce = false;
            self.events.subscribe(Event.FULL_SCREEN, function (isFullScreen) {
                if (isFullScreen) {
                    if (!usedOnce) {
                        usedOnce = true;
                        return;
                    }
                    goFsScreen = false;
                    self.events.fire(Event.REMOVE_GO_FULL_SCREEN);
                    if (!rotateScreen && !shouldShowRotateScreen) {
                        if (self.sceneStorage.settingsOn) {
                            self.events.fire(Event.RESUME_SETTINGS);
                        } else if (self.sceneStorage.shouldShowSettings) {
                            self.sceneStorage.shouldShowSettings = false;
                            self.events.fire(Event.SHOW_SETTINGS);
                        } else {
                            self.events.fire(Event.RESUME);
                        }
                    } else if (shouldShowRotateScreen) {
                        shouldShowRotateScreen = false;
                        rotateScreen = true;
                        self.events.fire(Event.SHOW_ROTATE_DEVICE);
                    }
                } else {
                    if (!rotateScreen) {
                        self.events.fireSync(Event.PAUSE);
                        goFsScreen = true;
                        self.events.fire(Event.SHOW_GO_FULL_SCREEN);
                    } else {
                        shouldShowGoFsScreen = true;
                    }
                }
            });

            var isFs = self.device.requestFullScreen();
            var locked = self.device.lockOrientation('portrait-primary');

            if (!locked && self.device.isMobile) {

                self.events.subscribe(Event.SCREEN_ORIENTATION, function (orientation) {
                    if (orientation === Orientation.PORTRAIT) {
                        rotateScreen = false;
                        self.events.fire(Event.REMOVE_ROTATE_DEVICE);
                        if (!goFsScreen && !shouldShowGoFsScreen) {
                            if (self.sceneStorage.settingsOn) {
                                self.events.fire(Event.RESUME_SETTINGS);
                            } else if (self.sceneStorage.shouldShowSettings) {
                                self.sceneStorage.shouldShowSettings = false;
                                self.events.fire(Event.SHOW_SETTINGS);
                            } else {
                                self.events.fire(Event.RESUME);
                            }
                        } else if (shouldShowGoFsScreen) {
                            shouldShowGoFsScreen = false;
                            goFsScreen = true;
                            self.events.fire(Event.SHOW_GO_FULL_SCREEN);
                        }
                    } else {
                        if (!goFsScreen) {
                            self.events.fireSync(Event.PAUSE);
                            rotateScreen = true;
                            self.events.fire(Event.SHOW_ROTATE_DEVICE);
                        } else {
                            shouldShowRotateScreen = true;
                        }
                    }
                });

                var currentOrientation = self.device.orientation;
                if (currentOrientation === Orientation.LANDSCAPE) {
                    var nextScene = self.events.subscribe(Event.RESUME, function () {
                        self.events.unsubscribe(nextScene);
                        self.timer.doLater(next, 6);
                    });
                    self.events.fire(Event.SHOW_ROTATE_DEVICE);
                    self.events.fire(Event.PAUSE);
                }
            }
            if (!isFs && self.device.isMobile) {
                // do black magic
                window.scrollTo(0, 1); //maybe scrolling with larger screen element on newer browsers
            }
            if (!self.device.isMobile || locked || currentOrientation === Orientation.PORTRAIT) {
                self.timer.doLater(next, 6);
            }
        }

        self.events.subscribe(Event.PAGE_VISIBILITY, function (hidden) {
            if (hidden && self.sceneStorage.sfxOn) {
                self.sounds.muteAll();
            } else if (!hidden && self.sceneStorage.sfxOn) {
                self.sounds.unmuteAll();
            }
        });

        self.events.subscribe(Event.PAUSE, function () {
            self.stage.pauseAll();
            self.buttons.disableAll();
            self.timer.pause();
            self.loop.disableMove();
            self.loop.disableCollision();
        });

        self.events.subscribe(Event.RESUME, function () {
            self.stage.playAll();
            self.buttons.enableAll();
            self.timer.resume();
            self.loop.enableMove();
            self.loop.enableCollision();
        });
    };

    return SplashScreen;
})(Width, Height, Math, Font, Transition, Fire, window.document, window.screen, installOneTimeTap, window, Orientation,
    Event, Stats, checkAndSet30fps);