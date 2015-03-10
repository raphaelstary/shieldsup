var PostGame = (function (localStorage, Transition, Height, Width, add, Font, subtract, showMenu, parseInt,
    checkAchievements, Math, loadInteger) {
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

    var GAME_KEY = 'shields_up-';
    var STORAGE_BEST_STARS = GAME_KEY + 'best_stars';
    var STORAGE_BEST_DISTANCE = GAME_KEY + 'best_distance';
    var STORAGE_TOTAL_STARS = GAME_KEY + 'total_stars';
    var STORAGE_MISSIONS_COMPLETE = GAME_KEY + 'mission_complete_count';

    var STARS = 'stars';
    var DISTANCE = 'distance';
    var MENU_SETTINGS = 'settings';
    var MENU_ACHIEVEMENTS = 'achievements';
    var TOTAL_STARS = 'total_stars';
    var MISSIONS = 'missions';
    var PAUSE_KEY = 'pause_menu';
    var COMPLETE = 'complete';
    var BEST = 'best';
    var NEW_RECORD = 'new_record';
    var KEY = 'post_game';
    var FONT = 'GameFont';
    var SPECIAL_FONT = 'SpecialGameFont';
    var WHITE = '#fff';
    var GOLD = '#ffd700';
    var LIGHT_GREY = '#c4c4c4';

    var BUTTON_KEY = 'common_buttons';
    var RESUME = 'resume';
    var SETTINGS = 'settings';
    var ACHIEVEMENTS = 'achievements';
    var MORE_GAMES = 'more_games';

    var DOOR_AIR_LOCK_CLOSING = 'door_air_lock_closing';
    var THUNDER_ROLL = 'thunder_roll';

    PostGame.prototype.show = function (nextScene) {
        var gameStats = this.sceneStorage.gameStats;
        var points = gameStats.points;
        delete this.sceneStorage.gameStats;
        var distance = gameStats.timePlayed;

        var self = this;
        var thunder = self.sounds.play(THUNDER_ROLL);
        var speed = 60;
        if (this.sceneStorage.do30fps)
            speed /= 2;

        var quest_count_txt = self.stage.moveFreshText(Width.THREE_QUARTER, subtract(Height.get(48, 5), Height.FULL),
            loadInteger(STORAGE_MISSIONS_COMPLETE) + ' / 40 ' + self.messages.get(PAUSE_KEY, COMPLETE), Font._60, FONT,
            WHITE, Width.THREE_QUARTER, Height.get(48, 5), speed, Transition.EASE_OUT_ELASTIC, false, function () {

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

                var bestStarsValue = localStorage.getItem(STORAGE_BEST_STARS);
                if (bestStarsValue == null)
                    bestStarsValue = '0';

                var bestDistanceValue = localStorage.getItem(STORAGE_BEST_DISTANCE);
                if (bestDistanceValue == null)
                    bestDistanceValue = '0';

                var newStarsRecord = points > parseInt(bestStarsValue);
                var newDistanceRecord = distance > parseInt(bestDistanceValue);

                if (newStarsRecord)
                    localStorage.setItem(STORAGE_BEST_STARS, points);

                if (newDistanceRecord)
                    localStorage.setItem(STORAGE_BEST_DISTANCE, distance);

                var totalStarsValue = localStorage.getItem(STORAGE_TOTAL_STARS);
                if (totalStarsValue == null)
                    totalStarsValue = '0';

                localStorage.setItem(STORAGE_TOTAL_STARS, parseInt(totalStarsValue) + points);
                totalStarsValue = localStorage.getItem(STORAGE_TOTAL_STARS);

                var quests_header = moveIn(self.messages.get(PAUSE_KEY, MISSIONS), Width.THIRD, Height.get(48, 5), 1,
                    function () {
                        self.messages.add(quests_header.drawable, quests_header.drawable.data, PAUSE_KEY, MISSIONS);
                    });

                var totalStarsWrapper = moveIn(self.messages.get(KEY, TOTAL_STARS), Width.HALF, Height.get(48, 9), 7,
                    function () {
                        self.messages.add(totalStarsWrapper.drawable, totalStarsWrapper.drawable.data, KEY,
                            TOTAL_STARS);
                    });
                var totalStarsDigitWrapper = moveIn(totalStarsValue, Width.HALF, Height.get(48, 12), 9);

                var leftColFn = Width.get(16, 4);
                var rightColFn = Width.get(16, 12);
                var goldScoreWrapper = moveIn(self.messages.get(KEY, STARS), leftColFn, Height.THIRD, 10, function () {
                    self.messages.add(goldScoreWrapper.drawable, goldScoreWrapper.drawable.data, KEY, STARS);
                });
                var goldScoreDigitsWrapper = moveIn(points.toString(), leftColFn, getNewScoreY, 15);
                var goldBestWrapper = moveIn(self.messages.get(KEY, BEST), leftColFn, Height.HALF, 20, function () {
                    self.messages.add(goldBestWrapper.drawable, goldBestWrapper.drawable.data, KEY, BEST);
                });
                var goldHighScoreWrapper = moveIn(bestStarsValue, leftColFn, getHighScoreY, 25);

                var distanceScoreWrapper = moveIn(self.messages.get(KEY, DISTANCE), rightColFn, Height.THIRD, 27,
                    function () {
                        self.messages.add(distanceScoreWrapper.drawable, distanceScoreWrapper.drawable.data, KEY,
                            DISTANCE);
                    });
                var distanceScoreDigitsWrapper = moveIn(distance.toString() + ' m', rightColFn, getNewScoreY, 30);
                var distanceBestWrapper = moveIn(self.messages.get(KEY, BEST), rightColFn, Height.HALF, 32,
                    function () {
                        self.messages.add(distanceBestWrapper.drawable, distanceBestWrapper.drawable.data, KEY, BEST);
                    });
                var distanceHighScoreWrapper = moveIn(bestDistanceValue + ' m', rightColFn, getHighScoreY, 35,
                    showButtons);

                var playButton, achievementsButton, settingsButton, moreGamesButton, newDistance, newDistanceHighlight, newStars, newStarsHighlight, newAchievement, newAchievementHighlight;

                function showButtons() {
                    function getNewStarsX() {
                        return goldScoreDigitsWrapper.drawable.getCornerX() -
                            goldScoreDigitsWrapper.drawable.getWidth();
                    }

                    function getNewDistanceX() {
                        return distanceScoreDigitsWrapper.drawable.getCornerX() -
                            distanceScoreDigitsWrapper.drawable.getWidthHalf();
                    }

                    if (newDistanceRecord) {
                        newDistance = self.stage.drawText(getNewDistanceX, getNewScoreY,
                            self.messages.get(KEY, NEW_RECORD), Font._30, SPECIAL_FONT, GOLD, 3,
                            [distanceScoreDigitsWrapper]);
                        newDistanceHighlight = self.stage.drawText(getNewDistanceX, getNewScoreY,
                            self.messages.get(KEY, NEW_RECORD), Font._30, SPECIAL_FONT, WHITE, 4,
                            [distanceScoreDigitsWrapper]);
                        self.stage.animateAlphaPattern(newDistanceHighlight, [
                            {
                                value: 1,
                                duration: 30,
                                easing: Transition.LINEAR
                            }, {
                                value: 0,
                                duration: 30,
                                easing: Transition.LINEAR
                            }
                        ], true);
                        self.messages.add(newDistance, newDistance.data, KEY, NEW_RECORD);
                        self.messages.add(newDistanceHighlight, newDistanceHighlight.data, KEY, NEW_RECORD);
                    }

                    if (newStarsRecord) {
                        newStars = self.stage.drawText(getNewStarsX, getNewScoreY, self.messages.get(KEY, NEW_RECORD),
                            Font._30, SPECIAL_FONT, GOLD, 3, [goldScoreDigitsWrapper]);
                        newStarsHighlight = self.stage.drawText(getNewStarsX, getNewScoreY,
                            self.messages.get(KEY, NEW_RECORD), Font._30, SPECIAL_FONT, WHITE, 4,
                            [goldScoreDigitsWrapper]);
                        self.stage.animateAlphaPattern(newStarsHighlight, [
                            {
                                value: 1,
                                duration: 30,
                                easing: Transition.LINEAR
                            }, {
                                value: 0,
                                duration: 30,
                                easing: Transition.LINEAR
                            }
                        ], true);
                        self.messages.add(newStars, newStars.data, KEY, NEW_RECORD);
                        self.messages.add(newStarsHighlight, newStarsHighlight.data, KEY, NEW_RECORD);
                    }

                    function goToSettings() {
                        self.sceneStorage.menuScene = MENU_SETTINGS;
                        showSettingsScreen();
                    }

                    function goToAchievements() {
                        self.sceneStorage.menuScene = MENU_ACHIEVEMENTS;
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
                        self.messages.get(BUTTON_KEY, RESUME), goToResume, 3, false, getButtonWidth);
                    self.messages.add(playButton.text, playButton.text.data, BUTTON_KEY, RESUME);

                    achievementsButton = self.buttons.createSecondaryButton(Width.HALF, Height.get(480, 385),
                        self.messages.get(BUTTON_KEY, ACHIEVEMENTS), goToAchievements, 3, false, getButtonWidth);
                    self.messages.add(achievementsButton.text, achievementsButton.text.data, BUTTON_KEY, ACHIEVEMENTS);

                    settingsButton = self.buttons.createSecondaryButton(Width.HALF, Height.get(480, 420),
                        self.messages.get(BUTTON_KEY, SETTINGS), goToSettings, 3, false, getButtonWidth);
                    self.messages.add(settingsButton.text, settingsButton.text.data, BUTTON_KEY, SETTINGS);

                    moreGamesButton = self.buttons.createSecondaryButton(Width.HALF, Height.get(480, 455),
                        self.messages.get(BUTTON_KEY, MORE_GAMES), showMoreGames, 3, false, getButtonWidth);
                    self.messages.add(moreGamesButton.text, moreGamesButton.text.data, BUTTON_KEY, MORE_GAMES);

                    function getNewAchievementX() {
                        return achievementsButton.background.getEndX();
                    }

                    function getNewAchievementY() {
                        return achievementsButton.background.y;
                    }

                    var newAchievements = checkAchievements(0, 100, 1, 2);
                    if (newAchievements.length > 0) {
                        newAchievement = self.stage.drawText(getNewAchievementX, getNewAchievementY,
                            self.messages.get(KEY, NEW_RECORD), Font._30, SPECIAL_FONT, GOLD, 3,
                            [achievementsButton.background], Math.PI / 8);
                        newAchievementHighlight = self.stage.drawText(getNewAchievementX, getNewAchievementY,
                            self.messages.get(KEY, NEW_RECORD), Font._30, SPECIAL_FONT, WHITE, 4,
                            [achievementsButton.background], Math.PI / 8);
                        self.stage.animateAlphaPattern(newAchievementHighlight, [
                            {
                                value: 1,
                                duration: 30,
                                easing: Transition.LINEAR
                            }, {
                                value: 0,
                                duration: 30,
                                easing: Transition.LINEAR
                            }
                        ], true);
                        self.messages.add(newAchievement, newAchievement.data, KEY, NEW_RECORD);
                        self.messages.add(newAchievementHighlight, newAchievementHighlight.data, KEY, NEW_RECORD);
                    }
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

                        self.sounds.stop(thunder);
                        self.sounds.play(DOOR_AIR_LOCK_CLOSING);
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
                        if (newDistance) {
                            self.stage.remove(newDistance);
                            self.stage.remove(newDistanceHighlight);
                        }
                        if (newStars) {
                            self.stage.remove(newStars);
                            self.stage.remove(newStarsHighlight);
                        }
                        if (newAchievement) {
                            self.stage.remove(newAchievement);
                            self.stage.remove(newAchievementHighlight);
                        }
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
})(lclStorage, Transition, Height, Width, add, Font, subtract, showMenu, parseInt, checkAchievements, Math,
    loadInteger);