var PlayGame = (function ($) {
    "use strict";

    function PlayGame(services) {
        this.stage = services.stage;
        this.sceneStorage = services.sceneStorage;
        this.loop = services.loop;
        this.pushRelease = services.pushRelease;
        this.resize = services.resize;
        this.sounds = services.sounds;
        this.shaker = services.shaker;
        this.timer = services.timer;
        this.buttons = services.buttons;
    }

    var PUSH_RELEASE = 'game_controller';
    var COLLISION = 'collisions';
    var LEVEL = 'level';

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
        function getPauseX(width) {
            return calcScreenConst(width, 10, 9) + 20;
        }

        var pauseButton = this.buttons.createSecondaryButton(getPauseX, Height.TOP_RASTER, 'P', pause);
        // end simple pause button

        function setupShaker() {
            var add = self.shaker.add.bind(self.shaker);
            [
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
        self.loop.add(LEVEL, level.update.bind(level));

        var shipCollision = self.stage.getCollisionDetector(shipDrawable);
        var anotherShieldsDrawable = $.drawShields(self.stage, shipDrawable).drawable;
        var shieldsCollision = self.stage.getCollisionDetector(anotherShieldsDrawable);


        var world = $.PlayFactory.createWorld(self.stage, self.sounds, self.timer, self.shaker, countDrawables,
            shipDrawable, lifeDrawablesDict, shieldsDrawable, trackedAsteroids, trackedStars, shipCollision,
            shieldsCollision, endGame);
        self.loop.add(COLLISION, world.checkCollisions.bind(world));

        shieldsDrawable.x = shipDrawable.x;
        shieldsDrawable.y = shipDrawable.y;

        var energyStates = $.PlayFactory.createEnergyStateMachine(self.stage, self.sounds, energyBarDrawable, world,
            shieldsDrawable, shieldsUpSprite, shieldsDownSprite);

        var touchable = $.PlayFactory.createTouchable(PUSH_RELEASE, self.resize.getWidth(), self.resize.getHeight());

        function setupGameController(touchable, energyStates) {
            self.resize.add(PUSH_RELEASE, function (width, height) {
                $.changeTouchable(touchable, 0, 0, width, height);
            });
            self.pushRelease.add(touchable, energyStates.drainEnergy.bind(energyStates),
                energyStates.loadEnergy.bind(energyStates));
        }

        setupGameController(touchable, energyStates);

        var backBlur, menuBack, resumeButton;
        function pause() {
            self.pushRelease.disable(touchable);
            self.loop.disable(LEVEL);
            self.loop.disable(COLLISION);
            speedStripes.forEach(function (wrapper) {
                self.stage.pause(wrapper.drawable);
            });
            $.iterateEntries(fireDict, function (fire) {
                self.stage.pause(fire);
            });
            self.stage.pause(shieldsDrawable);
            countDrawables.forEach(function (count) {
                self.stage.pause(count);
            });
            $.iterateEntries(lifeDrawablesDict, function (life) {
                self.stage.pause(life);
            });
            self.stage.pause(energyBarDrawable);
            self.loop.disable('screen_shaker');
            $.iterateEntries(trackedAsteroids, function (asteroid) {
                self.stage.pause(asteroid);
            });
            $.iterateEntries(trackedStars, function (wrapper) {
                self.stage.pause(wrapper.star);
                self.stage.pause(wrapper.highlight);
            });

            backBlur = self.stage.drawRectangle(Width.HALF, Height.HALF, Width.FULL, Height.FULL, '#000', true,
                undefined, 7, 0.8);
            menuBack = self.stage.drawRectangle(changeSign(Width.HALF), Height.HALF, Width.THREE_QUARTER,
                Height.THREE_QUARTER, '#fff', true, undefined, 8, 0.5);
            self.stage.move(menuBack, Width.HALF, Height.HALF, 15, Transition.EASE_IN_EXPO, false, function () {
                resumeButton = self.buttons.createSecondaryButton(Width.HALF, Height.HALF, 'resume', resume);
            });
        }

        function resume() {
            self.buttons.remove(resumeButton);
            self.stage.move(menuBack, changeSign(Width.HALF), Height.HALF, 15, Transition.EASE_OUT_EXPO, false,
                function () {
                    self.stage.remove(menuBack);
                    self.stage.remove(backBlur);

                    pauseButton.used = false;

                    // resume everything
                    self.pushRelease.enable(touchable);
                    self.loop.enable(LEVEL);
                    self.loop.enable(COLLISION);
                    speedStripes.forEach(function (wrapper) {
                        self.stage.play(wrapper.drawable);
                    });
                    $.iterateEntries(fireDict, function (fire) {
                        self.stage.play(fire);
                    });
                    self.stage.play(shieldsDrawable);
                    countDrawables.forEach(function (count) {
                        self.stage.play(count);
                    });
                    $.iterateEntries(lifeDrawablesDict, function (life) {
                        self.stage.play(life);
                    });
                    self.stage.play(energyBarDrawable);
                    self.loop.enable('screen_shaker');
                    $.iterateEntries(trackedAsteroids, function (asteroid) {
                        self.stage.play(asteroid);
                    });
                    $.iterateEntries(trackedStars, function (wrapper) {
                        self.stage.play(wrapper.star);
                        self.stage.play(wrapper.highlight);
                    });
                });
        }

        function endGame(points) {
            function removeEverything() {
                var remove = self.stage.remove.bind(self.stage);
                $.iterateEntries(trackedAsteroids, remove);
                $.iterateEntries(trackedStars, function (wrapper) {
                    self.stage.remove(wrapper.star);
                    self.stage.remove(wrapper.highlight);
                });
                $.iterateEntries(lifeDrawablesDict, remove);
                self.loop.remove(COLLISION);
                self.loop.remove(LEVEL);
                self.pushRelease.remove(touchable);
                self.resize.remove(PUSH_RELEASE);
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

        nextScene();
    };

    return PlayGame;
})({
    Transition: Transition,
    changeTouchable: changeTouchable,
    iterateEntries: iterateEntries,
    drawShields: drawShields,
    EnergyBar: EnergyBar,
    add: add,
    Height: Height,
    PlayFactory: PlayFactory
});