import {createSlice,PayloadAction} from "@reduxjs/toolkit";
import { TimeRecord,AttendanceRecord } from "../recordType";
import { UPDATE as ATTENDANCE_RECORD_UPDATE,
        DELETE as ATTENDANCE_RECORD_DELETE,
        INSERT_SETUP as ATTENDANCE_RECORD_INSERT_SETUP} from "./attendanceSlice";

// -----------------------[TimeRecordの初期値]-----------------------------
const initialTimeState = {
    isLoading:false as boolean,
    TimeRecords:[] as TimeRecord[],
    completedTimeRecords:[] as TimeRecord[],
    waitingTimeRecords:[] as TimeRecord[],
    AlertTimeRecords:[] as TimeRecord[],
    PreAlertTimeRecords:[] as TimeRecord[],
    PreAlertIgnoreTimeRecords:[] as TimeRecord[],
    OverTimeRecords:[] as TimeRecord[],
    IgnoreTimeRecords:[] as TimeRecord[],
    isUpdate:false as boolean,
};

//--------------------------[重複を削除]----------------------------------------
function UniqueTimeRecords(timeRecords:TimeRecord[]):TimeRecord[]{
    return timeRecords.filter((record,index,self)=>self.findIndex((t)=>t.ID === record.ID) === index);
}

// -----------------------[TimeRecordの更新と追加]-----------------------------   
function updateAndInsertTimeRecords(oldState:TimeRecord[],updateTimeRecords:TimeRecord[]){
    // 既存のTimeRecordから更新用のTimeRecordに置換
    const newReplacedRecords:TimeRecord[] = oldState.map((oldRecord)=>{
        const newRecord = updateTimeRecords.find((updateRecord)=>updateRecord.ID === oldRecord.ID);
        if(newRecord){
            return newRecord;
        }

        return oldRecord;
    });
    // 更新用のTimeRecordから既存のTimeRecordに置換されていないTimeRecordを取得
    const nonReplacedRecordsFromUpdate:TimeRecord[] = updateTimeRecords.filter((record)=>!newReplacedRecords.includes(record));
    // 重複を削除してソート
    return UniqueTimeRecords([...nonReplacedRecordsFromUpdate,...newReplacedRecords]).sort((a,b)=>new Date(a.PlanTime).getTime() - new Date(b.PlanTime).getTime());
}


//--------------------------[TimeRecordの分類]----------------------------------------
function separateTimeRecords(state:{
    completedTimeRecords:TimeRecord[],
    waitingTimeRecords:TimeRecord[],
    AlertTimeRecords:TimeRecord[],
    PreAlertTimeRecords:TimeRecord[],
    IgnoreTimeRecords:TimeRecord[],
    OverTimeRecords:TimeRecord[],
    PreAlertIgnoreTimeRecords:TimeRecord[],
} ,timeRecords:TimeRecord[])
{
    const completedTimeRecords = timeRecords.filter((record)=>record.IsComplete || record.IsOver);
    const waitingTimeRecords = timeRecords.filter((record)=> !record.IsComplete  && !record.IsAlert && !record.IsOver && !record.PreAlert && !record.IsIgnore);
    const AlertTimeRecords = timeRecords.filter((record)=> record.IsAlert && !record.IsComplete && !record.IsIgnore && !record.IsOver);
    const PreAlertTimeRecords = timeRecords.filter((record)=>record.PreAlert && !record.PreAlertIgnore && !record.IsAlert && !record.IsComplete && !record.IsIgnore && !record.IsOver);
    const IgnoreTimeRecords = timeRecords.filter((record) => record.IsIgnore && !record.IsComplete)
    const OverTimeRecords = timeRecords.filter((record) => record.IsOver && !record.IsComplete && !record.IsIgnore);
    const PreAlertIgnoreTimeRecords = timeRecords.filter((record)=>record.PreAlert && record.PreAlertIgnore && !record.IsComplete && !record.IsAlert && !record.IsOver);

    state.completedTimeRecords = completedTimeRecords;
    state.waitingTimeRecords = waitingTimeRecords;
    state.AlertTimeRecords = AlertTimeRecords;
    state.PreAlertTimeRecords = PreAlertTimeRecords;
    state.IgnoreTimeRecords = IgnoreTimeRecords;
    state.OverTimeRecords = OverTimeRecords;
    state.PreAlertIgnoreTimeRecords = PreAlertIgnoreTimeRecords;
}

// -----------------------[TimeRecordの削除]-----------------------------
function deleteTimeRecords(state:TimeRecord[],deleteTimeRecords:TimeRecord[]){
    const deleteTimeRecordIDs = deleteTimeRecords.map((record)=>record.ID);
    return state.filter((record)=>!deleteTimeRecordIDs.includes(record.ID));
}

// -----------------------[TimeRecordのスライス]-----------------------------
export const TimeSlice = createSlice({
    name:"TIME_RECORD",
    initialState:initialTimeState,
    reducers:{
        UPDATE:(state,action:PayloadAction<TimeRecord>)=>{
            state.TimeRecords = updateAndInsertTimeRecords(state.TimeRecords,[action.payload]);
            separateTimeRecords(state,state.TimeRecords);
            state.isUpdate = true;

        },
        DELETE:(state,action:PayloadAction<TimeRecord>)=>{
            state.TimeRecords = deleteTimeRecords(state.TimeRecords,[action.payload]);
            separateTimeRecords(state,state.TimeRecords);
            state.isUpdate = true;
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(ATTENDANCE_RECORD_UPDATE,(state,action:PayloadAction<AttendanceRecord>)=>{
            //timeRecordを取り出す
            const updateTimeRecordArray:TimeRecord[] = action.payload.TimeRecords;
            //timeRecordを更新する
            state.TimeRecords = updateAndInsertTimeRecords(state.TimeRecords,updateTimeRecordArray);
            separateTimeRecords(state,state.TimeRecords);
            state.isUpdate = true;
        })
        .addCase(ATTENDANCE_RECORD_DELETE,(state,action:PayloadAction<AttendanceRecord>)=>{
            state.TimeRecords = deleteTimeRecords(state.TimeRecords,action.payload.TimeRecords);
            separateTimeRecords(state,state.TimeRecords);
            state.isUpdate = true;
        })
        .addCase(ATTENDANCE_RECORD_INSERT_SETUP,(state,action:PayloadAction<AttendanceRecord[]>)=>{
            const insertTimeRecordArray:TimeRecord[] = action.payload.flatMap((record)=>record.TimeRecords);
            state.TimeRecords = updateAndInsertTimeRecords(state.TimeRecords,insertTimeRecordArray);      
            separateTimeRecords(state,state.TimeRecords);
            state.isUpdate = true;
        });
    }
    
}); 

export const {UPDATE,DELETE} = TimeSlice.actions;
export default TimeSlice.reducer;
