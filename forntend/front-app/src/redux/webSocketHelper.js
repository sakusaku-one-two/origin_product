export function RecordRequest(state, actionType) {
    if (actionType.type !== "TIME_RECORD/UPDATE")
        return;
    var time_record = actionType.payload;
    var attendance_records = state.ATTENDANCE_RECORDS.AttendanceRecords;
    var attendanceRecord = attendance_records.find(function (value) { return value.ManageID === time_record.ManageID; });
    if (!attendanceRecord) {
        //存在しないケース
        fetch("/api/import", {
            method: "POST",
            headers: {
                "Content-Type": "application/json" // 修正点: 小文字に変更
            },
            body: JSON.stringify({
                manage_ids: [time_record.ManageID]
            })
        })
            .then(function (response) {
            if (!response.ok) {
                throw new Error("HTTP error! Status: ".concat(response.status));
            }
            return response.json();
        })
            .then(function (data) {
            console.log("Success:", data);
        })
            .catch(function (error) {
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
