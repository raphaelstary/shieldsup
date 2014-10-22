var DragHandler = (function (isHit) {
    "use strict";

    function DragHandler() {
        this.elements = {};
        this.onGoingTouches = {};
    }

    DragHandler.prototype.touchStart = function (event) {
        event.preventDefault();

        for (var key in this.elements) {
            var elem = this.elements[key];
            var touches = event.changedTouches;
            for (var i = 0; i < touches.length; i++) {
                var touch = touches[i];

                if (isHit(touch, elem.touchable)) {
                    this.onGoingTouches[touches[i].identifier] = elem;
                    elem.start(event.clientX, event.clientY);
                }
            }
        }
    };

    DragHandler.prototype.touchMove = function (event) {
        event.preventDefault();

        var touches = event.changedTouches;
        for (var i = 0; i < touches.length; i++) {
            var activeElem = this.onGoingTouches[touches[i].identifier];

            if (activeElem) {
                activeElem.move(event.clientX, event.clientY);
            }
        }
    };

    DragHandler.prototype.touchEnd = function (event) {
        event.preventDefault();

        var touches = event.changedTouches;
        for (var i = 0; i < touches.length; i++) {
            var activeElem = this.onGoingTouches[touches[i].identifier];

            if (activeElem) {
                delete this.onGoingTouches[touches[i].identifier];
                activeElem.end(event.clientX, event.clientY);
            }
        }
    };

    DragHandler.prototype.pointerDown = function (event) {

        for (var key in this.elements) {
            var elem = this.elements[key];

            if (isHit(event, elem.touchable)) {
                this._currentMouse = elem;
                elem.start(event.clientX, event.clientY);
                return;
            }
        }
    };

    DragHandler.prototype.pointerMove = function (event) {
        if (!this._currentMouse) {
            return;
        }
        this._currentMouse.move(event.clientX, event.clientY);
        delete this._currentMouse;
    };

    DragHandler.prototype.pointerUp = function (event) {
        if (!this._currentMouse) {
            return;
        }
        this._currentMouse.end(event.clientX, event.clientY);
        delete this._currentMouse;
    };

    DragHandler.prototype.add = function (touchable, startCallback, moveCallback, endCallback) {
        this.elements[touchable.id] = {touchable: touchable, start: startCallback, move: moveCallback, end: endCallback};
    };

    DragHandler.prototype.remove = function (touchable) {
        delete this.elements[touchable.id];
    };

    return DragHandler;
})(isHit);