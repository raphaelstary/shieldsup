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

        var shipDrawable = this.sceneStorage.ship;
        var shieldsDrawable = this.sceneStorage.shields.drawable;
        var energyBarDrawable = this.sceneStorage.energyBar;
        var lifeDrawablesDict = this.sceneStorage.lives;
        var countDrawables = this.sceneStorage.counts;
        var fireDict = this.sceneStorage.fire;
        var speedStripes = this.sceneStorage.speedStripes;
        var shieldsUpSprite = this.sceneStorage.shields.upSprite;
        var shieldsDownSprite = this.sceneStorage.shields.downSprite;

        var backSound = this.sounds.play(BACK_GROUND_MUSIC, true, 0.4);

        // simple pause button
        var pauseButton = this.buttons.createSecondaryButton($.Width.HALF, $.Height.TOP_RASTER, ' = ', function () {
            pause();
            self.events.fireSync($.Event.PAUSE);
            $.showSettings(self.stage, self.buttons, self.messages, self.events, self.sceneStorage, self.device,
                resume);
        }, 3);
        pauseButton.text.rotation = $.Math.PI / 2;
        pauseButton.text.scale = 2;
        self.stage.hide(pauseButton.background);

        function setupShaker() {
            [
                pauseButton.text,
                shipDrawable,
                shieldsDrawable,
                energyBarDrawable,
                lifeDrawablesDict[1],
                lifeDrawablesDict[2],
                lifeDrawablesDict[3],
                fireDict.left,
                fireDict.right
            ].forEach(self.shaker.add.bind(self.shaker));
            countDrawables.forEach(self.shaker.add.bind(self.shaker));
            speedStripes.forEach(function (wrapper) {
                self.shaker.add(wrapper.drawable);
            });
        }

        setupShaker();
        var trackedAsteroids = {};
        var trackedStars = {};

        var shipCollision = self.stage.getCollisionDetector(shipDrawable);
        var anotherShieldsDrawable = $.drawShields(self.stage, shipDrawable).drawable;
        var shieldsCollision = self.stage.getCollisionDetector(anotherShieldsDrawable);
        var world = $.PlayFactory.createWorld(self.stage, self.sounds, self.timer, self.shaker, countDrawables,
            shipDrawable, lifeDrawablesDict, shieldsDrawable, trackedAsteroids, trackedStars, shipCollision,
            shieldsCollision, endGame);

        var collisionTutorial = this.events.subscribe($.Event.TICK_COLLISION, world.checkCollisions.bind(world));

        shieldsDrawable.x = shipDrawable.x;
        shieldsDrawable.y = shipDrawable.y;
        var energyStates = $.PlayFactory.createEnergyStateMachine(self.stage, self.sounds, energyBarDrawable, world,
            shieldsDrawable, shieldsUpSprite, shieldsDownSprite);

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
            function getY(height) {
                return $.calcScreenConst(height, 20, 3);
            }

            function getX(width) {
                return $.calcScreenConst(width, 8, 6);
            }

            return self.buttons.createSecondaryButton(getX, getY, self.messages.get(KEY, SKIP_MSG), function () {
                self.timer.doLater(function () {
                    removeEveryThing();
                    endGame();
                }, 60);
            }, 3);
        }

        var skipButton = createSkipStuff();

        function removeSkipStuff() {
            self.buttons.remove(skipButton);
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
            function get5() {
                return 5;
            }

            var touch_txt = self.stage.drawText($.Width.THREE_QUARTER, $.Height.THIRD,
                self.messages.get(KEY, TOUCH_AND_HOLD_MSG), $.Font._30, FONT, WHITE, 3, undefined, $.Math.PI / 16, 1,
                $.Width.TWO_THIRD, $.add(Font._30, get5));

            function getX(width) {
                return $.calcScreenConst(width, 16, 3);
            }

            var raise_txt = self.stage.drawText(getX, $.Height.HALF, self.messages.get(KEY, TO_RAISE_SHIELDS_MSG),
                $.Font._35, FONT, WHITE, 3, undefined, -$.Math.PI / 16, 1, $.Width.THIRD, $.add($.Font._35, get5));

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

        var __4 = get__4(self.device.height);
        var __2 = get__2(self.device.height);
        var __1 = get__1(self.device.height);
        var heightQuarter = $.Height.QUARTER(self.device.height);

        var moveStuff = self.events.subscribe($.Event.RESIZE, function (event) {
            __4 = get__4(event.height);
            __2 = get__2(event.height);
            __1 = get__1(event.height);
            heightQuarter = $.Height.QUARTER(event.height);
        });

        function moveMyFirstAsteroids() {
            if (asteroid.y < heightQuarter) {
                asteroid.y += __4;
            } else if (world.shieldsOn) {
                asteroid.y += __2;
            } else if (asteroid.y > heightQuarter) {
                asteroid.y -= __2;
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

        function removeTouchNHoldStuff() {
            if (touchTxts)
                touchTxts.forEach(self.stage.remove.bind(self.stage));
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
                self.stage.animateAlphaPattern(highlight, [
                    {
                        value: 1,
                        duration: DURATION,
                        easing: Transition.LINEAR
                    }, {
                        value: 0,
                        duration: DURATION,
                        easing: Transition.LINEAR
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
                    $.Width.HALF, $.Font._30);

                return [collectTxt];
            }

            function moveMyFirstStar() {
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

        function removeStarStuff() {
            if (starTxts)
                starTxts.forEach(self.stage.remove.bind(self.stage));
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
                if (!isPush && pushingPointerId == undefined) {
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

        var resumeId = self.events.subscribe($.Event.RESUME, registerPushRelease);
        var pauseId = self.events.subscribe($.Event.PAUSE, unregisterPushRelease);

        function removeCommonGameStuff() {
            self.shaker.reset();
            self.events.unsubscribe(collisionTutorial);
            self.events.unsubscribe(moveStuff);
            self.buttons.remove(pauseButton);
            self.events.unsubscribe(resumeId);
            self.events.unsubscribe(pauseId);
        }

        function endGame() {
            self.sounds.stop(backSound);
            self.next(nextScene);
        }

        function pause() {
            self.stage.hide(pauseButton.text);
        }

        function resume() {
            self.stage.show(pauseButton.text);
            pauseButton.used = false;
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
    showSettings: showSettings,
    Key: Key
});