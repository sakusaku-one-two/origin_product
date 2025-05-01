import { createAsyncThunk, createSlice,PayloadAction } from "@reduxjs/toolkit";
import { AttendanceRecord } from "../recordType";


const GetAttendanceRecordsURL = import.meta.env.BASE_URL + '/update'
export const fetchAttendanceRecords = createAsyncThunk("fetchAttendanceRecords",async()=>{
    const response = await fetch(GetAttendanceRecordsURL);
    return response.json();
});

export const ResetChecker = (payload:AttendanceRecord[]):boolean => {
    if (payload.length === 0) return false;
    const target = payload[0];
    if (target.ManageID === 0) return true;
    return false;
};

//---------------------------[初期値]----------------------------
export const initialAttendanceState = {
    isLoading:false as boolean,
    AttendanceRecords:[] as AttendanceRecord[],
};


//---------------------------[スライス]----------------------------
export const AttendanceSlice = createSlice({
    name:"ATTENDANCE_RECORD",
    initialState:initialAttendanceState,
    reducers:{
        UPDATE:(state,action:PayloadAction<AttendanceRecord>)=>{ //ウェブソケットからの受信(更新/新規)
            
            const targetRecord:AttendanceRecord | undefined = state.AttendanceRecords.find((record:AttendanceRecord)=>record.ManageID === action.payload.ManageID);
            if(targetRecord){//置き換え
                state.AttendanceRecords.splice(state.AttendanceRecords.indexOf(targetRecord),1,action.payload as AttendanceRecord);
            }else{//追加
                state.AttendanceRecords.push(action.payload as AttendanceRecord);
            }
        },
        DELETE:(state,action:PayloadAction<AttendanceRecord>)=>{ //ウェブソケットからの受信(削除)
            const targetRecord:AttendanceRecord | undefined = state.AttendanceRecords.find((record:AttendanceRecord)=>record.ManageID === action.payload.ManageID);
            if(targetRecord){
                state.AttendanceRecords.splice(state.AttendanceRecords.indexOf(targetRecord),1);
            }
        },
        INSERT_SETUP:(state,action:PayloadAction<AttendanceRecord[]>)=>{//直接的に一括登録するケース。
            
            if( ResetChecker(action.payload)){
                state.AttendanceRecords = [];
                return;
            }
            state.AttendanceRecords = [...state.AttendanceRecords,...action.payload];
            
        }
    },
});

export const {UPDATE,DELETE,INSERT_SETUP} = AttendanceSlice.actions;
export default AttendanceSlice.reducer;
