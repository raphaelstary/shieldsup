window.onload = function () {
    "use strict";

    var app = Bootstrapper.atlas().tap().pushRelease().responsive().build(MyGameResources);
    app.start();
};