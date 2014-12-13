window.onload = function () {
    "use strict";

    var app = Bootstrapper.atlas().tap().pushRelease().responsive().orientation().build(MyGameResources);
    app.start();
};