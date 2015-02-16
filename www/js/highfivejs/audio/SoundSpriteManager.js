var SoundSpriteManager = (function (Howl) {
    "use strict";

    function SoundSpriteManager(timer) {
        this.sounds = null;
        this.timer = timer;
    }

    SoundSpriteManager.prototype.load = function (info) {
        this.sounds = new Howl(info);
    };

    SoundSpriteManager.prototype.play = function (name, loop, volume) {
        var shouldLoop = loop === undefined ? false : loop;
        var soundWrapperObject = {};
        var self = this;
        this.sounds.play(name, function (id) {
            soundWrapperObject.id = id;
            if (volume)
                self.sounds.volume(volume, id); else {
                self.sounds.volume(1, id);
            }
        });//.loop(shouldLoop);

        return soundWrapperObject;
    };

    SoundSpriteManager.prototype.volume = function (sound, volume) {
        this.sounds.volume(volume, sound.id);
    };

    SoundSpriteManager.prototype.pause = function (sound) {
        this.sounds.pause(sound.id);
    };

    SoundSpriteManager.prototype.unpause = function (sound) {

    };

    SoundSpriteManager.prototype.stop = function (sound) {
        this.sounds.stop(sound.id);
    };

    return SoundSpriteManager;
})(Howl);