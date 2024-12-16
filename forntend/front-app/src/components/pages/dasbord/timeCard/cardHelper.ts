import { TimeRecord } from "../../../../redux/recordType";
import { TimeRecordWithOtherRecord } from "../../../../hooks";


export const SetAlertAnimation = (record:TimeRecordWithOtherRecord):string => {
    const timeRecord:TimeRecord = record.timeRecord as TimeRecord;
    
    //アラート状態で、完了、無視状態でない場合のアニメーション
    if (timeRecord.IsAlert && !timeRecord.IsComplete) {
        return "bg-red-500 animate-pulse";
    }


    //5分前アラート無視状態で、完了、無視状態でない場合のアニメーション
    if (timeRecord.PreAlert && !timeRecord.IsComplete) {
        return "bg-yellow-500 animate-pulse";
    }

    return "";
};


//カードの種類 書く番号に応じて表示スタイルを変更する。
export enum CardType {
    PreAlert = 1,
    PreAlertIgnore = 2,
    Alert = 3,
    Ignore = 4,
    Wait = 5,
    ControlPanel = 6,
}