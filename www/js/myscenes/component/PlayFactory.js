var PlayFactory = (function (ObstaclesView, LevelGenerator, EnergyBarView, EnergyStateMachine, Odometer,
    OdometerView, CollectView, ScoreView, ShipHitView, LivesView, ShieldsHitView, GameWorld) {
    "use strict";

    function createLevel(stage, trackedAsteroids, trackedStars) {
        var obstaclesView = new ObstaclesView(stage, trackedAsteroids, trackedStars);
        return new LevelGenerator(obstaclesView);
    }

    function createEnergyStateMachine(stage, sounds, energyBarDrawable, world, shieldsDrawable, shieldsUpSprite,
        shieldsDownSprite) {
        var energyBarView = new EnergyBarView(stage, energyBarDrawable);
        return new EnergyStateMachine(stage, world, shieldsDrawable, shieldsUpSprite, shieldsDownSprite, sounds,
            energyBarView);
    }

    function createWorld(stage, sounds, timer, shaker, countDrawables, shipDrawable, lifeDrawablesDict, shieldsDrawable,
        trackedAsteroids, trackedStars, shipCollision, shieldsCollision, endGame) {
        var scoreDisplay = new Odometer(new OdometerView(stage, countDrawables, shaker));
        var collectAnimator = new CollectView(stage, shipDrawable, shaker);
        var scoreAnimator = new ScoreView(stage);
        var hullHitView = new ShipHitView(stage, shipDrawable, timer, shaker);
        var livesView = new LivesView(stage, lifeDrawablesDict, shaker);
        var shieldsHitView = new ShieldsHitView(stage, shieldsDrawable, timer, shaker);
        return new GameWorld(stage, trackedAsteroids, trackedStars, scoreDisplay, collectAnimator, scoreAnimator,
            shipCollision, shieldsCollision, shipDrawable, shieldsDrawable, shaker, lifeDrawablesDict, endGame, sounds,
            hullHitView, shieldsHitView, livesView);
    }

    return {
        createLevel: createLevel,
        createEnergyStateMachine: createEnergyStateMachine,
        createWorld: createWorld
    };
})(ObstaclesView, LevelGenerator, EnergyBarView, EnergyStateMachine, Odometer, OdometerView, CollectView,
    ScoreView, ShipHitView, LivesView, ShieldsHitView, GameWorld);