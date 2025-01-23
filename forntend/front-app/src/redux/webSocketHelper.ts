import { AttendanceRecord,TimeRecord } from "./recordType";
import { ActionType} from "./websocketMiddleware";




export function RecordRequest(state:any,actionType:ActionType):void {
    if ( actionType.type !== "TIME_RECORD/UPDATE" ) return;
    const time_record = actionType.payload as TimeRecord;
    const attendance_records :AttendanceRecord[] = state.ATTENDANCE_RECORDS.AttendanceRecords;

    const attendanceRecord:AttendanceRecord | undefined = attendance_records.find((value:AttendanceRecord) => value.ManageID === time_record.ManageID);
    if (!attendanceRecord){
        //存在しないケース
        fetch(`/api/import`,{
            method:"POST",
            body:JSON.stringify({
                manage_ids :[time_record.ManageID]
            }),
            headers:{
                "ContentType":"Appliation/json"
            }
        });
    }
}


