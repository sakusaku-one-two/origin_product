import {createSlice,PayloadAction} from "@reduxjs/toolkit";
import { TimeRecord,AttendanceRecord } from "../recordType";
import { UPDATE_MESSAGE as ATTENDANCE_RECORD_UPDATE_MESSAGE,DELETE_MESSAGE as ATTENDANCE_RECORD_DELETE_MESSAGE ,INSERT_SETUP as ATTENDANCE_RECORD_INSERT_SETUP} from "./attendanceSlice";

// -----------------------[TimeRecordの初期値]-----------------------------
const initialTimeState = {
    isLoading:false as boolean,
    TimeRecords:[] as TimeRecord[],
};

// -----------------------[TimeRecordの更新]-----------------------------   
function updateTimeRecords(state:TimeRecord[],updateTimeRecords:TimeRecord[]){
    return state.map((record)=>{
        const targetRecord = updateTimeRecords.find((updateRecord)=>updateRecord.ID === record.ID);
        if(targetRecord){
            return targetRecord;
        }
        return record;
    })
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
            state.TimeRecords = updateTimeRecords(state.TimeRecords,[action.payload]);
        },
        DELETE_MESSAGE:(state,action:PayloadAction<TimeRecord>)=>{
            state.TimeRecords = deleteTimeRecords(state.TimeRecords,[action.payload]);
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(ATTENDANCE_RECORD_UPDATE_MESSAGE,(state,action:PayloadAction<AttendanceRecord>)=>{
            //timeRecordを取り出す
            const updateTimeRecordArray:TimeRecord[] = action.payload.TimeRecords;
            //timeRecordを更新する
            state.TimeRecords = updateTimeRecords(state.TimeRecords,updateTimeRecordArray);
        })
        .addCase(ATTENDANCE_RECORD_DELETE_MESSAGE,(state,action:PayloadAction<AttendanceRecord>)=>{
            state.TimeRecords = deleteTimeRecords(state.TimeRecords,action.payload.TimeRecords);
        })
        .addCase(ATTENDANCE_RECORD_INSERT_SETUP,(state,action:PayloadAction<AttendanceRecord[]>)=>{
            const insertTimeRecordArray:TimeRecord[] = action.payload.flatMap((record)=>record.TimeRecords);
            state.TimeRecords = updateTimeRecords(state.TimeRecords,insertTimeRecordArray);      
        })
    }
    
}); 

export const {UPDATE_MESSAGE,DELETE_MESSAGE} = TimeSlice.actions;
export default TimeSlice.reducer;
