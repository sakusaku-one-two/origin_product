
import alertSound from "@/assets/sounds/alert.mp3";
import preAlertSound from "@/assets/sounds/preAlert.mp3";
// import waitingSound from "@/assets/sounds/waiting.mp3";


class PlaySound{
    private filePath:string;
    private audio: HTMLAudioElement;
    constructor(filePath:string){
        this.filePath = filePath;
        this.audio = new Audio(this.filePath);
        this.audio.loop = true;

    }

    play(){
        this.audio.play();
    }

    stop(){
        this.audio.pause();
        this.audio.currentTime = 0; 
    }

};


export enum SoundsName{
    alert = "alert",
    preAlert = "preAlert",
    append = "append"
}

const AlertSoundDict:Map<keyof typeof SoundsName, PlaySound> = new Map();

AlertSoundDict.set(SoundsName.alert, new PlaySound(alertSound));
AlertSoundDict.set(SoundsName.preAlert,new PlaySound(preAlertSound));






export default function GetSounds(
    soudsName:SoundsName
) :PlaySound{
    return AlertSoundDict.get(soudsName) as PlaySound;
};
