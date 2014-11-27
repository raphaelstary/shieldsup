var PlayGame = (function ($) {
    "use strict";

    function PlayGame(stage, sceneStorage, gameLoop, gameController, resizeBus, sounds) {
        this.stage = stage;
        this.sceneStorage = sceneStorage;
        this.gameLoop = gameLoop;
        this.gameController = gameController;
        this.resizeBus = resizeBus;
        this.sounds = sounds;
    }

    PlayGame.prototype.resize = function (width, height) {
        this.screenWidth = width;
        this.screenHeight = height;
        $.GameStuffHelper.resize(this.stage, this.sceneStorage, width, height);
        this.resizeRepo.call();
        this.resizeShaker();
    };

    PlayGame.prototype.show = function (nextScene, screenWidth, screenHeight) {
        this.resizeBus.add('play_game_scene', this.resize.bind(this));
        this.resizeRepo = new $.Repository();
        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;

        var self = this;

        var shipDrawable = this.sceneStorage.ship, shieldsDrawable = this.sceneStorage.shields ||
            (this.sceneStorage.shields = this.stage.getDrawable($.calcScreenConst(self.screenWidth, 2), Height._400,
                'shields')), energyBarDrawable = this.sceneStorage.energyBar, lifeDrawablesDict = this.sceneStorage.lives, countDrawables = this.sceneStorage.counts, fireDrawable = this.sceneStorage.fire, speedStripes = this.sceneStorage.speedStripes, shieldsUpSprite = this.sceneStorage.shieldsUp ||
            this.stage.getSprite('shields_up/shields_up', 6,
                false), shieldsDownSprite = this.sceneStorage.shieldsDown ||
            this.stage.getSprite('shields_down/shields_down', 6, false);

        var shaker = new $.ScreenShaker([
            shipDrawable,
            shieldsDrawable,
            energyBarDrawable,
            lifeDrawablesDict[1],
            lifeDrawablesDict[2],
            lifeDrawablesDict[3],
            fireDrawable
        ]);
        countDrawables.forEach(shaker.add.bind(shaker));
        speedStripes.forEach(function (wrapper) {
            shaker.add(wrapper.drawable);
        });

        this.resizeShaker = shaker.resize.bind(shaker);

        var trackedAsteroids = {};
        var trackedStars = {};
        var obstaclesResizeRepo = new $.Repository();
        var obstaclesView = new $.ObstaclesView(this.stage, trackedAsteroids, trackedStars, obstaclesResizeRepo,
            self.screenWidth, self.screenHeight);
        self.resizeRepo.add({id: 'obstacle_view'}, function () {
            obstaclesView.resize(self.screenWidth, self.screenHeight);
        });
        var level = new $.LevelGenerator(obstaclesView);

        var scoreDisplay = new $.Odometer(new $.OdometerView(this.stage, countDrawables));
        var collectAnimator = new $.CollectView(this.stage, shipDrawable, 3);
        var scoreAnimator = new $.ScoreView(this.stage, self.screenWidth, self.screenHeight);
        self.resizeRepo.add({id: 'score_view_game'}, function () {
            scoreAnimator.resize(self.screenWidth, self.screenHeight);
        });
        var shipCollision = new $.CanvasCollisionDetector(this.stage.getGraphic('ship'), shipDrawable);
        var shieldsCollision = new $.CanvasCollisionDetector(this.stage.getGraphic('shields'), shieldsDrawable);

        var world = new $.GameWorld(this.stage, trackedAsteroids, trackedStars, scoreDisplay, collectAnimator,
            scoreAnimator, shipCollision, shieldsCollision, shipDrawable, shieldsDrawable, shaker, lifeDrawablesDict,
            obstaclesResizeRepo.remove.bind(obstaclesResizeRepo), endGame, this.sounds);

        this.gameLoop.add('shake', shaker.update.bind(shaker));
        this.gameLoop.add('collisions', world.checkCollisions.bind(world));
        this.gameLoop.add('level', level.update.bind(level));

        shieldsDrawable.x = shipDrawable.x;
        shieldsDrawable.y = shipDrawable.y;

        var energyStates = new $.EnergyStateMachine(this.stage, world, shieldsDrawable, shieldsUpSprite,
            shieldsDownSprite, energyBarDrawable, this.sounds);

        var touchable = {
            id: 'shields_up',
            x: 0,
            y: 0,
            width: self.screenWidth,
            height: self.screenHeight
        };
        self.resizeRepo.add(touchable, function () {
            $.changeTouchable(touchable, 0, 0, self.screenWidth, self.screenHeight);
        });
        this.gameController.add(touchable, energyStates.drainEnergy.bind(energyStates),
            energyStates.loadEnergy.bind(energyStates));

        //end scene todo move to own scene
        function endGame(points) {
            var remove = self.stage.remove.bind(self.stage);
            $.iterateEntries(trackedAsteroids, remove);
            $.iterateEntries(trackedStars, remove);
            $.iterateEntries(lifeDrawablesDict, remove);

            self.gameLoop.remove('shake');
            self.gameLoop.remove('collisions');
            self.gameLoop.remove('level');

            self.gameController.remove(touchable);
            var outOffSet = $.calcScreenConst(self.screenWidth, 3);
            var barOut = self.stage.getPath(energyBarDrawable.x, energyBarDrawable.y, energyBarDrawable.x,
                energyBarDrawable.y + outOffSet, 60, $.Transition.EASE_OUT_EXPO);

            self.resizeRepo.add(energyBarDrawable, function () {
                var outOffSet = $.calcScreenConst(self.screenWidth, 3);
                $.changePath(energyBarDrawable, energyBarDrawable.x, energyBarDrawable.y, energyBarDrawable.x,
                    energyBarDrawable.y + outOffSet)
            });

            self.stage.move(energyBarDrawable, barOut, function () {
                self.stage.remove(energyBarDrawable);
            });

            self.next(nextScene, points);
        }
    };

    PlayGame.prototype.next = function (nextScene, points) {
        delete this.resizeRepo;
        this.resizeBus.remove('play_game_scene');
        delete this.resizeShaker;

        delete this.sceneStorage.shields;
        delete this.sceneStorage.energyBar;
        delete this.sceneStorage.lives;
        delete this.sceneStorage.shieldsUp;
        delete this.sceneStorage.shieldsDown;

        this.sceneStorage.points = points;

        nextScene();
    };

    return PlayGame;
})({
    Transition: Transition,
    ScreenShaker: ScreenShaker,
    LevelGenerator: LevelGenerator,
    Odometer: Odometer,
    CollectView: CollectView,
    ObstaclesView: ObstaclesView,
    OdometerView: OdometerView,
    ScoreView: ScoreView,
    CanvasCollisionDetector: CanvasCollisionDetector,
    GameWorld: GameWorld,
    EnergyStateMachine: EnergyStateMachine,
    calcScreenConst: calcScreenConst,
    GameStuffHelper: drawSharedGameStuff,
    Repository: Repository,
    changeTouchable: changeTouchable,
    changeCoords: changeCoords,
    changePath: changePath,
    iterateEntries: iterateEntries
});
