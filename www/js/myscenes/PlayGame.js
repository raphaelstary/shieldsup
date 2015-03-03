var PlayGame = (function ($) {
    "use strict";

    function PlayGame(services) {
        this.stage = services.stage;
        this.sceneStorage = services.sceneStorage;
        this.sounds = services.sounds;
        this.shaker = services.shaker;
        this.timer = services.timer;
        this.buttons = services.buttons;
        this.messages = services.messages;
        this.device = services.device;
        this.events = services.events;
    }

    PlayGame.prototype.show = function (nextScene) {
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
        var distanceDrawable = this.sceneStorage.distance;

        var distanceCounter = 0;
        var evenCounter = 0;

        var distanceMeter = this.events.subscribe($.Event.TICK_MOVE, function () {
            if (self.sceneStorage.do30fps) {
                if (evenCounter % 2 == 0) {

                    distanceCounter++;
                    distanceDrawable.data.msg = distanceCounter.toString() + ' m';

                    evenCounter = 0;
                }
                evenCounter++
            } else {
                distanceCounter++;
                distanceDrawable.data.msg = distanceCounter.toString() + ' m';
            }
        });

        // simple pause button
        var pauseButton = this.buttons.createSecondaryButton($.Width.get(10), $.Height.TOP_RASTER, ' = ', doThePause,
            3);

        function doThePause() {
            pause();
            self.events.fireSync($.Event.PAUSE);
            self.sceneStorage.menuScene = 'pause_menu';
            $.showMenu(self.stage, self.buttons, self.messages, self.events, self.sceneStorage, self.device,
                self.sounds, resume);
        }

        pauseButton.text.rotation = $.Math.PI / 2;
        pauseButton.text.scale = 2;
        self.stage.hide(pauseButton.background);

        function setupShaker() {
            var add = self.shaker.add.bind(self.shaker);
            [
                pauseButton.text, shipDrawable, shieldsDrawable, energyBarDrawable, fireDict.left, fireDict.right
            ].forEach(add);
            speedStripes.forEach(function (wrapper) {
                self.shaker.add(wrapper.drawable);
            });
            $.iterateEntries(lifeDrawablesDict, self.shaker.add, self.shaker);
        }

        setupShaker();

        var trackedAsteroids = {};
        var trackedStars = {};

        var level = $.PlayFactory.createLevel(self.stage, trackedAsteroids, trackedStars, self.messages,
            self.sceneStorage.do30fps);
        var levelId = self.events.subscribe($.Event.TICK_MOVE, level.update.bind(level));

        var shipCollision = self.stage.getCollisionDetector(shipDrawable);
        var anotherShieldsDrawable = $.drawShields(self.stage, shipDrawable).drawable;
        var shieldsCollision = self.stage.getCollisionDetector(anotherShieldsDrawable);


        var world = $.PlayFactory.createWorld(self.stage, self.sounds, self.timer, self.shaker, countDrawables,
            shipDrawable, lifeDrawablesDict, shieldsDrawable, trackedAsteroids, trackedStars, shipCollision,
            shieldsCollision, endGame, self.sceneStorage.do30fps);
        var collisionId = self.events.subscribe($.Event.TICK_COLLISION, world.checkCollisions.bind(world));
        var playerShieldsLevel = 1;
        var energyStates = $.PlayFactory.createEnergyStateMachine(self.stage, self.sounds, energyBarDrawable, world,
            shieldsDrawable, shieldsUpSprite, shieldsDownSprite, playerShieldsLevel, self.sceneStorage.do30fps);

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

        registerPushRelease();

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

        var resumeId = self.events.subscribe($.Event.RESUME, registerPushRelease);
        var pauseId = self.events.subscribe($.Event.PAUSE, function () {
            self.events.unsubscribe(pushRelease);
            self.events.unsubscribe(padId);
            self.events.unsubscribe(keyId);
        });

        var isPaused = false;

        function pause() {
            self.stage.hide(pauseButton.text);
            isPaused = true;
        }

        function resume() {
            self.stage.show(pauseButton.text);
            pauseButton.used = false;
            isPaused = false;
        }

        var itIsOver = false;

        function endGame(points) {
            if (itIsOver)
                return;
            itIsOver = true;

            function removeEverything() {
                self.buttons.remove(pauseButton);

                var remove = self.stage.remove.bind(self.stage);
                $.iterateEntries(trackedAsteroids, remove);
                $.iterateEntries(trackedStars, function (wrapper) {
                    self.stage.remove(wrapper.star);
                    self.stage.remove(wrapper.highlight);
                });
                $.iterateEntries(lifeDrawablesDict, remove);
                self.events.unsubscribe(collisionId);
                self.events.unsubscribe(levelId);
                self.events.unsubscribe(pushRelease);
                self.events.unsubscribe(padId);
                self.events.unsubscribe(keyId);
                self.events.unsubscribe(resumeId);
                self.events.unsubscribe(pauseId);
                world.reset();
                self.shaker.reset(self.sceneStorage.do30fps);
                self.stage.detachCollisionDetector(shipCollision);
                self.stage.detachCollisionDetector(shieldsCollision);
                self.stage.remove(anotherShieldsDrawable);
                self.stage.remove(shieldsDrawable);

                self.events.unsubscribe(visible);
                self.events.unsubscribe(showGoFs);
                self.events.unsubscribe(hideGoFs);
                self.events.unsubscribe(showRotation);
                self.events.unsubscribe(hideRotation);
                self.events.unsubscribe(distanceMeter);
            }

            removeEverything();

            self.stage.move(energyBarDrawable, EnergyBar.getX, $.add($.EnergyBar.getY, $.Height.THIRD), 60,
                $.Transition.EASE_OUT_EXPO, false, function () {
                    self.stage.remove(energyBarDrawable);
                });

            self.next(nextScene, points);
        }
    };

    PlayGame.prototype.next = function (nextScene, points) {
        delete this.sceneStorage.shields;
        delete this.sceneStorage.energyBar;
        delete this.sceneStorage.lives;

        this.sceneStorage.points = points;

        this.sounds.stop(this.sceneStorage.music);

        nextScene();
    };

    return PlayGame;
})({
    Transition: Transition,
    iterateEntries: iterateEntries,
    drawShields: drawShields,
    EnergyBar: EnergyBar,
    add: add,
    Height: Height,
    PlayFactory: PlayFactory,
    changeSign: changeSign,
    Width: Width,
    Math: Math,
    showMenu: showMenu,
    Event: Event,
    Key: Key
});