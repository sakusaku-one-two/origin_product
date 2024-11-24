import { createAsyncThunk, createSlice,PayloadAction } from "@reduxjs/toolkit";
import { AttendanceRecord } from "../recordType";

export const fetchAttendanceRecords = createAsyncThunk("fetchAttendanceRecords",async()=>{
    const response = await fetch("http://localhost:3000/attendance");
    return response.json();
});




export const initialAttendanceState = {
    isLoading:false as boolean,
    AttendanceRecords:[] as AttendanceRecord[],
};

export const AttendanceSlice = createSlice({
    name:"ATTENDANCE_RECORD",
    initialState:initialAttendanceState,
    reducers:{
        UPDATE_MESSAGE:(state,action:PayloadAction<AttendanceRecord>)=>{ //ウェブソケットからの受信(更新/新規)
            
            const targetRecord:AttendanceRecord | undefined = state.AttendanceRecords.find((record:AttendanceRecord)=>record.ManageID === action.payload.ManageID);
            if(targetRecord){
                state.AttendanceRecords.splice(state.AttendanceRecords.indexOf(targetRecord),1,action.payload as AttendanceRecord);
            }else{
                state.AttendanceRecords.push(action.payload as AttendanceRecord);
            }
        },
        DELETE_MESSAGE:(state,action:PayloadAction<AttendanceRecord>)=>{ //ウェブソケットからの受信(削除)
            const targetRecord:AttendanceRecord | undefined = state.AttendanceRecords.find((record:AttendanceRecord)=>record.ManageID === action.payload.ManageID);
            if(targetRecord){
                state.AttendanceRecords.splice(state.AttendanceRecords.indexOf(targetRecord),1);
            }
        },
        INSERT_SETUP:(state,action:PayloadAction<AttendanceRecord[]>)=>{//直接的に一括登録するケース。
            state.AttendanceRecords = [...state.AttendanceRecords,...action.payload];
        }
    },
})

export const {UPDATE_MESSAGE,DELETE_MESSAGE,INSERT_SETUP} = AttendanceSlice.actions;
export default AttendanceSlice.reducer;