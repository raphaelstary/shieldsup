var StartingPosition = (function (Transition, calcScreenConst, CountHelper, getTopRaster, Repository, changeCoords,
    changePath, drawSharedGameStuff, EnergyBarHelper, LifeHelper, add, fontSize_30) {
    "use strict";

    function StartingPosition(services) {
        this.stage = services.stage;
        this.sceneStorage = services.sceneStorage;
    }

    var PLAYER_LIFE = 'player_life';
    var ENERGY_FULL = 'energy_full';
    var GAME_FONT = 'GameFont';
    var DARK_GRAY = '#A9A9A9';

    StartingPosition.prototype.show = function (nextScene) {
        //drawSharedGameStuff(this.stage, this.sceneStorage); // todo: missing width & height

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

        function yBottom(height) {
            return getTopRaster(height) * 19;
        }

        function moveLifeLater(xFn, delay) {
            return self.stage.moveFreshLater(lifeStartX, getTopRaster, PLAYER_LIFE, xFn, getTopRaster, speed, spacing,
                delay, false, goodToGo);
        }

        var lifeOneWrapper = moveLifeLater(lifeX, 20);

        function lifeTwoEndX(width) {
            return lifeX(width) + self.stage.getGraphic(PLAYER_LIFE).width;
        }

        var lifeTwoWrapper = moveLifeLater(lifeTwoEndX, 15);

        function lifeThreeEndX(width) {
            return lifeX(width) + self.stage.getGraphic(PLAYER_LIFE).width * 2;
        }

        var lifeThreeWrapper = moveLifeLater(lifeThreeEndX, 10);

        function energyX(width) {
            return calcScreenConst(width, 32, 7);
        }

        function energyStartX(width) {
            var x = energyX(width);
            return x - x * 2;
        }

        var energyBarWrapper = self.stage.moveFresh(energyStartX, yBottom, ENERGY_FULL, energyX, yBottom, speed,
            spacing, false, goodToGo);

        function getScreenOffSet(width) {
            return calcScreenConst(width, 5);
        }

        function moveDigitLater(xFn, delay, dependencies, callback) {
            return self.stage.moveFreshTextLater(add(xFn, getScreenOffSet), getTopRaster, '0', fontSize_30, GAME_FONT,
                DARK_GRAY, xFn, getTopRaster, speed, spacing, delay, false, goodToGo, callback, dependencies);
        }

        function getFourthX(width) {
            return calcScreenConst(width, 5, 4);
        }

        var firstDigitWrapper, secondDigitWrapper, thirdDigitWrapper;
        var fourthDigitWrapper = moveDigitLater(getFourthX, 10, undefined, function () {
            function getDigitOffSet() {
                return calcScreenConst(fourthDigitWrapper.drawable.getWidth(), 3, 4);
            }

            function getFirstX(width) {
                return getFourthX(width) + getDigitOffSet() * 3;
            }

            function getSecondX(width) {
                return getFourthX(width) + getDigitOffSet() * 2;
            }

            function getThirdX(width) {
                return getFourthX(width) + getDigitOffSet();
            }

            var dependencies = [fourthDigitWrapper.drawable];
            firstDigitWrapper = moveDigitLater(getFirstX, 2, dependencies);
            secondDigitWrapper = moveDigitLater(getSecondX, 3, dependencies);
            thirdDigitWrapper = moveDigitLater(getThirdX, 7, dependencies);
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
                firstDigitWrapper.drawable,
                secondDigitWrapper.drawable,
                thirdDigitWrapper.drawable,
                fourthDigitWrapper.drawable
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
})(Transition, calcScreenConst, CountHelper, getTopRaster, Repository, changeCoords, changePath, drawSharedGameStuff,
    EnergyBarHelper, LifeHelper, add, fontSize_30);
