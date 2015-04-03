var PlayFactory = (function (ObstaclesView, LevelGenerator, EnergyBarView, EnergyStateMachine, Odometer, OdometerView,
    CollectView, ScoreView, ShipHitView, LivesView, ShieldsHitView, GameWorld, Object) {
    "use strict";

    function createLevel(stage, trackedAsteroids, trackedStars, messages, gameStats, is30fps) {
        var obstaclesView = new ObstaclesView(stage, trackedAsteroids, trackedStars, messages, is30fps);
        return new LevelGenerator(obstaclesView, gameStats, is30fps);
    }

    function createEnergyStateMachine(stage, events, sounds, timer, energyBarDrawable, world, shieldsDrawable, shieldsUpSprite,
        shieldsDownSprite, shieldsMaxEnergyLevel_OneToFour, gameStats, is30fps) {
        var energyBarView = new EnergyBarView(stage, energyBarDrawable, shieldsMaxEnergyLevel_OneToFour, is30fps);
        return new EnergyStateMachine(stage, events, world, shieldsDrawable, shieldsUpSprite, shieldsDownSprite, sounds,
            energyBarView, gameStats, timer);
    }

    function createWorld(stage, events, sounds, timer, shaker, countDrawables, shipDrawable, lifeDrawablesDict, shieldsDrawable,
        trackedAsteroids, trackedStars, shipCollision, shieldsCollision, endGame, gameStats, is30fps) {
        var scoreDisplay = new Odometer(new OdometerView(stage, countDrawables, shaker, is30fps));
        var collectAnimator = new CollectView(stage, shipDrawable, shaker, is30fps);
        var scoreAnimator = new ScoreView(stage, is30fps);
        var hullHitView = new ShipHitView(stage, shipDrawable, timer, shaker, is30fps);
        var livesView = new LivesView(stage, lifeDrawablesDict, shaker, is30fps);
        var shieldsHitView = new ShieldsHitView(stage, shieldsDrawable, timer, shaker, is30fps);
        return new GameWorld(stage, events, trackedAsteroids, trackedStars, scoreDisplay, collectAnimator, scoreAnimator,
            shipCollision, shieldsCollision, shipDrawable, shieldsDrawable, shaker,
            Object.keys(lifeDrawablesDict).length, endGame, sounds, hullHitView, shieldsHitView, livesView, gameStats);
    }

    return {
        createLevel: createLevel,
        createEnergyStateMachine: createEnergyStateMachine,
        createWorld: createWorld
    };
})(ObstaclesView, LevelGenerator, EnergyBarView, EnergyStateMachine, Odometer, OdometerView, CollectView, ScoreView,
    ShipHitView, LivesView, ShieldsHitView, GameWorld, Object);