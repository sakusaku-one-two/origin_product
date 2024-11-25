import { createSlice,PayloadAction } from "@reduxjs/toolkit";
import { LocationRecord,AttendanceRecord } from "../recordType";
import { UPDATE as ATTENDANCE_RECORD_UPDATE,DELETE as ATTENDANCE_RECORD_DELETE,INSERT_SETUP as ATTENDANCE_RECORD_INSERT_SETUP } from "./attendanceSlice";

// -----------------------[LocationRecordの初期値]-----------------------------
export const initialLocationState = {
    isLoading:false as boolean,
    locationList:[] as LocationRecord[],
};

//--------------------------[重複を削除]----------------------------------------
function UniqueLocationRecords(locationRecords:LocationRecord[]):LocationRecord[]{
    return locationRecords.filter((record,index,self)=>self.findIndex((t)=>t.LocationID === record.LocationID && t.ClientID === record.ClientID) === index);
}

// -----------------------[LocationRecordの更新]-----------------------------
function updateLocationRecords(state:LocationRecord[],updateLocationRecords:LocationRecord[]):LocationRecord[]{
    const newReplacedRecords:LocationRecord[] = state.map((record)=>{
        const targetRecord = updateLocationRecords.find((updateRecord)=>updateRecord.LocationID === record.LocationID && updateRecord.ClientID === record.ClientID);
        if(targetRecord){
            return targetRecord;
        }
        return record;
    });

    // 重複を削除してソート 
    return UniqueLocationRecords([...newReplacedRecords,...updateLocationRecords]).sort((a,b)=>a.LocationID - b.LocationID);
}   

// -----------------------[LocationRecordの削除]-----------------------------
function deleteLocationRecords(state:LocationRecord[],deleteLocationRecords:LocationRecord[]){
    return state.filter((record)=>!deleteLocationRecords.includes(record));
}

// -----------------------[LocationRecordのスライス]-----------------------------
export const LocationSlice = createSlice({
    name:"LOCATION_RECORD",
    initialState:initialLocationState,
    reducers:{
        INSERT_SETUP:(state,action:PayloadAction<LocationRecord[]>)=>{
            state.locationList = UniqueLocationRecords([...state.locationList,...action.payload]);
        },
        UPDATE:(state,action:PayloadAction<AttendanceRecord>)=>{
            state.locationList = updateLocationRecords(state.locationList,[action.payload.Location]);
        },
        DELETE:(state,action:PayloadAction<AttendanceRecord>)=>{
            state.locationList = deleteLocationRecords(state.locationList,[action.payload.Location]);
        }   
    },
    extraReducers:(builder)=>{
        builder
        .addCase(ATTENDANCE_RECORD_UPDATE,(state,action:PayloadAction<AttendanceRecord>)=>{
            state.locationList = updateLocationRecords(state.locationList,[action.payload.Location]);
        })
        .addCase(ATTENDANCE_RECORD_DELETE,(state,action:PayloadAction<AttendanceRecord>)=>{
            state.locationList = deleteLocationRecords(state.locationList,[action.payload.Location]);
        })
        .addCase(ATTENDANCE_RECORD_INSERT_SETUP,(state,action:PayloadAction<AttendanceRecord[]>)=>{
            state.locationList =updateLocationRecords( state.locationList,UniqueLocationRecords(action.payload.map((record)=>record.Location)));
        })
    }
});

export const {INSERT_SETUP,UPDATE,DELETE} = LocationSlice.actions;
export default LocationSlice.reducer;



