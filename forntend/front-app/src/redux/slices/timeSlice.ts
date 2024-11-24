import {createSlice,PayloadAction} from "@reduxjs/toolkit";
import { TimeRecord,AttendanceRecord } from "../recordType";
import { UPDATE_MESSAGE as ATTENDANCE_RECORD_UPDATE_MESSAGE,DELETE_MESSAGE as ATTENDANCE_RECORD_DELETE_MESSAGE ,INSERT_SETUP as ATTENDANCE_RECORD_INSERT_SETUP} from "./attendanceSlice";

// -----------------------[TimeRecordの初期値]-----------------------------
const initialTimeState = {
    isLoading:false as boolean,
    TimeRecords:[] as TimeRecord[],
    completedTimeRecords:[] as TimeRecord[],
    waitingTimeRecords:[] as TimeRecord[],
    AlertTimeRecords:[] as TimeRecord[],
    PreAlertTimeRecords:[] as TimeRecord[],
    isUpdate:false as boolean,
};

// -----------------------[TimeRecordの更新と追加]-----------------------------   
function updateAndInsertTimeRecords(oldState:TimeRecord[],updateTimeRecords:TimeRecord[]){
    const updatedArray:TimeRecord[] = oldState.map((record)=>{
        const targetRecord = updateTimeRecords.find((updateRecord)=>updateRecord.ID === record.ID);
        if(targetRecord){
            return targetRecord;
        }

        return record;
    });

    const nonUpdatedArray:TimeRecord[] = oldState.filter((record)=>!updateTimeRecords.includes(record));

    return [...nonUpdatedArray,...updatedArray].sort((a,b)=>a.PlanTime.getTime() - b.PlanTime.getTime());
}

function separateTimeRecords(state:{
    completedTimeRecords:TimeRecord[],
    waitingTimeRecords:TimeRecord[],
    AlertTimeRecords:TimeRecord[],
    PreAlertTimeRecords:TimeRecord[],
} ,timeRecords:TimeRecord[])
{
    const completedTimeRecords = timeRecords.filter((record)=>record.IsComplete || record.IsOver || record.IsIgnore);
    const waitingTimeRecords = timeRecords.filter((record)=> record.IsComplete === false);
    const AlertTimeRecords = timeRecords.filter((record)=>record.IsAlert && !record.IsComplete);
    const PreAlertTimeRecords = timeRecords.filter((record)=>record.PreAlert && !record.IsAlert);

    state.completedTimeRecords = completedTimeRecords;
    state.waitingTimeRecords = waitingTimeRecords;
    state.AlertTimeRecords = AlertTimeRecords;
    state.PreAlertTimeRecords = PreAlertTimeRecords;
}

// -----------------------[TimeRecordの削除]-----------------------------
function deleteTimeRecords(state:TimeRecord[],deleteTimeRecords:TimeRecord[]){
    return state.filter((record)=>!deleteTimeRecords.includes(record));
}

// -----------------------[TimeRecordのスライス]-----------------------------
export const TimeSlice = createSlice({
    name:"TIME_RECORD",
    initialState:initialTimeState,
    reducers:{
        UPDATE_MESSAGE:(state,action:PayloadAction<TimeRecord>)=>{
            state.TimeRecords = updateAndInsertTimeRecords(state.TimeRecords,[action.payload]);
            separateTimeRecords(state,state.TimeRecords);
            state.isUpdate = true;
        },
        DELETE_MESSAGE:(state,action:PayloadAction<TimeRecord>)=>{
            state.TimeRecords = deleteTimeRecords(state.TimeRecords,[action.payload]);
            separateTimeRecords(state,state.TimeRecords);
            state.isUpdate = true;
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(ATTENDANCE_RECORD_UPDATE_MESSAGE,(state,action:PayloadAction<AttendanceRecord>)=>{
            //timeRecordを取り出す
            const updateTimeRecordArray:TimeRecord[] = action.payload.TimeRecords;
            //timeRecordを更新する
            state.TimeRecords = updateAndInsertTimeRecords(state.TimeRecords,updateTimeRecordArray);
            separateTimeRecords(state,state.TimeRecords);
            state.isUpdate = true;
        })
        .addCase(ATTENDANCE_RECORD_DELETE_MESSAGE,(state,action:PayloadAction<AttendanceRecord>)=>{
            state.TimeRecords = deleteTimeRecords(state.TimeRecords,action.payload.TimeRecords);
            separateTimeRecords(state,state.TimeRecords);
            state.isUpdate = true;
        })
        .addCase(ATTENDANCE_RECORD_INSERT_SETUP,(state,action:PayloadAction<AttendanceRecord[]>)=>{
            const insertTimeRecordArray:TimeRecord[] = action.payload.flatMap((record)=>record.TimeRecords);
            state.TimeRecords = updateAndInsertTimeRecords(state.TimeRecords,insertTimeRecordArray);      
            separateTimeRecords(state,state.TimeRecords);
            state.isUpdate = true;
        })
    }
    
}); 

export const {UPDATE_MESSAGE,DELETE_MESSAGE} = TimeSlice.actions;
export default TimeSlice.reducer;
