var MyGameResources = (function (addFontToDOM, UniversalTranslator, SoundSpriteManager, AtlasResourceHelper, URL,
    document, width, height, userAgent, DeviceInfo, window) {
    "use strict";

    var SPECIAL_FONT = 'SpecialGameFont';
    var FONT = 'GameFont';
    var LOGO_FONT = 'LogoFont';

    var audioInfo, specialGameFont, gameFont, logoFont, locales, atlases = [], images = {}, moreGames;

    function registerFiles(resourceLoader) {
        audioInfo = resourceLoader.addJSON('data/audio.json');
        specialGameFont = resourceLoader.addFont('data/kenpixel_blocks.woff');
        gameFont = resourceLoader.addFont('data/kenpixel.woff');
        logoFont = resourceLoader.addFont('data/dooodleista.woff');
        locales = resourceLoader.addJSON('data/locales.json');
        moreGames = resourceLoader.addJSON('data/more_games.json');

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

        var sounds = new SoundSpriteManager();
        sounds.load(audioInfo);

        window.moreGamesLink = moreGames.link;

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
    window.document, window.innerWidth, window.innerHeight, window.navigator.userAgent, DeviceInfo, window);