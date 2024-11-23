import {createSlice,PayloadAction} from "@reduxjs/toolkit";
import { TimeRecord,AttendanceRecord } from "../taskSlice";
import { UPDATE_MESSAGE as ATTENDANCE_RECORD_UPDATE_MESSAGE } from "./AttendanceSlice";

const initialTimeState = {
    isLoading:false as boolean,
    TimeRecords:[] as TimeRecord[],
};


function updateTimeRecords(state:TimeRecord[],updateTimeRecords:TimeRecord[]){
    return state.map((record)=>{
        const targetRecord = updateTimeRecords.find((updateRecord)=>updateRecord.ID === record.ID);
        if(targetRecord){
            return targetRecord;
        }
        return record;
    })
}

function deleteTimeRecords(state:TimeRecord[],deleteTimeRecords:TimeRecord[]){
    return state.filter((record)=>!deleteTimeRecords.includes(record));
}

const timeSlice = createSlice({
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
    }
    
}); 

export const {UPDATE_MESSAGE,DELETE_MESSAGE} = timeSlice.actions;
export default timeSlice.reducer;
