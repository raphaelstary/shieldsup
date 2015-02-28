var installMyScenes = (function (Intro, PreGame, StartingPosition, InGameTutorial, GetReady, PlayGame, KillScreen,
    PostGame, SceneManager, ScreenShaker, ButtonFactory, Font, SplashScreen, GoFullScreen, RotateDevice, Event,
    TapManager, ShowSettingsEvented) {
    "use strict";

    var CLICK = 'computer_data_03';
    var FONT = 'GameFont';
    var WHITE = '#fff';
    var VIOLET = '#3a2e3f';

    function installMyScenes(sceneServices) {

        // custom game services START
        var shaker = new ScreenShaker(sceneServices.device);
        sceneServices.events.subscribe(Event.RESIZE, shaker.resize.bind(shaker));
        sceneServices.events.subscribe(Event.TICK_MOVE, shaker.update.bind(shaker));
        sceneServices.shaker = shaker;

        var tap = new TapManager();
        sceneServices.events.subscribe(Event.POINTER, tap.inputChanged.bind(tap));

        sceneServices.buttons = new ButtonFactory(sceneServices.stage, tap, sceneServices.timer, FONT, function () {
                sceneServices.sounds.play(CLICK);
        }, WHITE, VIOLET, Font._30, 3, WHITE, WHITE, Font._40, 2);

        sceneServices.sceneStorage.sfxOn = true;

        // custom game services END
        // todo remove debug
        //sceneServices.sounds.muteAll();

        var goFullScreen = new GoFullScreen(sceneServices);
        var rotateDevice = new RotateDevice(sceneServices);
        var settingsEvented = new ShowSettingsEvented(sceneServices);
        var splashScreen = new SplashScreen(sceneServices);
        var intro = new Intro(sceneServices);
        var preGame = new PreGame(sceneServices);
        var startingPosition = new StartingPosition(sceneServices);
        var inGameTutorial = new InGameTutorial(sceneServices);
        var getReady = new GetReady(sceneServices);
        var playGame = new PlayGame(sceneServices);
        var killScreen = new KillScreen(sceneServices);
        var postGame = new PostGame(sceneServices);

        var sceneManager = new SceneManager();
        sceneManager.add(goFullScreen.show.bind(goFullScreen), true);
        sceneManager.add(rotateDevice.show.bind(rotateDevice), true);
        sceneManager.add(settingsEvented.show.bind(settingsEvented), true);
        sceneManager.add(splashScreen.show.bind(splashScreen), true);
        sceneManager.add(intro.show.bind(intro), true);
        sceneManager.add(preGame.show.bind(preGame), true);
        sceneManager.add(startingPosition.show.bind(startingPosition));
        sceneManager.add(inGameTutorial.show.bind(inGameTutorial), true);
        sceneManager.add(getReady.show.bind(getReady));
        sceneManager.add(playGame.show.bind(playGame));
        sceneManager.add(killScreen.show.bind(killScreen));
        sceneManager.add(postGame.show.bind(postGame));

        return sceneManager;
    }

    return installMyScenes;
})(Intro, PreGame, StartingPosition, InGameTutorial, GetReady, PlayGame, KillScreen, PostGame, SceneManager,
    ScreenShaker, ButtonFactory, Font, SplashScreen, GoFullScreen, RotateDevice, Event, TapManager,
    ShowSettingsEvented);