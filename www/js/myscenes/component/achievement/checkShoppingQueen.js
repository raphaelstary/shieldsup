var checkShoppingQueen = (function (localStorage, loadBoolean, loadInteger) {
    "use strict";
    var GAME_KEY = 'shields_up-';
    var SHOPPING_QUEEN = GAME_KEY + 'achievement_shopping_queen';
    var ENERGY = GAME_KEY + 'shop_energy';
    var LIFE = GAME_KEY + 'shop_life';
    var LUCK = GAME_KEY + 'shop_luck';
    var TXT_SHOPPING_QUEEN = 'shopping_queen';

    function checkShoppingQueen(gameState) {
        if (loadBoolean(SHOPPING_QUEEN))
            return;

        if (loadInteger(ENERGY) >= 3 && loadInteger(LIFE) >= 3 && loadInteger(LUCK) >= 3) {
            localStorage.setItem(SHOPPING_QUEEN, 'true');
            gameState.completedAchievements.push(TXT_SHOPPING_QUEEN);
        }
    }

    return checkShoppingQueen;
})(lclStorage, loadBoolean, loadInteger);