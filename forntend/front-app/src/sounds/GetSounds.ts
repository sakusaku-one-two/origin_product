import alertSound from "@/assets/sounds/alert.mp3";
import preAlertSound from "@/assets/sounds/preAlert.mp3";
// import waitingSound from "@/assets/sounds/waiting.mp3";

export interface ISound{
    play():void;
    stop():void;

    speak(text:string):void;
}


class PlaySound implements ISound{
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

    speak(text:string):void{
        console.log(text);
    }

};



class SpeakSound implements ISound{
    private synthesis: SpeechSynthesisUtterance;
    
    constructor(){
        this.synthesis = new SpeechSynthesisUtterance();
        this.synthesis.lang = 'ja-JP';
        this.synthesis.rate = 1.0;
        this.synthesis.pitch = 1.0;
    }

    play(){
        // 空の実装
    }

    stop(){
        window.speechSynthesis.cancel();
    }

    speak(text: string): void {
        this.synthesis.text = text;
        window.speechSynthesis.speak(this.synthesis);
    }
}   


export enum SoundsName{
    alert = "alert",
    preAlert = "preAlert",
    speach = "speach"
}

const AlertSoundDict:Map<keyof typeof SoundsName, ISound> = new Map();

AlertSoundDict.set(SoundsName.alert, new PlaySound(alertSound));
AlertSoundDict.set(SoundsName.preAlert,new PlaySound(preAlertSound));
AlertSoundDict.set(SoundsName.speach, new SpeakSound());






export default function GetSounds(
    soudsName:SoundsName
) :ISound{
    return AlertSoundDict.get(soudsName) as ISound;
};
