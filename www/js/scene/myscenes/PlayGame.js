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

        function createLevel() {
            var obstaclesView = new $.ObstaclesView(self.stage, trackedAsteroids, trackedStars);
            var level = new $.LevelGenerator(obstaclesView);

            self.loop.add(LEVEL, level.update.bind(level));
        }

        createLevel();

        var shipCollision = self.stage.getCollisionDetector(shipDrawable);
        var anotherShieldsDrawable = $.drawShields(self.stage, shipDrawable).drawable;
        var shieldsCollision = self.stage.getCollisionDetector(anotherShieldsDrawable);

        function createWorld() {
            var scoreDisplay = new $.Odometer(new $.OdometerView(self.stage, countDrawables, self.shaker));
            var collectAnimator = new $.CollectView(self.stage, shipDrawable, self.shaker);
            var scoreAnimator = new $.ScoreView(self.stage);
            var hullHitView = new $.ShipHitView(self.stage, shipDrawable, self.timer, self.shaker);
            var livesView = new $.LivesView(self.stage, lifeDrawablesDict, self.shaker);
            var shieldsHitView = new $.ShieldsHitView(self.stage, shieldsDrawable, self.timer, self.shaker);
            var world = new $.GameWorld(self.stage, trackedAsteroids, trackedStars, scoreDisplay, collectAnimator,
                scoreAnimator, shipCollision, shieldsCollision, shipDrawable, shieldsDrawable, self.shaker,
                lifeDrawablesDict, endGame, self.sounds, hullHitView, shieldsHitView, livesView);

            self.loop.add(COLLISION, world.checkCollisions.bind(world));

            return world;
        }

        var world = createWorld();

        shieldsDrawable.x = shipDrawable.x;
        shieldsDrawable.y = shipDrawable.y;

        function createEnergyStateMachine() {
            var energyBarView = new $.EnergyBarView(self.stage, energyBarDrawable);
            return new $.EnergyStateMachine(self.stage, world, shieldsDrawable, shieldsUpSprite, shieldsDownSprite,
                self.sounds, energyBarView);
        }

        var energyStates = createEnergyStateMachine();

        function createGameController() {
            var touchable = new $.Touchable(PUSH_RELEASE, 0, 0, self.resize.getWidth(), self.resize.getHeight());
            self.resize.add(touchable.id, function (width, height) {
                $.changeTouchable(touchable, 0, 0, width, height);
            });
            self.pushRelease.add(touchable, energyStates.drainEnergy.bind(energyStates),
                energyStates.loadEnergy.bind(energyStates));
            return touchable;
        }

        var touchable = createGameController();

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
    LevelGenerator: LevelGenerator,
    Odometer: Odometer,
    CollectView: CollectView,
    ObstaclesView: ObstaclesView,
    OdometerView: OdometerView,
    ScoreView: ScoreView,
    GameWorld: GameWorld,
    EnergyStateMachine: EnergyStateMachine,
    EnergyBarView: EnergyBarView,
    changeTouchable: changeTouchable,
    iterateEntries: iterateEntries,
    ShieldsHitView: ShieldsHitView,
    ShipHitView: ShipHitView,
    LivesView: LivesView,
    drawShields: drawShields,
    EnergyBar: EnergyBar,
    add: add,
    Height: Height,
    Touchable: Touchable
});