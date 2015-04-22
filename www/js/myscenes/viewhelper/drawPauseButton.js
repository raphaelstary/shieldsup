var drawPauseButton = (function (Math, Width, Height, Font) {
    "use strict";

    function drawPauseButton(buttons, callback) {
        // simple pause button
        function getWidth(width, height) {
            return Math.floor(Font._30(width, height) * 2);
        }

        function getHeight(height, width) {
            return Math.floor(Font._30(width, height) * 2);
        }

        var pauseButton = buttons.createPrimaryButton(Width.get(10), Height.TOP_RASTER, ' = ', callback, 3, false,
            getWidth, getHeight);
        pauseButton.text.rotation = Math.PI / 2;
        pauseButton.text.scale = 1.2;

        return pauseButton;
    }

    return drawPauseButton;
})(Math, Width, Height, Font);