import { AttendanceRecord,TimeRecord } from "./recordType";
import { ActionType} from "./websocketMiddleware";




export function RecordRequest(state:any,actionType:ActionType):void {
    if ( actionType.type !== "TIME_RECORD/UPDATE" ) return;
    const time_record = actionType.payload as TimeRecord;
    const attendance_records :AttendanceRecord[] = state.ATTENDANCE_RECORDS.AttendanceRecords;

    const attendanceRecord:AttendanceRecord | undefined = attendance_records.find((value:AttendanceRecord) => value.ManageID === time_record.ManageID);
    if (!attendanceRecord){
        //存在しないケース
        fetch(`/api/import`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json" // 修正点: 小文字に変更
            },
            body: JSON.stringify({
              manage_ids: [time_record.ManageID]
            })
          })
            .then(response => {
              if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
              }
              return response.json();
            })
            .then(data => {
              console.log("Success:", data);
            })
            .catch(error => {
              console.error("Error:", error);
            });
          
    }
}

// // データがない場合はサーバーにデータを送信する 返り値はwebsocketで受信する。
// if (fetchList.length > 0) {
//     console.log("fetchList",fetchList);
//     fetch("/api/import",{
//         method:"POST",
//         body:JSON.stringify({
//             manage_ids:fetchList
//         }),
//         headers:{
//             "Content-Type":"application/json"
//         }
//     }).then((res)=>{
//         return res.json();
//     }).then((data)=>{
        
//         if (data.message === "success") {
//             alert("データをインポートしました。");
//             // useAttendanceDispatch()(INSERT_ATTENDANCE_MESSAGE(data.attendances));
//         }
//     })
// }

