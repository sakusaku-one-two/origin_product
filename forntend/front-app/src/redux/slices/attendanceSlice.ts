import { createAsyncThunk, createSlice,PayloadAction } from "@reduxjs/toolkit";
import { AttendanceRecord } from "../taskSlice";

export const fetchAttendanceRecords = createAsyncThunk("fetchAttendanceRecords",async()=>{
    const response = await fetch("http://localhost:3000/attendance");
    return response.json();
}); 




export const initialAttendanceState = {
    isLoading:false as boolean,
    AttendanceRecords:[] as AttendanceRecord[],
};

const AttendanceSlice = createSlice({
    name:"ATTENDANCE_RECORD",
    initialState:initialAttendanceState,
    reducers:{
        UPDATE_MESSAGE:(state,action:PayloadAction<AttendanceRecord>)=>{ //ウェブソケットからの受信
            
            const targetRecord:AttendanceRecord | undefined = state.AttendanceRecords.find((record:AttendanceRecord)=>record.ManageID === action.payload.ManageID);
            if(targetRecord){
                state.AttendanceRecords.splice(state.AttendanceRecords.indexOf(targetRecord),1,action.payload as AttendanceRecord);
            }
        },
        DELETE_MESSAGE:(state,action:PayloadAction<AttendanceRecord>)=>{ //ウェブソケットからの受信
            const targetRecord:AttendanceRecord | undefined = state.AttendanceRecords.find((record:AttendanceRecord)=>record.ManageID === action.payload.ManageID);
            if(targetRecord){
                state.AttendanceRecords.splice(state.AttendanceRecords.indexOf(targetRecord),1);
            }
        },
        INSERT_SETUP:(state,action:PayloadAction<AttendanceRecord>)=>{//直接的に一括登録するケース。
            state.AttendanceRecords = state.AttendanceRecords.concat(action.payload);
        }
    },
    
})

export const {UPDATE_MESSAGE,DELETE_MESSAGE} = AttendanceSlice.actions;
export default AttendanceSlice.reducer;