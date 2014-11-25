var PostGame = (function (localStorage, Transition, heightFifth, heightThird, heightHalf, widthHalf, add, height,
    heightThreeQuarter, fontSize_30, subtract, fontSize_15) {
    "use strict";

    function PostGame(services) {
        this.stage = services.stage;
        this.sceneStorage = services.sceneStorage;
        this.tap = services.tap;
        this.resize = services.resize;
        this.sounds = services.sounds;
        this.messages = services.messages;
        this.buttons = services.buttons;
    }

    var GAME_OVER = 'game_over';
    var SCORE = 'score';
    var BEST = 'best';
    var ALL_TIME_HIGH_SCORE = 'allTimeHighScore';
    var KEY = 'post_game';
    var PLAY_AGAIN = 'play_again';
    var FONT = 'GameFont';
    var SPECIAL_FONT = 'SpecialGameFont';
    var WHITE = '#fff';
    var DARK_GRAY = '#A9A9A9';

    PostGame.prototype.show = function (nextScene) {
        var points = this.sceneStorage.points || 0;
        delete this.sceneStorage.points;

        var self = this;

        var gameOverWrapper = self.stage.moveFreshText(widthHalf, subtract(heightFifth, height),
            self.messages.get(KEY, GAME_OVER), fontSize_15, FONT, DARK_GRAY, widthHalf, heightFifth, 60,
            Transition.EASE_OUT_ELASTIC, false, function () {

                function moveIn(text, yFn, delay, callback) {
                    return self.stage.moveFreshTextLater(widthHalf, subtract(yFn, height), text, fontSize_30,
                        SPECIAL_FONT, WHITE, widthHalf, yFn, 60, Transition.EASE_OUT_BOUNCE, delay, false, callback);
                }

                function getNewScoreY(height) {
                    return heightThird(height) + fontSize_30(0, height) * 2;
                }

                function getHighScoreY(height) {
                    return heightHalf(height) + fontSize_30(0, height) * 2;
                }

                var allTimeHighScore = localStorage.getItem(ALL_TIME_HIGH_SCORE);
                if (allTimeHighScore == null)
                    allTimeHighScore = '0';

                var scoreWrapper = moveIn(self.messages.get(KEY, SCORE), heightThird, 1);
                var scoreDigitsWrapper = moveIn(points.toString(), getNewScoreY, 5);
                var bestWrapper = moveIn(self.messages.get(KEY, BEST), heightHalf, 10);
                var highScoreWrapper = moveIn(allTimeHighScore, getHighScoreY, 15, function () {

                    var playButton = self.buttons.createPrimaryButton(widthHalf, heightThreeQuarter,
                        self.messages.get(KEY, PLAY_AGAIN), function () {

                            function moveOut(drawable, yFn, delay, callback) {
                                self.stage.moveLater(drawable, widthHalf, add(yFn, height), 30, Transition.EASE_IN_EXPO,
                                    false, function () {
                                        self.stage.remove(drawable);
                                    }, undefined, delay, callback);
                            }

                            moveOut(highScoreWrapper.drawable, getHighScoreY, 5, function () {
                                self.buttons.remove(playButton);
                            });
                            moveOut(bestWrapper.drawable, heightHalf, 10);
                            moveOut(scoreDigitsWrapper.drawable, getNewScoreY, 15);
                            moveOut(scoreWrapper.drawable, heightThird, 20);
                            moveOut(gameOverWrapper.drawable, heightFifth, 25, function () {
                                if (points > parseInt(allTimeHighScore, 10))
                                    localStorage.setItem(ALL_TIME_HIGH_SCORE, points);

                                nextScene();
                            });
                        });
                });
            });
    };

    return PostGame;
})(window.localStorage, Transition, heightFifth, heightThird, heightHalf, widthHalf, add, height, heightThreeQuarter,
    fontSize_30, subtract, fontSize_15);
