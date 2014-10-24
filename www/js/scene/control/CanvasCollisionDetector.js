var CanvasCollisionDetector = (function (document) {
    "use strict";

    function CanvasCollisionDetector(referenceImg, referenceDrawable) {
        this.data = referenceImg;
        this.drawable = referenceDrawable;

        var canvas = document.createElement('canvas');
        this.ctx = canvas.getContext('2d');

        canvas.width = this.width = referenceImg.width;
        canvas.height = this.height = referenceImg.height;
    }

    CanvasCollisionDetector.prototype.isHit = function (element) {

        this.ctx.clearRect(0, 0, this.width, this.height);

        this.ctx.drawImage(this.data.img, this.data.x, this.data.y, this.data.width, this.data.height, 0, 0,
            this.data.width, this.data.height);

        this.ctx.save();
        this.ctx.globalCompositeOperation = 'source-in';

        var x = element.getCornerX() - this._getReferenceCornerX();
        var y = element.getCornerY() - this._getReferenceCornerY();

        var elemImg = element.data;
        this.ctx.drawImage(elemImg.img, elemImg.x, elemImg.y, elemImg.width, elemImg.height, x, y, elemImg.width,
            elemImg.height);

        this.ctx.restore();

        var sourceWidth = x + elemImg.width;
        var sourceHeight = y + elemImg.height;
        if (sourceWidth < 1 || sourceHeight < 1) {
            return false;
        }

        var rawPixelData = this.ctx.getImageData(0, 0, sourceWidth, sourceHeight).data;

        for (var i = 0; i < rawPixelData.length; i += 4) {
            var alphaValue = rawPixelData[i + 3];
            if (alphaValue != 0) {
                return true;
            }
        }
        return false;
    };

    CanvasCollisionDetector.prototype._getReferenceCornerX = function () {
        return this.drawable.x - this.data.width / 2;
    };

    CanvasCollisionDetector.prototype._getReferenceCornerY = function () {
        return this.drawable.y - this.data.height / 2;
    };

    return CanvasCollisionDetector;
})(window.document);