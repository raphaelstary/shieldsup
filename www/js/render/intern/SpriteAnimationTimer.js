var SpriteAnimationTimer = (function () {
    "use strict";

    function SpriteAnimationTimer(spriteAnimations) {
        this.spriteAnimations = spriteAnimations;
        this.todos = [];
    }

    SpriteAnimationTimer.prototype.update = function () {
        for (var i = this.todos.length - 1; i >= 0; i--) {
            var toAdd = this.todos[i];

            if (toAdd.duration < toAdd.time) {

                this.spriteAnimations.animate(toAdd.addable.item, toAdd.addable.sprite, toAdd.addable.ready);

                if (toAdd.ready) {
                    toAdd.ready();
                }

                this.todos.splice(i, 1);

            } else {
                toAdd.time++;
            }
        }
    };

    SpriteAnimationTimer.prototype.animateLater = function (drawableToAdd, duration, callback) {
        this.todos.push({
            addable: drawableToAdd,
            duration: duration,
            time: 0,
            ready: callback
        });
    };

    return SpriteAnimationTimer;
})();