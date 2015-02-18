var MyGameResources = (function (addFontToDOM, UniversalTranslator, SoundSpriteManager, AtlasResourceHelper, URL,
    document, width, height, userAgent, DeviceInfo) {
    "use strict";

    var SPECIAL_FONT = 'SpecialGameFont';
    var FONT = 'GameFont';
    var LOGO_FONT = 'LogoFont';

    var audioInfo, specialGameFont, gameFont, logoFont, locales, atlases = [], images = {};

    function registerFiles(resourceLoader) {
        audioInfo = resourceLoader.addJSON('data/audio.json');
        specialGameFont = resourceLoader.addFont('data/kenpixel_blocks.woff');
        gameFont = resourceLoader.addFont('data/kenpixel.woff');
        logoFont = resourceLoader.addFont('data/dooodleista.woff');
        locales = resourceLoader.addJSON('data/locales.json');

        var isMobile = new DeviceInfo(userAgent, width, height, 1).isMobile;

        AtlasResourceHelper.register(resourceLoader, atlases, isMobile);

        return 5 + atlases.length;
    }

    function processFiles() {

        if (URL) {
            addFontToDOM([
                {
                    name: SPECIAL_FONT,
                    url: URL.createObjectURL(specialGameFont.blob)
                }, {
                    name: FONT,
                    url: URL.createObjectURL(gameFont.blob)
                }, {
                    name: LOGO_FONT,
                    url: URL.createObjectURL(logoFont.blob)
                }
            ]);
        }

        function workAroundForMeasureFontsWithChromeFirefoxOpera() {
            var ctx = document.createElement('canvas').getContext('2d');
            ctx.font = 10 + 'px ' + SPECIAL_FONT;
            ctx.fillText('THIS IS A FONT TEST', 0, 0);
            ctx.font = 10 + 'px ' + FONT;
            ctx.fillText('THIS IS A FONT TEST', 0, 0);
            ctx.font = 10 + 'px ' + LOGO_FONT;
            ctx.fillText('THIS IS A FONT TEST', 0, 0);
        }

        workAroundForMeasureFontsWithChromeFirefoxOpera();

        var sounds = new SoundSpriteManager();
        sounds.load(audioInfo);

        return {
            messages: new UniversalTranslator(locales),
            sounds: sounds,
            gfxCache: AtlasResourceHelper.process(atlases, width, height)
        };
    }

    return {
        create: registerFiles,
        process: processFiles
    };
})(addFontToDOM, UniversalTranslator, SoundSpriteManager, AtlasResourceHelper, window.URL || window.webkitURL,
    window.document, window.innerWidth, window.innerHeight, window.navigator.userAgent, DeviceInfo);