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
        this.missions = services.missions;
    }

    var TOTAL_TIME = 'shields_up-total_time';
    var TOTAL_STARTS = 'shields_up-total_starts';
    var SHOP_ENERGY = 'shields_up-shop_energy';
    var SHOP_LUCK = 'shields_up-shop_luck';

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

        this.sceneStorage.gameStats = gameStats;
        var lostLife = false;
        var lostLifeTime = 0;
        var lifeLostListener = this.events.subscribe($.Event.LIFE_LOST, function () {
            lostLife = true;
        });
        var alarm = false;
        var alarmTime = 0;
        var alarmListener = this.events.subscribe($.Event.ALARM, function () {
            alarm = true;
        });
        var starCollected = false;
        var starCollectedTime = 0;
        var starCollectedListener = this.events.subscribe($.Event.STAR_COLLECTED, function () {
            starCollected = true;
        });

        var evenCounter = 0;

        function distanceTimeTick() {
            gameStats.timePlayed++;
            if (world.shieldsOn) {
                gameStats.timeShieldsOn++;
            } else {
                gameStats.timeShieldsOff++
            }
            if (lostLife) {
                lostLife = false;
                if (lostLifeTime > gameStats.timeWithoutLifeLost) {
                    gameStats.timeWithoutLifeLost = lostLifeTime;
                }
                lostLifeTime = 0;
            } else {
                lostLifeTime++;
            }
            if (alarm) {
                alarm = false;
                if (alarmTime > gameStats.timeWithoutAlarm) {
                    gameStats.timeWithoutAlarm = alarmTime;
                }
                alarmTime = 0;
            } else {
                alarmTime++;
            }
            if (starCollected) {
                starCollected = false;
                if (starCollectedTime > gameStats.timeWithoutStarCollected) {
                    gameStats.timeWithoutStarCollected = starCollectedTime;
                }
                starCollectedTime = 0;
            } else {
                starCollectedTime++;
            }
            distanceDrawable.data.msg = gameStats.timePlayed.toString() + ' m';
        }

        function updateTimes() {
            if (lostLifeTime > gameStats.timeWithoutLifeLost) {
                gameStats.timeWithoutLifeLost = lostLifeTime;
            }
            if (alarmTime > gameStats.timeWithoutAlarm) {
                gameStats.timeWithoutAlarm = alarmTime;
            }
            if (starCollectedTime > gameStats.timeWithoutStarCollected) {
                gameStats.timeWithoutStarCollected = starCollectedTime;
            }
        }

        var distanceMeter = this.events.subscribe($.Event.TICK_MOVE, function () {
            if (!self.sceneStorage.do30fps) {
                if (evenCounter % 2 == 0) {
                    distanceTimeTick();
                    evenCounter = 0;
                }
                evenCounter++
            } else {
                distanceTimeTick();
            }
        });

        var forTheFirstTime = true;
        var outOfEnergy = this.events.subscribe($.Event.OUT_OF_ENERGY, function () {
            if (forTheFirstTime && !self.sceneStorage.showedEnergyTutorial) {
                self.sceneStorage.showedEnergyTutorial = true;
                forTheFirstTime = false;
                self.sceneStorage.menuScene = 'energy_tutorial';
                pause();
                self.events.fireSync($.Event.PAUSE);
                $.showMenu(self.stage, self.buttons, self.messages, self.events, self.sceneStorage, self.device,
                    self.sounds, self.missions, resume);
            }
        });

        var pauseButton = $.drawPauseButton(this.buttons, doThePause);

        function doThePause() {
            updateTimes();
            pause();
            self.events.fireSync($.Event.PAUSE);
            self.sceneStorage.menuScene = 'pause_menu';
            $.showMenu(self.stage, self.buttons, self.messages, self.events, self.sceneStorage, self.device,
                self.sounds, self.missions, resume);
        }

        function setupShaker() {
            var add = self.shaker.add.bind(self.shaker);
            [
                pauseButton.text,
                pauseButton.background,
                shipDrawable,
                shieldsDrawable,
                energyBarDrawable,
                fireDict.left,
                fireDict.right
            ].forEach(add);
            if (speedStripes)
                speedStripes.forEach(function (wrapper) {
                    self.shaker.add(wrapper.drawable);
                });
            $.iterateEntries(lifeDrawablesDict, self.shaker.add, self.shaker);
        }

        setupShaker();

        var trackedAsteroids = {};
        var trackedStars = {};

        function allLevelsComplete() {
            endGame(world.points);
        }

        var luckLevel = $.loadInteger(SHOP_LUCK);
        var level = $.PlayFactory.createLevel(self.stage, allLevelsComplete, trackedAsteroids, trackedStars,
            self.messages, gameStats, luckLevel, self.sceneStorage.do30fps);
        var levelId = self.events.subscribe($.Event.TICK_MOVE, level.update.bind(level));

        var shipCollision = self.stage.getCollisionDetector(shipDrawable);
        var anotherShieldsDrawable = $.drawShields(self.stage, shipDrawable).drawable;
        var shieldsCollision = self.stage.getCollisionDetector(anotherShieldsDrawable);


        var world = $.PlayFactory.createWorld(self.stage, self.events, self.sounds, self.timer, self.shaker, countDrawables,
            shipDrawable, lifeDrawablesDict, shieldsDrawable, trackedAsteroids, trackedStars, shipCollision,
            shieldsCollision, endGame, gameStats, self.sceneStorage.do30fps, self.sceneStorage.lowPerformance);
        var collisionId = self.events.subscribe($.Event.TICK_COLLISION, world.checkCollisions.bind(world));
        var playerShieldsLevel = $.loadInteger(SHOP_ENERGY) + 1;
        var energyStates = $.PlayFactory.createEnergyStateMachine(self.stage, self.events, self.sounds, self.timer,
            energyBarDrawable, world, shieldsDrawable, shieldsUpSprite, shieldsDownSprite, playerShieldsLevel,
            gameStats, self.sceneStorage.do30fps);

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
            isPaused = true;
        }

        function resume() {
            pauseButton.used = false;
            isPaused = false;
        }

        var startTime = $.Date.now();
        var totalStarts = $.loadInteger(TOTAL_STARTS);
        $.localStorage.setItem(TOTAL_STARTS, ++totalStarts);

        var itIsOver = false;

        function endGame(points) {
            if (itIsOver)
                return;
            itIsOver = true;

            var totalTime = $.loadInteger(TOTAL_TIME);
            var deltaPlayed = $.Date.now() - startTime;
            $.localStorage.setItem(TOTAL_TIME, totalTime + deltaPlayed);
            gameStats.points = points;

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
                self.events.unsubscribe(alarmListener);
                self.events.unsubscribe(lifeLostListener);
                self.events.unsubscribe(starCollectedListener);
                self.events.unsubscribe(outOfEnergy);
            }

            removeEverything();

            self.stage.move(energyBarDrawable, EnergyBar.getX, $.add($.EnergyBar.getY, $.Height.THIRD), 60,
                $.Transition.EASE_OUT_EXPO, false, function () {
                    self.stage.remove(energyBarDrawable);
                });

            updateTimes();
            self.next(nextScene, gameStats);
        }
    };

    PlayGame.prototype.next = function (nextScene, gameStats) {
        delete this.sceneStorage.shields;
        delete this.sceneStorage.energyBar;
        delete this.sceneStorage.lives;
        delete this.sceneStorage.gameStats;

        this.sceneStorage.gameStats = gameStats;
        if (this.sceneStorage.music)
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
    Key: Key,
    Date: Date,
    loadInteger: loadInteger,
    localStorage: lclStorage,
    drawPauseButton: drawPauseButton
});