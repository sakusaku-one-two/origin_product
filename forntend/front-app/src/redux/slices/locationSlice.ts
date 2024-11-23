import { createSlice,PayloadAction } from "@reduxjs/toolkit";
import { LocationRecord,AttendanceRecord } from "../taskSlice";
import { UPDATE_MESSAGE as ATTENDANCE_RECORD_UPDATE_MESSAGE,DELETE_MESSAGE as ATTENDANCE_RECORD_DELETE_MESSAGE,INSERT_SETUP as ATTENDANCE_RECORD_INSERT_SETUP } from "./AttendanceSlice";

export const initialLocationState = {
    isLoading:false as boolean,
    locationList:[] as LocationRecord[],
};

function updateLocationRecords(state:LocationRecord[],updateLocationRecords:LocationRecord[]){
    return state.map((record)=>{
        const targetRecord = updateLocationRecords.find((updateRecord)=>updateRecord.LocationID === record.LocationID);
        if(targetRecord){
            return targetRecord;
        }
        return record;
    })
}   

function deleteLocationRecords(state:LocationRecord[],deleteLocationRecords:LocationRecord[]){
    return state.filter((record)=>!deleteLocationRecords.includes(record));
}

const locationSlice = createSlice({
    name:"LOCATION_RECORD",
    initialState:initialLocationState,
    reducers:{
        INSERT_SETUP:(state,action:PayloadAction<LocationRecord[]>)=>{
            state.locationList = [...state.locationList,...action.payload];
        },
        UPDATE_MESSAGE:(state,action:PayloadAction<AttendanceRecord>)=>{
            state.locationList = updateLocationRecords(state.locationList,[action.payload.Location]);
        },
        DELETE_MESSAGE:(state,action:PayloadAction<AttendanceRecord>)=>{
            state.locationList = deleteLocationRecords(state.locationList,[action.payload.Location]);
        }   
    },
    extraReducers:(builder)=>{
        builder.addCase(ATTENDANCE_RECORD_UPDATE_MESSAGE,(state,action:PayloadAction<AttendanceRecord>)=>{
            state.locationList = updateLocationRecords(state.locationList,[action.payload.Location]);
        })
        .addCase(ATTENDANCE_RECORD_DELETE_MESSAGE,(state,action:PayloadAction<AttendanceRecord>)=>{
            state.locationList = deleteLocationRecords(state.locationList,[action.payload.Location]);
        })
        .addCase(ATTENDANCE_RECORD_INSERT_SETUP,(state,action:PayloadAction<AttendanceRecord[]>)=>{
            state.locationList = [...state.locationList,...action.payload.map((record)=>record.Location)];
        })
    }
});

export const {INSERT_SETUP,UPDATE_MESSAGE,DELETE_MESSAGE} = locationSlice.actions;
export default locationSlice.reducer;



