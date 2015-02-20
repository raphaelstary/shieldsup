var PlayFactory = (function (ObstaclesView, LevelGenerator, EnergyBarView, EnergyStateMachine, Odometer,
    OdometerView, CollectView, ScoreView, ShipHitView, LivesView, ShieldsHitView, GameWorld) {
    "use strict";

    function createLevel(stage, trackedAsteroids, trackedStars, is30fps) {
        var obstaclesView = new ObstaclesView(stage, trackedAsteroids, trackedStars, is30fps);
        return new LevelGenerator(obstaclesView, is30fps);
    }

    function createEnergyStateMachine(stage, sounds, energyBarDrawable, world, shieldsDrawable, shieldsUpSprite,
        shieldsDownSprite, is30fps) {
        var energyBarView = new EnergyBarView(stage, energyBarDrawable, is30fps);
        return new EnergyStateMachine(stage, world, shieldsDrawable, shieldsUpSprite, shieldsDownSprite, sounds,
            energyBarView);
    }

    function createWorld(stage, sounds, timer, shaker, countDrawables, shipDrawable, lifeDrawablesDict, shieldsDrawable,
        trackedAsteroids, trackedStars, shipCollision, shieldsCollision, endGame, is30fps) {
        var scoreDisplay = new Odometer(new OdometerView(stage, countDrawables, shaker, is30fps));
        var collectAnimator = new CollectView(stage, shipDrawable, shaker, is30fps);
        var scoreAnimator = new ScoreView(stage, is30fps);
        var hullHitView = new ShipHitView(stage, shipDrawable, timer, shaker, is30fps);
        var livesView = new LivesView(stage, lifeDrawablesDict, shaker, is30fps);
        var shieldsHitView = new ShieldsHitView(stage, shieldsDrawable, timer, shaker, is30fps);
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