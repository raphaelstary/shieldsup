var PostGame = (function (localStorage, Transition, Height, Width, add, Font, subtract) {
    "use strict";

    function PostGame(services) {
        this.stage = services.stage;
        this.sceneStorage = services.sceneStorage;
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

        var gameOverWrapper = self.stage.moveFreshText(Width.HALF, subtract(Height.FIFTH, Height.FULL),
            self.messages.get(KEY, GAME_OVER), Font._15, FONT, DARK_GRAY, Width.HALF, Height.FIFTH, 60,
            Transition.EASE_OUT_ELASTIC, false, function () {

                function moveIn(text, yFn, delay, callback) {
                    return self.stage.moveFreshTextLater(Width.HALF, subtract(yFn, Height.FULL), text, Font._30,
                        SPECIAL_FONT, WHITE, Width.HALF, yFn, 60, Transition.EASE_OUT_BOUNCE, delay, false, callback);
                }

                function getNewScoreY(height) {
                    return Height.THIRD(height) + Font._30(0, height) * 2;
                }

                function getHighScoreY(height) {
                    return Height.HALF(height) + Font._30(0, height) * 2;
                }

                var allTimeHighScore = localStorage.getItem(ALL_TIME_HIGH_SCORE);
                if (allTimeHighScore == null)
                    allTimeHighScore = '0';

                var scoreWrapper = moveIn(self.messages.get(KEY, SCORE), Height.THIRD, 1);
                var scoreDigitsWrapper = moveIn(points.toString(), getNewScoreY, 5);
                var bestWrapper = moveIn(self.messages.get(KEY, BEST), Height.HALF, 10);
                var highScoreWrapper = moveIn(allTimeHighScore, getHighScoreY, 15, function () {

                    var playButton = self.buttons.createPrimaryButton(Width.HALF, Height.THREE_QUARTER,
                        self.messages.get(KEY, PLAY_AGAIN), function () {

                            function moveOut(drawable, yFn, delay, callback) {
                                self.stage.moveLater(drawable, Width.HALF, add(yFn, Height.FULL), 30,
                                    Transition.EASE_IN_EXPO,
                                    false, function () {
                                        self.stage.remove(drawable);
                                    }, undefined, delay, callback);
                            }

                            moveOut(highScoreWrapper.drawable, getHighScoreY, 5, function () {
                                self.buttons.remove(playButton);
                            });
                            moveOut(bestWrapper.drawable, Height.HALF, 10);
                            moveOut(scoreDigitsWrapper.drawable, getNewScoreY, 15);
                            moveOut(scoreWrapper.drawable, Height.THIRD, 20);
                            moveOut(gameOverWrapper.drawable, Height.FIFTH, 25, function () {
                                if (points > parseInt(allTimeHighScore, 10))
                                    localStorage.setItem(ALL_TIME_HIGH_SCORE, points);

                                self.events.unsubscribe(stop);
                                self.events.unsubscribe(resume);
                                nextScene();
                            });
                        });
                });
            });

        var stop = self.events.subscribe('stop', function () {
            self.stage.pauseAll();
            self.buttons.disableAll();
        });
        var resume = self.events.subscribe('resume', function () {
            self.stage.playAll();
            self.buttons.enableAll();
        });
    };

    return PostGame;
})(window.localStorage, Transition, Height, Width, add, Font, subtract);
