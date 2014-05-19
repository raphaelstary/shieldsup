var Renderer = (function () {
    "use strict";

    function Renderer(screen, ctx, atlas) {
        this.screen = screen;
        this.ctx = ctx;

        this.atlas = atlas;

        this.screenWidth = screen.width;
        this.screenHeight = screen.height;
        this.drawableDict = {'0': {}, '1': {}, '2': {}, '3': {}};
    }

    Renderer.prototype.resize = function (width, height) {
        this.screen.width = width;
        this.screen.height = height;
        this.screenWidth = width;
        this.screenHeight = height;
    };

    Renderer.prototype.add = function (drawable) {
        this.drawableDict[drawable.zIndex][drawable.id] = drawable;
    };

    Renderer.prototype.remove = function (drawable) {
        delete this.drawableDict[drawable.zIndex][drawable.id];
    };

    Renderer.prototype.has = function (drawable) {
        return this.drawableDict[drawable.zIndex][drawable.id] !== undefined;
    };

    Renderer.prototype.draw = function () {
        var self = this;
        this.ctx.clearRect(0, 0, this.screenWidth, this.screenHeight);

        for (var key in this.drawableDict) {
            if (this.drawableDict.hasOwnProperty(key)) {
                iterate(this.drawableDict[key]);
            }
        }

        function iterate(dict) {
            for (var key in dict) {
                if (dict.hasOwnProperty(key)) {
                    var elem = dict[key];

                    self.ctx.drawImage(self.atlas, elem.img.x, elem.img.y,
                        elem.img.width, elem.img.height,
                        self._getImgRenderXPoint(elem.x, elem.img),
                        self._getImgRenderYPoint(elem.y, elem.img),
                        self._getImgRenderWidth(elem.img),
                        self._getImgRenderHeight(elem.img));
                }
            }
        }
    };

    var baseTileWidth = 1,
        tileOffSet = Math.floor(baseTileWidth * 0.5);

    Renderer.prototype._getImgRenderXPoint = function (x, subImage) {
        return x * baseTileWidth + (tileOffSet * subImage.tileWidth) + subImage.offSetX;
    };

    Renderer.prototype._getImgRenderYPoint = function (y, subImage) {
        return y * baseTileWidth + (tileOffSet * subImage.tileHeight) + subImage.offSetY;
    };

    Renderer.prototype._getImgRenderWidth = function (subImage) {
        return Math.floor(subImage.trimmedTileWidth * baseTileWidth);
    };

    Renderer.prototype._getImgRenderHeight = function (subImage) {
        return Math.floor(subImage.trimmedTileHeight * baseTileWidth);
    };

    return Renderer;
})();