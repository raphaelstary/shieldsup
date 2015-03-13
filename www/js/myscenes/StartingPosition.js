var StartingPosition = (function (Transition, calcScreenConst, Height, drawSharedGameStuff, add, Font, ScoreBoard,
    EnergyBar, loadInteger, Math) {
    "use strict";

    function StartingPosition(services) {
        this.stage = services.stage;
        this.sceneStorage = services.sceneStorage;
    }

    var PLAYER_LIFE = 'player_life';
    var ENERGY_FULL = 'energy_full';
    var GAME_KEY = 'shields_up-';
    var SHOP_LIFE = GAME_KEY + 'shop_life';

    StartingPosition.prototype.show = function (nextScene) {
        drawSharedGameStuff(this.stage, this.sceneStorage, this.sceneStorage.do30fps);

        var self = this;
        var spacing = Transition.EASE_IN_OUT_ELASTIC;
        var speed = 60;
        if (this.sceneStorage.do30fps)
            speed /= 2;

        var scaleFactor = 0.7;

        function lifeX(width) {
            return calcScreenConst(width, 10, 9);
        }

        function lifeStartX(width) {
            var x = lifeX(width);
            return x + x * 2;
        }

        function lifeTwoEndX(width) {
            return lifeX(width) - Math.floor(self.stage.getImageWidth(PLAYER_LIFE) * scaleFactor);
        }

        function lifeThreeEndX(width) {
            return lifeX(width) - Math.floor(self.stage.getImageWidth(PLAYER_LIFE) * scaleFactor * 2);
        }

        function lifeFourEndX(width) {
            return lifeX(width) - Math.floor(self.stage.getImageWidth(PLAYER_LIFE) * scaleFactor * 3);
        }

        var numberOfCallbacks = 0;

        function moveLifeLater(xFn, delay) {
            numberOfCallbacks++;
            var yFn = Height.get(48, 5);
            return self.stage.moveFreshLater(lifeStartX, yFn, PLAYER_LIFE, xFn, yFn, speed, spacing, delay, false,
                goodToGo, undefined, undefined, undefined, undefined, undefined, scaleFactor);
        }

        var lifeWrapperDict = {};
        //noinspection FallThroughInSwitchStatementJS
        switch (loadInteger(SHOP_LIFE)) {
            case 3:
                lifeWrapperDict[4] = moveLifeLater(lifeFourEndX, 5);
            case 2:
                lifeWrapperDict[3] = moveLifeLater(lifeThreeEndX, 10);
            case 1:
                lifeWrapperDict[2] = moveLifeLater(lifeTwoEndX, 15);
            case 0:
                lifeWrapperDict[1] = moveLifeLater(lifeX, 20);
        }

        function energyStartX(width) {
            var x = EnergyBar.getX(width);
            return x - x * 2;
        }

        numberOfCallbacks++;
        var energyBarWrapper = self.stage.moveFresh(energyStartX, EnergyBar.getY, ENERGY_FULL, EnergyBar.getX,
            EnergyBar.getY, speed, spacing, false, goodToGo);

        numberOfCallbacks++;
        var distanceMeterWrapper = self.stage.moveFreshTextLater(changeSign(Width.HALF), Height.TOP_RASTER, '0 m',
            Font._35, 'GameFont', '#fff', Width.HALF, Height.TOP_RASTER, speed, spacing, 10, false, goodToGo, undefined,
            undefined, undefined, 0.5);

        function getScreenOffSet(width) {
            return calcScreenConst(width, 5);
        }

        function moveDigitLater(xFn, delay, dependencies, callback) {
            numberOfCallbacks++;
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

        function goodToGo() {
            if (--numberOfCallbacks > 0)
                return;

            var countDrawables = [
                firstDigitWrapper.drawable,
                secondDigitWrapper.drawable,
                thirdDigitWrapper.drawable,
                fourthDigitWrapper.drawable
            ];

            var lifeDrawablesDict = {};
            if (lifeWrapperDict[1])
                lifeDrawablesDict[1] = lifeWrapperDict[1].drawable;
            if (lifeWrapperDict[2])
                lifeDrawablesDict[2] = lifeWrapperDict[2].drawable;
            if (lifeWrapperDict[3])
                lifeDrawablesDict[3] = lifeWrapperDict[3].drawable;
            if (lifeWrapperDict[4])
                lifeDrawablesDict[4] = lifeWrapperDict[4].drawable;

            self.next(nextScene, energyBarWrapper.drawable, lifeDrawablesDict, countDrawables,
                distanceMeterWrapper.drawable);
        }
    };

    StartingPosition.prototype.next = function (nextScene, energyBarDrawable, lifeDrawablesDict, countDrawables,
        distanceDrawable) {

        this.sceneStorage.energyBar = energyBarDrawable;
        this.sceneStorage.lives = lifeDrawablesDict;
        this.sceneStorage.counts = countDrawables;
        this.sceneStorage.distance = distanceDrawable;

        nextScene();
    };

    return StartingPosition;
})(Transition, calcScreenConst, Height, drawSharedGameStuff, add, Font, ScoreBoard, EnergyBar, loadInteger, Math);