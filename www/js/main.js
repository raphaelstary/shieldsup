window.onload = function () {
    "use strict";

    var app = Bootstrapper.atlas().tap().pushRelease().responsive().orientation().fullScreen().build(MyGameResources);
    app.start();
};