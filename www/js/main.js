window.onload = function () {
    "use strict";

    var app = Bootstrapper.atlas().pointer().responsive().orientation().visibility().fullScreen().keyBoard().gamePad().build(MyGameResources);
    app.start();
};