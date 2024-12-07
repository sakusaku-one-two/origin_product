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
