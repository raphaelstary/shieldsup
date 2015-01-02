var InGameTutorial = (function ($) {
    "use strict";

    function InGameTutorial(services) {
        this.stage = services.stage;
        this.sceneStorage = services.sceneStorage;
        this.pushRelease = services.pushRelease;
        this.messages = services.messages;
        this.tap = services.tap;
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
    var SKIP_MSG = 'skip';
    var COLLECT_STUFF_MSG = 'collect_stuff';
    var TO_RAISE_SHIELDS_MSG = 'to_raise_shields';
    var TOUCH_AND_HOLD_MSG = 'touch_and_hold';

    var DRAIN_ENERGY_MSG = 'drain_energy';
    var STAR = 'star';
    var STAR_WHITE = 'star_white';
    var OK_MSG = 'ok';
    var NO_ENERGY_MSG = 'no_energy';

    var PUSH_RELEASE_TOUCHABLE = 'push_release_tutorial_touchable';

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

        // simple pause button
        var pauseButton = this.buttons.createSecondaryButton($.Width.HALF, $.Height.TOP_RASTER, ' = ', function () {
            pause();
            self.events.fire($.Event.PAUSE);
            $.showSettings(self.stage, self.buttons, self.messages, self.events, self.sceneStorage, self.device,
                resume);
        });
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

        var touchable = $.PlayFactory.createTouchable(PUSH_RELEASE_TOUCHABLE, self.device.width, self.device.height);
        var gameTouchable = self.events.subscribe($.Event.RESIZE, function (width, height) {
            $.changeTouchable(touchable, 0, 0, width, height);
        });

        registerPushRelease();

        function removeEveryThing() {
            removeSkipStuff();
            removeTouchNHoldStuff();
            removeEnergyStuff();
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
            });
        }

        var skipButton = createSkipStuff();

        function removeSkipStuff() {
            self.buttons.remove(skipButton);
        }

        function createFirstAsteroid() {
            function getAsteroidMinusHeightHalf() {
                return -$.calcScreenConst(self.stage.getGraphic(ASTEROID).height, 2);
            }

            function getAsteroidWidthHalf() {
                return $.calcScreenConst(self.stage.getGraphic(ASTEROID).width, 2);
            }

            var asteroid = self.stage.drawFresh($.subtract($.Width.HALF, getAsteroidWidthHalf),
                getAsteroidMinusHeightHalf, ASTEROID);
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

        var moveStuff = self.events.subscribe($.Event.RESIZE, function (width, height) {
            __4 = get__4(height);
            __2 = get__2(height);
            __1 = get__1(height);
            heightQuarter = $.Height.QUARTER(height);
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
                showEnergyTxtSubScene();
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

        var drainTxt, energyTxt, okButton;

        function showEnergyTxtSubScene() {
            function createEnergyTxt() {

                drainTxt = self.stage.drawText($.Width.HALF, $.Height.THIRD, self.messages.get(KEY, DRAIN_ENERGY_MSG),
                    $.Font._30, FONT, WHITE);

                energyTxt = self.stage.drawText($.Width.HALF, $.Height.TWO_THIRD, self.messages.get(KEY, NO_ENERGY_MSG),
                    $.Font._30, FONT, WHITE);

                function getY(height) {
                    return $.calcScreenConst(height, 16, 13);
                }

                okButton = self.buttons.createPrimaryButton($.Width.HALF, getY, self.messages.get(KEY, OK_MSG),
                    function () {
                        self.timer.doLater(function () {
                            removeEnergyStuff();
                            registerPushRelease();
                            collectStarsSubScene();
                        }, 60);
                    });
            }

            unregisterPushRelease();
            createEnergyTxt();
        }

        function removeEnergyStuff() {
            if (drainTxt)
                self.stage.remove(drainTxt);
            if (energyTxt)
                self.stage.remove(energyTxt);
            if (okButton)
                self.buttons.remove(okButton);
        }

        var starTxts, star, highlight, starMovement;

        function collectStarsSubScene() {
            function createFirstStar() {

                function getStarMinusHeightHalf() {
                    return $.calcScreenConst(self.stage.getGraphic(STAR).height, 2);
                }

                function getStarWidthHalf() {
                    return $.calcScreenConst(self.stage.getGraphic(STAR).height, 2);
                }

                var Z_INDEX = 7;
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

        function registerPushRelease() {
            self.pushRelease.add(touchable, energyStates.drainEnergy.bind(energyStates),
                energyStates.loadEnergy.bind(energyStates));
        }

        function unregisterPushRelease() {
            if (touchable)
                self.pushRelease.remove(touchable);
        }

        function removeCommonGameStuff() {
            self.shaker.reset();
            self.events.unsubscribe(collisionTutorial);
            self.events.unsubscribe(moveStuff);
            self.events.unsubscribe(gameTouchable);
            self.buttons.remove(pauseButton);
            //self.events.unsubscribe(stopId);
            //self.events.unsubscribe(resumeId);
        }

        function endGame() {
            self.next(nextScene);
        }

        //var stopId = self.events.subscribe('stop', pause);
        //
        //var resumeId = self.events.subscribe('resume', resume);

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
    changeTouchable: changeTouchable,
    Width: Width,
    Height: Height,
    Font: Font,
    add: add,
    subtract: subtract,
    drawShields: drawShields,
    PlayFactory: PlayFactory,
    Event: Event,
    showSettings: showSettings
});