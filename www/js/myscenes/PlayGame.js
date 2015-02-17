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

        // simple pause button
        var pauseButton = this.buttons.createSecondaryButton($.Width.HALF, $.Height.TOP_RASTER, ' = ', function () {
            pause();
            self.events.fireSync($.Event.PAUSE);
            $.showSettings(self.stage, self.buttons, self.messages, self.events, self.sceneStorage, self.device,
                self.sounds,
                resume);
        }, 3);
        pauseButton.text.rotation = $.Math.PI / 2;
        pauseButton.text.scale = 2;
        self.stage.hide(pauseButton.background);

        function setupShaker() {
            var add = self.shaker.add.bind(self.shaker);
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
            ].forEach(add);
            countDrawables.forEach(add);
            speedStripes.forEach(function (wrapper) {
                self.shaker.add(wrapper.drawable);
            });
        }

        setupShaker();

        var trackedAsteroids = {};
        var trackedStars = {};

        var level = $.PlayFactory.createLevel(self.stage, trackedAsteroids, trackedStars);
        var levelId = self.events.subscribe($.Event.TICK_MOVE, level.update.bind(level));

        var shipCollision = self.stage.getCollisionDetector(shipDrawable);
        var anotherShieldsDrawable = $.drawShields(self.stage, shipDrawable).drawable;
        var shieldsCollision = self.stage.getCollisionDetector(anotherShieldsDrawable);


        var world = $.PlayFactory.createWorld(self.stage, self.sounds, self.timer, self.shaker, countDrawables,
            shipDrawable, lifeDrawablesDict, shieldsDrawable, trackedAsteroids, trackedStars, shipCollision,
            shieldsCollision, endGame);
        var collisionId = self.events.subscribe($.Event.TICK_COLLISION, world.checkCollisions.bind(world));

        shieldsDrawable.x = shipDrawable.x;
        shieldsDrawable.y = shipDrawable.y;

        var energyStates = $.PlayFactory.createEnergyStateMachine(self.stage, self.sounds, energyBarDrawable, world,
            shieldsDrawable, shieldsUpSprite, shieldsDownSprite);

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

        registerPushRelease();

        var resumeId = self.events.subscribe($.Event.RESUME, registerPushRelease);
        var pauseId = self.events.subscribe($.Event.PAUSE, function () {
            self.events.unsubscribe(pushRelease);
            self.events.unsubscribe(padId);
            self.events.unsubscribe(keyId);
        });

        function pause() {
            self.stage.hide(pauseButton.text);
        }

        function resume() {
            self.stage.show(pauseButton.text);
            pauseButton.used = false;
        }

        function endGame(points) {
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
                self.shaker.reset();
                self.stage.detachCollisionDetector(shipCollision);
                self.stage.detachCollisionDetector(shieldsCollision);
                self.stage.remove(anotherShieldsDrawable);
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
    showSettings: showSettings,
    Event: Event,
    Key: Key
});