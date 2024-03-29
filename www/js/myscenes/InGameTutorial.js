var InGameTutorial = (function ($) {
    "use strict";

    function InGameTutorial(services) {
        this.stage = services.stage;
        this.sceneStorage = services.sceneStorage;
        this.messages = services.messages;
        this.sounds = services.sounds;
        this.shaker = services.shaker;
        this.timer = services.timer;
        this.buttons = services.buttons;
        this.events = services.events;
        this.device = services.device;
        this.missions = services.missions;
    }

    var ASTEROID = 'asteroid_1';

    var FONT = 'GameFont';
    var WHITE = '#fff';

    var KEY = 'tutorial';
    var SKIP_MSG = 'skip_tutorial';
    var COLLECT_STUFF_MSG = 'collect_stuff';
    var TO_RAISE_SHIELDS_MSG = 'to_raise_shields';
    var TOUCH_AND_HOLD_MSG = 'touch_and_hold';

    var STAR = 'star';
    var STAR_WHITE = 'star_white';

    var BACK_GROUND_MUSIC = 'spacey_club';

    InGameTutorial.prototype.show = function (nextScene) {
        var self = this;
        var do30fps = this.sceneStorage.do30fps !== undefined ? this.sceneStorage.do30fps : false;

        var shipDrawable = this.sceneStorage.ship;
        var shieldsDrawable = this.sceneStorage.shields.drawable;
        var energyBarDrawable = this.sceneStorage.energyBar;
        var lifeDrawablesDict = this.sceneStorage.lives;
        var countDrawables = this.sceneStorage.counts;
        var fireDict = this.sceneStorage.fire;
        var speedStripes = this.sceneStorage.speedStripes;
        var shieldsUpSprite = this.sceneStorage.shields.upSprite;
        var shieldsDownSprite = this.sceneStorage.shields.downSprite;
        var backSound;
        if (!self.sceneStorage.lowPerformance)
            backSound = this.sounds.play(BACK_GROUND_MUSIC, true, 0.4);

        var pauseButton = $.drawPauseButton(this.buttons, doThePause);

        function doThePause() {
            pause();
            self.events.fireSync($.Event.PAUSE);
            self.sceneStorage.menuScene = 'pause_menu';
            $.showMenu(self.stage, self.buttons, self.messages, self.events, self.sceneStorage, self.device,
                self.sounds, self.missions, resume);
        }

        function setupShaker() {
            [
                pauseButton.text,
                pauseButton.background,
                shipDrawable,
                shieldsDrawable,
                energyBarDrawable,
                fireDict.left,
                fireDict.right
            ].forEach(self.shaker.add.bind(self.shaker));
            if (speedStripes)
                speedStripes.forEach(function (wrapper) {
                    self.shaker.add(wrapper.drawable);
                });
            $.iterateEntries(lifeDrawablesDict, self.shaker.add, self.shaker);
        }

        setupShaker();
        var trackedAsteroids = {};
        var trackedStars = {};
        var gameStats = {
            collectedStars: 0,
            collectedStarsInARow: 0,
            spawnedStars: 0,
            destroyedStars: 0,
            destroyedStarsInARow: 0,
            completedWaves: 0,
            perfectWaves: 0,
            perfectWavesInARow: 0,
            wavesWithoutLifeLost: 0,
            wavesWithoutLifeLostInARow: 0,
            livesLost: 0,
            timePlayed: 0,
            timeShieldsOn: 0,
            timeShieldsOff: 0,
            timeWithoutLifeLost: 0,
            timeWithoutStarCollected: 0,
            timeWithoutAlarm: 0,
            destroyedAsteroids: 0,
            destroyedAsteroidsInARow: 0,
            spawnedAsteroids: 0,
            collectedAsteroids: 0,
            collectedAsteroidsInARow: 0,
            outOfEnergy: 0,
            outOfEnergyInARow: 0,
            points: 0
        };
        self.sceneStorage.gameStats = gameStats;
        var shipCollision = self.stage.getCollisionDetector(shipDrawable);
        var anotherShieldsDrawable = $.drawShields(self.stage, shipDrawable).drawable;
        var shieldsCollision = self.stage.getCollisionDetector(anotherShieldsDrawable);
        var world = $.PlayFactory.createWorld(self.stage, self.events, self.sounds, self.timer, self.shaker,
            countDrawables, shipDrawable, lifeDrawablesDict, shieldsDrawable, trackedAsteroids, trackedStars,
            shipCollision, shieldsCollision, endGame, gameStats, do30fps, self.sceneStorage.lowPerformance);

        var collisionTutorial = this.events.subscribe($.Event.TICK_COLLISION, world.checkCollisions.bind(world));

        var energyStates = $.PlayFactory.createEnergyStateMachine(self.stage, self.events, self.sounds, self.timer,
            energyBarDrawable, world, shieldsDrawable, shieldsUpSprite, shieldsDownSprite, 1, gameStats, do30fps);

        registerPushRelease();

        function removeEveryThing() {
            removeSkipStuff();
            removeTouchNHoldStuff();
            removeStarStuff();
            removeCommonGameStuff();
            unregisterPushRelease();
            unregisterCollisionStuff();
        }

        function unregisterCollisionStuff() {
            self.stage.detachCollisionDetector(shipCollision);
            self.stage.detachCollisionDetector(shieldsCollision);
            self.stage.remove(anotherShieldsDrawable);
        }

        function createSkipStuff() {
            return self.buttons.createSecondaryButton($.Width.get(32, 24), $.Height.BOTTOM_RASTER,
                self.messages.get(KEY, SKIP_MSG), function () {
                    self.timer.doLater(function () {
                        removeEveryThing();
                        endGame();
                    }, 60);
                }, 3);
        }

        var skipButton = createSkipStuff();
        self.messages.add(skipButton.text, skipButton.text.data, KEY, SKIP_MSG);
        function removeSkipStuff() {
            self.buttons.remove(skipButton);
            self.messages.remove(skipButton.text);
        }

        function createFirstAsteroid() {
            function getAsteroidMinusHeightHalf() {
                return -$.calcScreenConst(self.stage.getImageHeight(ASTEROID), 2);
            }

            function getAsteroidWidthHalf() {
                return $.calcScreenConst(self.stage.getImageWidth(ASTEROID), 2);
            }

            var asteroid = self.stage.drawFresh($.subtract($.Width.HALF, getAsteroidWidthHalf),
                getAsteroidMinusHeightHalf, ASTEROID, 5);
            trackedAsteroids[asteroid.id] = asteroid;

            return asteroid;
        }

        function createTouchNHoldTxt() {
            var touch_txt = self.stage.drawText($.Width.TWO_THIRD, $.Height.QUARTER,
                self.messages.get(KEY, TOUCH_AND_HOLD_MSG), $.Font._30, FONT, WHITE, 5, undefined, $.Math.PI / 16, 1,
                $.Width.TWO_THIRD, $.Height.get(20));
            self.messages.add(touch_txt, touch_txt.data, KEY, TOUCH_AND_HOLD_MSG);
            function getX(width) {
                return $.calcScreenConst(width, 16, 3);
            }

            var raise_txt = self.stage.drawText(Width.QUARTER, $.Height.THIRD,
                self.messages.get(KEY, TO_RAISE_SHIELDS_MSG), $.Font._35, FONT, WHITE, 3, undefined, -$.Math.PI / 16, 1,
                $.Width.THIRD, $.Height.get(25));
            self.messages.add(raise_txt, raise_txt.data, KEY, TO_RAISE_SHIELDS_MSG);
            return [touch_txt, raise_txt];
        }

        function get__4(height) {
            var value = $.calcScreenConst(height, 100);
            return value > 0 ? value : 1;
        }

        function get__2(height) {
            var value = $.calcScreenConst(height, 200);
            return value > 0 ? value : 1;
        }

        function get__1(height) {
            var value = $.calcScreenConst(height, 400);
            return value > 0 ? value : 1;
        }

        var __4;
        var __2;
        var __1;
        var heightAsteroid;
        var heightQuarter;
        var moveStuff;
        var u = 48;
        var v = 26;
        if (do30fps) {
            __4 = get__4(self.device.height) * 2;
            __2 = get__2(self.device.height) * 2;
            __1 = get__1(self.device.height) * 2;
            heightAsteroid = $.Height.get(u, v)(self.device.height);
            heightQuarter = $.Height.QUARTER(self.device.height);

            moveStuff = self.events.subscribe($.Event.RESIZE, function (event) {
                __4 = get__4(event.height) * 2;
                __2 = get__2(event.height) * 2;
                __1 = get__1(event.height) * 2;
                heightAsteroid = $.Height.get(u, v)(event.height);
                heightQuarter = $.Height.QUARTER(event.height);
            });
        } else {
            __4 = get__4(self.device.height);
            __2 = get__2(self.device.height);
            __1 = get__1(self.device.height);
            heightAsteroid = $.Height.get(u, v)(self.device.height);
            heightQuarter = $.Height.QUARTER(self.device.height);

            moveStuff = self.events.subscribe($.Event.RESIZE, function (event) {
                __4 = get__4(event.height);
                __2 = get__2(event.height);
                __1 = get__1(event.height);
                heightAsteroid = $.Height.get(u, v)(event.height);
                heightQuarter = $.Height.QUARTER(event.height);
            });
        }
        function moveMyFirstAsteroids() {
            if (asteroidShutDown)
                return;
            if (asteroid.y < heightAsteroid) {
                asteroid.y += __4 + __2;
            } else if (world.shieldsOn) {
                asteroid.y += __2 + __1;
            } else if (asteroid.y > heightAsteroid) {
                asteroid.y -= __4;
            }
            if (!self.stage.has(asteroid)) {
                removeTouchNHoldStuff();

                // next sub scene
                collectStarsSubScene();
            }
        }

        var touchTxts = createTouchNHoldTxt();
        var asteroid = createFirstAsteroid();
        var asteroidMovement = self.events.subscribe($.Event.TICK_MOVE, moveMyFirstAsteroids);
        var asteroidShutDown = false;

        function removeTouchNHoldStuff() {
            asteroidShutDown = true;
            if (touchTxts) {
                touchTxts.forEach(self.stage.remove.bind(self.stage));
                touchTxts.forEach(self.messages.remove.bind(self.messages));
            }
            self.events.unsubscribe(asteroidMovement);
            if (asteroid)
                self.stage.remove(asteroid); //double remove just in case
        }

        var starTxts, star, highlight, starMovement;

        function collectStarsSubScene() {
            function createFirstStar() {

                function getStarMinusHeightHalf() {
                    return $.calcScreenConst(self.stage.getImageHeight(STAR), 2);
                }

                function getStarWidthHalf() {
                    return $.calcScreenConst(self.stage.getImageWidth(STAR), 2);
                }

                var Z_INDEX = 4;
                var star = self.stage.drawFresh($.subtract($.Width.HALF, getStarWidthHalf), getStarMinusHeightHalf,
                    STAR, Z_INDEX, undefined, 1, 0, 0.75);
                var highlight = self.stage.drawFresh($.subtract($.Width.HALF, getStarWidthHalf), getStarMinusHeightHalf,
                    STAR_WHITE, Z_INDEX + 1, [star], 0, 0, 1);

                var DURATION = 15;
                if (do30fps)
                    DURATION = 8;
                self.stage.animateAlphaPattern(highlight, [
                    {
                        value: 0.8,
                        duration: DURATION,
                        easing: Transition.EASE_IN_QUAD
                    }, {
                        value: 0,
                        duration: DURATION,
                        easing: Transition.EASE_OUT_QUAD
                    }
                ], true);

                self.stage.animateScalePattern(star, [
                    {
                        value: 1,
                        duration: DURATION,
                        easing: Transition.LINEAR
                    }, {
                        value: 0.75,
                        duration: DURATION,
                        easing: Transition.LINEAR
                    }
                ], true);

                trackedStars[star.id] = {
                    star: star,
                    highlight: highlight
                };

                return {
                    star: star,
                    highlight: highlight
                };
            }

            function createCollectTxt() {
                var collectTxt = self.stage.drawText($.Width.THREE_QUARTER, $.Height.THIRD,
                    self.messages.get(KEY, COLLECT_STUFF_MSG), $.Font._30, FONT, WHITE, 3, undefined, $.Math.PI / 16, 1,
                    $.Width.HALF, $.Height.get(20));
                self.messages.add(collectTxt, collectTxt.data, KEY, COLLECT_STUFF_MSG);
                return [collectTxt];
            }

            function moveMyFirstStar() {
                if (starShutDown)
                    return;
                if (star.y < heightQuarter) {
                    star.y += __4;
                    highlight.y += __4;
                } else if (!world.shieldsOn) {
                    star.y += __1;
                    highlight.y += __1;
                } else if (star.y > heightQuarter) {
                    star.y -= __2;
                    highlight.y -= __2;
                }
                if (world.points < 1 && !self.stage.has(star)) {
                    var wrapper = createFirstStar();
                    star = wrapper.star;
                    highlight = wrapper.highlight;
                }
                if (!self.stage.has(star)) {
                    removeEveryThing();
                    endGame();
                }
            }

            starTxts = createCollectTxt();
            var wrapper = createFirstStar();
            star = wrapper.star;
            highlight = wrapper.highlight;
            starMovement = self.events.subscribe($.Event.TICK_MOVE, moveMyFirstStar);
        }

        var starShutDown = false;

        function removeStarStuff() {
            starShutDown = true;
            if (starTxts) {
                starTxts.forEach(self.stage.remove.bind(self.stage));
                starTxts.forEach(self.messages.remove.bind(self.messages));
            }
            self.events.unsubscribe(starMovement);
            if (star)
                self.stage.remove(star);
            if (highlight)
                self.stage.remove(highlight);
        }

        var pushRelease;
        var padId;
        var keyId;

        function registerPushRelease() {
            var isPush = false;
            var pushingPointerId;
            pushRelease = self.events.subscribe($.Event.POINTER, function (pointer) {
                if (isPaused)
                    return;
                if (!isPush && pushingPointerId == undefined && pointer.type == 'down') {
                    pushingPointerId = pointer.id;
                    isPush = true;
                    energyStates.drainEnergy();

                } else if (isPush && pushingPointerId == pointer.id && pointer.type == 'up') {
                    pushingPointerId = undefined;
                    isPush = false;
                    energyStates.loadEnergy();
                }
            });
            var padIsPushed = false;
            padId = self.events.subscribe($.Event.GAME_PAD, function (gamePad) {
                if (!padIsPushed && gamePad.isAPressed()) {
                    padIsPushed = true;
                    energyStates.drainEnergy();
                } else if (padIsPushed && !gamePad.isAPressed()) {
                    padIsPushed = false;
                    energyStates.loadEnergy();
                }
            });
            var keyPressed = false;
            keyId = self.events.subscribe($.Event.KEY_BOARD, function (keyBoard) {
                if (!keyPressed && keyBoard[$.Key.ENTER]) {
                    keyPressed = true;
                    energyStates.drainEnergy();
                } else if (keyPressed && keyBoard[$.Key.ENTER] == undefined) {
                    keyPressed = false;
                    energyStates.loadEnergy();
                }
            });
        }

        function unregisterPushRelease() {
            self.events.unsubscribe(pushRelease);
            self.events.unsubscribe(padId);
            self.events.unsubscribe(keyId);
        }

        var goFs = false;
        var showGoFs = self.events.subscribe($.Event.SHOW_GO_FULL_SCREEN, function () {
            goFs = true;
        });

        var hideGoFs = self.events.subscribe($.Event.REMOVE_GO_FULL_SCREEN, function () {
            goFs = false;
        });
        var rotation = false;
        var showRotation = self.events.subscribe($.Event.SHOW_ROTATE_DEVICE, function () {
            rotation = true;
        });

        var hideRotation = self.events.subscribe($.Event.REMOVE_ROTATE_DEVICE, function () {
            rotation = false;
        });

        var visible = self.events.subscribe($.Event.PAGE_VISIBILITY, function (hidden) {
            if (hidden) {
                if (!isPaused)
                    self.sceneStorage.shouldShowMenu = true;
            } else {
                self.timer.doLater(function () {
                    if (self.sceneStorage.shouldShowMenu && !goFs && !rotation) {
                        self.sceneStorage.shouldShowMenu = false;
                        doThePause();
                    }
                }, 2);
            }
        });

        var resumeId = self.events.subscribe($.Event.RESUME, function () {
            registerPushRelease();
        });
        var pauseId = self.events.subscribe($.Event.PAUSE, unregisterPushRelease);

        function removeCommonGameStuff() {
            world.reset();
            self.shaker.reset(do30fps);
            self.events.unsubscribe(collisionTutorial);
            self.events.unsubscribe(moveStuff);
            self.buttons.remove(pauseButton);
            self.events.unsubscribe(resumeId);
            self.events.unsubscribe(pauseId);
            self.events.unsubscribe(visible);
            self.events.unsubscribe(showGoFs);
            self.events.unsubscribe(hideGoFs);
            self.events.unsubscribe(showRotation);
            self.events.unsubscribe(hideRotation);
        }

        var itIsOver = false;

        function endGame() {
            if (itIsOver)
                return;
            itIsOver = true;
            if (backSound)
                self.sounds.stop(backSound);
            delete self.sceneStorage.gameStats;
            self.next(nextScene);
        }

        var isPaused = false;

        function pause() {
            isPaused = true;
        }

        function resume() {
            pauseButton.used = false;
            isPaused = false;
        }
    };

    InGameTutorial.prototype.next = function (nextScene) {
        nextScene();
    };

    return InGameTutorial;
})({
    Math: Math,
    calcScreenConst: calcScreenConst,
    Width: Width,
    Height: Height,
    Font: Font,
    add: add,
    subtract: subtract,
    drawShields: drawShields,
    PlayFactory: PlayFactory,
    Event: Event,
    showMenu: showMenu,
    Key: Key,
    iterateEntries: iterateEntries,
    drawPauseButton: drawPauseButton
});