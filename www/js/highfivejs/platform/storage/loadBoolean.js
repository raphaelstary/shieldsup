var loadBoolean = (function (localStorage) {
    "use strict";

    function loadBoolean(key) {
        return localStorage.getItem(key) == 'true';
    }

    return loadBoolean;
})(lclStorage);