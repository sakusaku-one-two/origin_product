import alertSound from "@/assets/sounds/alert.mp3";
import preAlertSound from "@/assets/sounds/preAlert.mp3";
var PlaySound = /** @class */ (function () {
    function PlaySound(filePath) {
        this.filePath = filePath;
        this.audio = new Audio(this.filePath);
        this.audio.loop = true;
    }
    PlaySound.prototype.play = function () {
        this.audio.play();
    };
    PlaySound.prototype.stop = function () {
        this.audio.pause();
        this.audio.currentTime = 0;
    };
    PlaySound.prototype.speak = function (text) {
        console.log(text);
    };
    return PlaySound;
}());
;
var SpeakSound = /** @class */ (function () {
    function SpeakSound() {
        this.synthesis = new SpeechSynthesisUtterance();
        this.synthesis.lang = 'ja-JP';
        this.synthesis.rate = 1.0;
        this.synthesis.pitch = 1.0;
    }
    SpeakSound.prototype.play = function () {
        // 空の実装
    };
    SpeakSound.prototype.stop = function () {
        window.speechSynthesis.cancel();
    };
    SpeakSound.prototype.speak = function (text) {
        this.synthesis.text = text;
        window.speechSynthesis.speak(this.synthesis);
    };
    return SpeakSound;
}());
export var SoundsName;
(function (SoundsName) {
    SoundsName["alert"] = "alert";
    SoundsName["preAlert"] = "preAlert";
    SoundsName["speach"] = "speach";
})(SoundsName || (SoundsName = {}));
var AlertSoundDict = new Map();
AlertSoundDict.set(SoundsName.alert, new PlaySound(alertSound));
AlertSoundDict.set(SoundsName.preAlert, new PlaySound(preAlertSound));
AlertSoundDict.set(SoundsName.speach, new SpeakSound());
export default function GetSounds(soudsName) {
    return AlertSoundDict.get(soudsName);
}
;
