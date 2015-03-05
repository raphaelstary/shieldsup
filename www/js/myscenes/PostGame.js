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

var PostGame = (function (localStorage, Transition, Height, Width, add, Font, subtract, showMenu) {
    "use strict";

    function PostGame(services) {
        this.stage = services.stage;
        this.sceneStorage = services.sceneStorage;
        this.sounds = services.sounds;
        this.messages = services.messages;
        this.buttons = services.buttons;
        this.events = services.events;
        this.device = services.device;
    }

    var BEST = 'best';
    var ALL_TIME_HIGH_SCORE_STARS = 'all_time_high_score_distance_stars';
    var ALL_TIME_HIGH_SCORE_DISTANCE = 'all_time_high_score_distance';
    var KEY = 'post_game';
    var FONT = 'GameFont';
    var SPECIAL_FONT = 'SpecialGameFont';
    var WHITE = '#fff';

    var BUTTON_KEY = 'common_buttons';
    var SETTINGS = 'settings';
    var ACHIEVEMENTS = 'achievements';
    var MORE_GAMES = 'more_games';

    PostGame.prototype.show = function (nextScene) {
        var points = this.sceneStorage.points || 0;
        delete this.sceneStorage.points;
        var distance = this.sceneStorage.distanceValue || 0;
        delete this.sceneStorage.distanceValue;

        var self = this;
        var thunder = self.sounds.play('thunder_roll');
        var speed = 60;
        if (this.sceneStorage.do30fps)
            speed /= 2;

        var quest_count_txt = self.stage.moveFreshText(Width.THREE_QUARTER, subtract(Height.get(48, 5), Height.FULL),
            '2 / 40 ' + self.messages.get('pause_menu', 'complete'), Font._60, FONT, WHITE, Width.THREE_QUARTER,
            Height.get(48, 5), speed, Transition.EASE_OUT_ELASTIC, false, function () {

                function moveIn(text, xFn, yFn, delay, callback) {
                    return self.stage.moveFreshTextLater(xFn, subtract(yFn, Height.FULL), text, Font._30, SPECIAL_FONT,
                        WHITE, xFn, yFn, speed, Transition.EASE_OUT_BOUNCE, delay, false, callback);
                }

                function getNewScoreY(height) {
                    return Height.THIRD(height) + Font._30(0, height) * 2;
                }

                function getHighScoreY(height) {
                    return Height.HALF(height) + Font._30(0, height) * 2;
                }

                var allTimeHighScore_stars = localStorage.getItem(ALL_TIME_HIGH_SCORE_STARS);
                if (allTimeHighScore_stars == null)
                    allTimeHighScore_stars = '0';

                var allTimeHighScore_distance = localStorage.getItem(ALL_TIME_HIGH_SCORE_DISTANCE);
                if (allTimeHighScore_distance == null)
                    allTimeHighScore_distance = '0';

                var totalStars = localStorage.getItem(ALL_TIME_HIGH_SCORE_DISTANCE);
                if (totalStars == null)
                    totalStars = '0';

                var quests_header = moveIn(self.messages.get('pause_menu', 'missions'), Width.THIRD, Height.get(48, 5),
                    1, function () {
                        self.messages.add(quests_header.drawable, quests_header.drawable.data, 'pause_menu',
                            'missions');
                    });

                var totalStarsWrapper = moveIn(self.messages.get(KEY, 'total_stars'), Width.HALF, Height.get(48, 9), 7,
                    function () {
                        self.messages.add(totalStarsWrapper.drawable, totalStarsWrapper.drawable.data, KEY,
                            'total_stars');
                    });
                var totalStarsDigitWrapper = moveIn(totalStars, Width.HALF, Height.get(48, 12), 9);

                var leftColFn = Width.get(16, 4);
                var rightColFn = Width.get(16, 12);
                var goldScoreWrapper = moveIn(self.messages.get(KEY, 'stars'), leftColFn, Height.THIRD, 10,
                    function () {
                        self.messages.add(goldScoreWrapper.drawable, goldScoreWrapper.drawable.data, KEY, 'stars');
                    });
                var goldScoreDigitsWrapper = moveIn(points.toString(), leftColFn, getNewScoreY, 15);
                var goldBestWrapper = moveIn(self.messages.get(KEY, BEST), leftColFn, Height.HALF, 20, function () {
                    self.messages.add(goldBestWrapper.drawable, goldBestWrapper.drawable.data, KEY, BEST);
                });
                var goldHighScoreWrapper = moveIn(allTimeHighScore_stars, leftColFn, getHighScoreY, 25);

                var distanceScoreWrapper = moveIn(self.messages.get(KEY, 'distance'), rightColFn, Height.THIRD, 27,
                    function () {
                        self.messages.add(distanceScoreWrapper.drawable, distanceScoreWrapper.drawable.data, KEY,
                            'distance');
                    });
                var distanceScoreDigitsWrapper = moveIn(distance.toString() + ' m', rightColFn, getNewScoreY, 30);
                var distanceBestWrapper = moveIn(self.messages.get(KEY, BEST), rightColFn, Height.HALF, 32,
                    function () {
                        self.messages.add(distanceBestWrapper.drawable, distanceBestWrapper.drawable.data, KEY, BEST);
                    });
                var distanceHighScoreWrapper = moveIn(allTimeHighScore_distance + ' m', rightColFn, getHighScoreY, 35,
                    showButtons);

                var playButton, achievementsButton, settingsButton, moreGamesButton;

                function showButtons() {

                    function goToSettings() {
                        self.sceneStorage.menuScene = 'settings';
                        showSettingsScreen();
                    }

                    function goToAchievements() {
                        self.sceneStorage.menuScene = 'achievements';
                        showSettingsScreen();
                    }

                    function showSettingsScreen() {
                        self.events.fireSync(Event.PAUSE);
                        showMenu(self.stage, self.buttons, self.messages, self.events, self.sceneStorage, self.device,
                            self.sounds, hideSettings)
                    }

                    function hideSettings() {
                        settingsButton.used = false;
                        achievementsButton.used = false;
                    }

                    function getButtonWidth(width, height) {
                        if (width < height) {
                            return Width.HALF(width);
                        }
                        return Width.QUARTER(width);
                    }

                    function showMoreGames() {
                        window.location.href = window.moreGamesLink;
                    }

                    playButton = self.buttons.createPrimaryButton(Width.HALF, Height.get(480, 345),
                        self.messages.get(BUTTON_KEY, 'resume'), goToResume, 3, false, getButtonWidth);
                    self.messages.add(playButton.text, playButton.text.data, BUTTON_KEY, 'resume');

                    achievementsButton = self.buttons.createSecondaryButton(Width.HALF, Height.get(480, 385),
                        self.messages.get(BUTTON_KEY, ACHIEVEMENTS), goToAchievements, 3, false, getButtonWidth);
                    self.messages.add(achievementsButton.text, achievementsButton.text.data, BUTTON_KEY, ACHIEVEMENTS);

                    settingsButton = self.buttons.createSecondaryButton(Width.HALF, Height.get(480, 420),
                        self.messages.get(BUTTON_KEY, SETTINGS), goToSettings, 3, false, getButtonWidth);
                    self.messages.add(settingsButton.text, settingsButton.text.data, BUTTON_KEY, SETTINGS);

                    moreGamesButton = self.buttons.createSecondaryButton(Width.HALF, Height.get(480, 455),
                        self.messages.get(BUTTON_KEY, MORE_GAMES), showMoreGames, 3, false, getButtonWidth);
                    self.messages.add(moreGamesButton.text, moreGamesButton.text.data, BUTTON_KEY, MORE_GAMES);
                }

                function goToResume() {
                    var outSpeed = 30;
                    if (self.sceneStorage.do30fps)
                        outSpeed /= 2;
                    function moveOut(drawable, xFn, yFn, delay, callback) {
                        self.stage.moveLater(drawable, xFn, add(yFn, Height.FULL), outSpeed, Transition.EASE_IN_EXPO,
                            false, function () {
                                self.stage.remove(drawable);
                            }, undefined, delay, callback);
                    }

                    var itIsOver = false;
                    moveOut(quest_count_txt.drawable, Width.THREE_QUARTER, Height.get(48, 5), 35, function () {
                        if (itIsOver)
                            return;
                        itIsOver = true;

                        if (points > parseInt(allTimeHighScore_stars, 10))
                            localStorage.setItem(ALL_TIME_HIGH_SCORE_STARS, points);

                        self.sounds.stop(thunder);
                        self.sounds.play('door_air_lock_closing');
                        //self.sounds.stop(coins);
                        nextScene();
                    });
                    moveOut(quests_header.drawable, Width.THIRD, Height.get(48, 5), 33);

                    moveOut(totalStarsWrapper.drawable, Width.HALF, Height.get(48, 9), 30);
                    moveOut(totalStarsDigitWrapper.drawable, Width.HALF, Height.get(48, 12), 25);

                    moveOut(distanceScoreWrapper.drawable, rightColFn, Height.THIRD, 18);
                    moveOut(distanceScoreDigitsWrapper.drawable, rightColFn, getNewScoreY, 12);
                    moveOut(distanceBestWrapper.drawable, rightColFn, Height.HALF, 7);
                    moveOut(distanceHighScoreWrapper.drawable, rightColFn, getHighScoreY, 3);

                    moveOut(goldHighScoreWrapper.drawable, leftColFn, getHighScoreY, 5, function () {
                        self.buttons.remove(playButton);
                        self.buttons.remove(achievementsButton);
                        self.buttons.remove(settingsButton);
                        self.buttons.remove(moreGamesButton);
                    });
                    moveOut(goldBestWrapper.drawable, leftColFn, Height.HALF, 10);
                    moveOut(goldScoreDigitsWrapper.drawable, leftColFn, getNewScoreY, 15);
                    moveOut(goldScoreWrapper.drawable, leftColFn, Height.THIRD, 20);
                }
            });
    };

    return PostGame;
})(lclStorage, Transition, Height, Width, add, Font, subtract, showMenu);