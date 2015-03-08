var loadInteger = (function (localStorage, parseInt) {
    "use strict";

    function loadInteger(key) {
        var value = localStorage.getItem(key);
        if (value == null)
            return 0;
        return parseInt(value);
    }

    return loadInteger;
})(lclStorage, parseInt);