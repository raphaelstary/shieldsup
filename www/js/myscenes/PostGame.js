var lclStorage;
try {
    lclStorage = window.localStorage;
} catch (e) {
    lclStorage = {
        dict: {},
        getItem: function (id) {
            "use strict";
            return this.dict[id];
        },
        setItem: function (id, value) {
            "use strict";
            this.dict[id] = value;
        }
    }
}

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
        var thunder = self.sounds.play('thunder_roll');
        var speed = 60;
        if (this.sceneStorage.do30fps)
            speed /= 2;
        var gameOverWrapper = self.stage.moveFreshText(Width.HALF, subtract(Height.FIFTH, Height.FULL),
            self.messages.get(KEY, GAME_OVER), Font._15, FONT, DARK_GRAY, Width.HALF, Height.FIFTH, speed,
            Transition.EASE_OUT_ELASTIC, false, function () {

                function moveIn(text, yFn, delay, callback) {
                    return self.stage.moveFreshTextLater(Width.HALF, subtract(yFn, Height.FULL), text, Font._30,
                        SPECIAL_FONT, WHITE, Width.HALF, yFn, speed, Transition.EASE_OUT_BOUNCE, delay, false,
                        callback);
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

                //var coins = self.sounds.play('coin_drop_on_wood');

                var scoreWrapper = moveIn(self.messages.get(KEY, SCORE), Height.THIRD, 1);
                var scoreDigitsWrapper = moveIn(points.toString(), getNewScoreY, 5);
                var bestWrapper = moveIn(self.messages.get(KEY, BEST), Height.HALF, 10);
                var highScoreWrapper = moveIn(allTimeHighScore, getHighScoreY, 15, function () {

                    var playButton = self.buttons.createPrimaryButton(Width.HALF, Height.THREE_QUARTER,
                        self.messages.get(KEY, PLAY_AGAIN), function () {
                            var outSpeed = 30;
                            if (self.sceneStorage.do30fps)
                                outSpeed /= 2;
                            function moveOut(drawable, yFn, delay, callback) {
                                self.stage.moveLater(drawable, Width.HALF, add(yFn, Height.FULL), outSpeed,
                                    Transition.EASE_IN_EXPO, false, function () {
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

                                self.sounds.stop(thunder);
                                self.sounds.play('door_air_lock_closing');
                                //self.sounds.stop(coins);
                                nextScene();
                            });
                        }, 3);
                });
            });
    };

    return PostGame;
})(lclStorage, Transition, Height, Width, add, Font, subtract);