var StartingPosition = (function (Transition, calcScreenConst, Height, drawSharedGameStuff, add, Font, ScoreBoard,
    EnergyBar) {
    "use strict";

    function StartingPosition(services) {
        this.stage = services.stage;
        this.sceneStorage = services.sceneStorage;
    }

    var PLAYER_LIFE = 'player_life';
    var ENERGY_FULL = 'energy_full';

    StartingPosition.prototype.show = function (nextScene) {
        drawSharedGameStuff(this.stage, this.sceneStorage);

        var self = this;
        var spacing = Transition.EASE_IN_OUT_ELASTIC;
        var speed = 60;

        function lifeX(width) {
            return calcScreenConst(width, 10);
        }

        function lifeStartX(width) {
            var x = lifeX(width);
            return x - x * 2;
        }

        function lifeTwoEndX(width) {
            return lifeX(width) + self.stage.getGraphic(PLAYER_LIFE).width;
        }

        function lifeThreeEndX(width) {
            return lifeX(width) + self.stage.getGraphic(PLAYER_LIFE).width * 2;
        }

        function moveLifeLater(xFn, delay) {
            return self.stage.moveFreshLater(lifeStartX, Height.TOP_RASTER, PLAYER_LIFE, xFn, Height.TOP_RASTER, speed,
                spacing,
                delay, false, goodToGo);
        }

        var lifeOneWrapper = moveLifeLater(lifeX, 20);
        var lifeTwoWrapper = moveLifeLater(lifeTwoEndX, 15);
        var lifeThreeWrapper = moveLifeLater(lifeThreeEndX, 10);

        function energyStartX(width) {
            var x = EnergyBar.getX(width);
            return x - x * 2;
        }

        var energyBarWrapper = self.stage.moveFresh(energyStartX, EnergyBar.getY, ENERGY_FULL, EnergyBar.getX,
            EnergyBar.getY, speed, spacing, false, goodToGo);

        function getScreenOffSet(width) {
            return calcScreenConst(width, 5);
        }

        function moveDigitLater(xFn, delay, dependencies, callback) {
            return self.stage.moveFreshTextLater(add(xFn, getScreenOffSet), ScoreBoard.getY, '0', ScoreBoard.getSize,
                ScoreBoard.font, ScoreBoard.color, xFn, ScoreBoard.getY, speed, spacing, delay, false, goodToGo,
                callback, dependencies);
        }

        var secondDigitWrapper, thirdDigitWrapper, fourthDigitWrapper;
        var firstDigitWrapper = moveDigitLater(ScoreBoard.getFirstX, 10, undefined, function () {
            var dependencies = [firstDigitWrapper.drawable];

            secondDigitWrapper = moveDigitLater(ScoreBoard.getSecondX.bind(undefined, firstDigitWrapper.drawable), 3,
                dependencies);
            thirdDigitWrapper = moveDigitLater(ScoreBoard.getThirdX.bind(undefined, firstDigitWrapper.drawable), 7,
                dependencies);
            fourthDigitWrapper = moveDigitLater(ScoreBoard.getFourthX.bind(undefined, firstDigitWrapper.drawable), 2,
                dependencies);
        });

        var numberOfCallbacks = 8;

        function goodToGo() {
            if (--numberOfCallbacks > 0)
                return;

            var lifeDrawablesDict = {
                1: lifeOneWrapper.drawable,
                2: lifeTwoWrapper.drawable,
                3: lifeThreeWrapper.drawable
            };
            var countDrawables = [
                fourthDigitWrapper.drawable,
                secondDigitWrapper.drawable, thirdDigitWrapper.drawable, firstDigitWrapper.drawable
            ];

            self.next(nextScene, energyBarWrapper.drawable, lifeDrawablesDict, countDrawables);
        }
    };

    StartingPosition.prototype.next = function (nextScene, energyBarDrawable, lifeDrawablesDict, countDrawables) {
        this.sceneStorage.energyBar = energyBarDrawable;
        this.sceneStorage.lives = lifeDrawablesDict;
        this.sceneStorage.counts = countDrawables;

        nextScene();
    };

    return StartingPosition;
})(Transition, calcScreenConst, Height, drawSharedGameStuff, add, Font, ScoreBoard, EnergyBar);
