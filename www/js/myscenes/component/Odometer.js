var Odometer = (function (Math) {
    "use strict";

    function Odometer(view) {
        this.view = view;

        this.totalScore = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }

    Odometer.prototype.reset = function () {
        this.view.reset();
    };

    Odometer.prototype.addScore = function (score) {
        var self = this;
        var scoreString = score.toString();

        var digitPosition = 0, overflow = 0;

        for (var i = scoreString.length - 1; i > -1; i--) {
            addDigit(parseInt(scoreString[i], 10));
        }
        while (overflow > 0) {
            addDigit(0);
        }

        function addDigit(intToAdd) {
            var currentDigit = self.totalScore[digitPosition];
            var tmpAmount = currentDigit + intToAdd + overflow;
            overflow = Math.floor(tmpAmount / 10);
            var newDigit = tmpAmount % 10;

            var delta = tmpAmount - currentDigit;


            for (var step = 0; step < delta; step++) {

                if ((currentDigit + step) % 10 === newDigit) {
                    break;
                }

                var oldValue = (currentDigit + step) % 10;
                var newValue = (currentDigit + 1 + step) % 10;
                self.view.animateTransition(digitPosition, oldValue, newValue);
            }

            self.totalScore[digitPosition] = newDigit;

            digitPosition++;
        }
    };

    return Odometer;
})(Math);
