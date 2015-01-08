window.onload = function () {
    "use strict";

    var app = Bootstrapper.atlas().pointer().responsive().orientation().fullScreen().keyBoard().build(MyGameResources);
    app.start();
};