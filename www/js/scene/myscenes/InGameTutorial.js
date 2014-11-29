var InGameTutorial = (function ($) {
    "use strict";

    function InGameTutorial(services) {
        this.stage = services.stage;
        this.sceneStorage = services.sceneStorage;
        this.loop = services.loop;
        this.pushRelease = services.pushRelease;
        this.messages = services.messages;
        this.tap = services.tap;
        this.sounds = services.sounds;
        this.resize = services.resize;
        this.shaker = services.shaker;
        this.timer = services.timer;
        this.buttons = services.buttons;
    }

    var ASTEROID = 'asteroid_1';

    var FONT = 'GameFont';
    var WHITE = '#fff';

    var COLLISION_TUTORIAL = 'collisions_tutorial';

    var KEY = 'tutorial';
    var SKIP_MSG = 'skip';
    var COLLECT_STUFF_MSG = 'collect_stuff';
    var TO_RAISE_SHIELDS_MSG = 'to_raise_shields';
    var TOUCH_AND_HOLD_MSG = 'touch_and_hold';

    var STAR_MOVEMENT = 'star_movement';
    var ASTEROID_MOVEMENT = 'asteroid_movement';
    var DRAIN_ENERGY_MSG = 'drain_energy';
    var STAR = 'star';
    var OK_MSG = 'ok';
    var NO_ENERGY_MSG = 'no_energy';

    var PUSH_RELEASE_TOUCHABLE = 'push_release_tutorial_touchable';
    var MOVE_STUFF = 'move_stuff_in_tutorial';

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

        function setupShaker() {
            [
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
        var world = createWorld();

        this.loop.add(COLLISION_TUTORIAL, world.checkCollisions.bind(world));

        function createWorld() {
            var scoreDisplay = new $.Odometer(new $.OdometerView(self.stage, countDrawables));
            var collectAnimator = new $.CollectView(self.stage, shipDrawable, 3);
            var scoreAnimator = new $.ScoreView(self.stage);
            var hullHitView = new $.ShipHitView(self.stage, shipDrawable, self.timer);
            var livesView = new $.LivesView(self.stage, lifeDrawablesDict);
            var shieldsHitView = new $.ShieldsHitView(self.stage, shieldsDrawable, self.timer);
            return new $.GameWorld(self.stage, trackedAsteroids, trackedStars, scoreDisplay, collectAnimator,
                scoreAnimator, shipCollision, shieldsCollision, shipDrawable, shieldsDrawable, self.shaker,
                lifeDrawablesDict, endGame, self.sounds, hullHitView, shieldsHitView, livesView);
        }

        shieldsDrawable.x = shipDrawable.x;
        shieldsDrawable.y = shipDrawable.y;
        var energyStates = createEnergyStateMachine();

        function createEnergyStateMachine() {
            var energyBarView = new $.EnergyBarView(self.stage, energyBarDrawable);
            return new $.EnergyStateMachine(self.stage, world, shieldsDrawable, shieldsUpSprite, shieldsDownSprite,
                self.sounds, energyBarView);
        }

        var touchable = new $.Touchable(PUSH_RELEASE_TOUCHABLE, 0, 0, self.resize.getWidth(), self.resize.getHeight());
        self.resize.add(PUSH_RELEASE_TOUCHABLE, function (width, height) {
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

        var __4 = get__4(self.resize.getHeight());
        var __2 = get__2(self.resize.getHeight());
        var __1 = get__1(self.resize.getHeight());
        var heightQuarter = $.Height.QUARTER(self.resize.getHeight());

        self.resize.add(MOVE_STUFF, function (width, height) {
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

        self.loop.add(ASTEROID_MOVEMENT, moveMyFirstAsteroids);

        function removeTouchNHoldStuff() {
            if (touchTxts)
                touchTxts.forEach(self.stage.remove.bind(self.stage));
            self.loop.remove(ASTEROID_MOVEMENT);
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

        var starTxts, star;

        function collectStarsSubScene() {
            function createFirstStar() {

                function getStarMinusHeightHalf() {
                    return $.calcScreenConst(self.stage.getGraphic(STAR).height, 2);
                }

                function getStarWidthHalf() {
                    return $.calcScreenConst(self.stage.getGraphic(STAR).height, 2);
                }

                var star = self.stage.drawFresh($.subtract($.Width.HALF, getStarWidthHalf), getStarMinusHeightHalf,
                    STAR);
                trackedStars[star.id] = star;

                return star;
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
                } else if (!world.shieldsOn) {
                    star.y += __1;
                } else if (star.y > heightQuarter) {
                    star.y -= __2;
                }
                if (world.points < 1 && !self.stage.has(star)) {
                    star = createFirstStar();
                }
                if (!self.stage.has(star)) {
                    removeEveryThing();
                    endGame();
                }
            }

            starTxts = createCollectTxt();
            star = createFirstStar();

            self.loop.add(STAR_MOVEMENT, moveMyFirstStar);
        }

        function removeStarStuff() {
            if (starTxts)
                starTxts.forEach(self.stage.remove.bind(self.stage));
            self.loop.remove(STAR_MOVEMENT);
            if (star)
                self.stage.remove(star);
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
            self.loop.remove(COLLISION_TUTORIAL);
            self.resize.remove(PUSH_RELEASE_TOUCHABLE);
            self.resize.remove(MOVE_STUFF);
        }

        function endGame() {
            self.next(nextScene);
        }
    };

    InGameTutorial.prototype.next = function (nextScene) {
        nextScene();
    };

    return InGameTutorial;
})({
    Math: Math,
    Odometer: Odometer,
    CollectView: CollectView,
    OdometerView: OdometerView,
    ScoreView: ScoreView,
    GameWorld: GameWorld,
    EnergyStateMachine: EnergyStateMachine,
    calcScreenConst: calcScreenConst,
    Touchable: Touchable,
    changeTouchable: changeTouchable,
    EnergyBarView: EnergyBarView,
    Width: Width,
    Height: Height,
    Font: Font,
    ShieldsHitView: ShieldsHitView,
    ShipHitView: ShipHitView,
    LivesView: LivesView,
    add: add,
    subtract: subtract,
    drawShields: drawShields
});