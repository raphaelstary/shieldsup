window.onload = function () {
    "use strict";

    var app = Bootstrapper.atlas().pointer().responsive().orientation().fullScreen().keyBoard().gamePad().build(MyGameResources);
    app.start();
};