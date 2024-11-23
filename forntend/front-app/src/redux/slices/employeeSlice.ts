import { createSlice,PayloadAction } from "@reduxjs/toolkit";
import { EmployeeRecord ,AttendanceRecord} from "../taskSlice";
import { UPDATE_MESSAGE as EMPLOYEE_RECORD_UPDATE_MESSAGE,DELETE_MESSAGE as EMPLOYEE_RECORD_DELETE_MESSAGE ,INSERT_SETUP as EMPLOYEE_RECORD_INSERT_SETUP} from "./AttendanceSlice";

export const initialEmployeeState = {
    isLoading:false as boolean,
    employeeList:[] as EmployeeRecord[],
};

function updateEmployeeRecords(state:EmployeeRecord[],updateEmployeeRecords:EmployeeRecord[]){
    return state.map((record)=>{
        const targetRecord = updateEmployeeRecords.find((updateRecord)=>updateRecord.EmpID === record.EmpID);
        if(targetRecord){
            return targetRecord;
        }
        return record;
    })
}   

function deleteEmployeeRecords(state:EmployeeRecord[],deleteEmployeeRecords:EmployeeRecord[]){
    return state.filter((record)=>!deleteEmployeeRecords.includes(record));
}

const employeeSlice = createSlice({
    name:"EMPLOYEE_RECORD",
    initialState:initialEmployeeState,
    reducers:{
        INSERT_SETUP:(state,action:PayloadAction<EmployeeRecord[]>)=>{
            state.employeeList = [...state.employeeList,...action.payload];
        },
        UPDATE_MESSAGE:(state,action:PayloadAction<EmployeeRecord>)=>{
            state.employeeList = updateEmployeeRecords(state.employeeList,[action.payload]);
        },
        DELETE_MESSAGE:(state,action:PayloadAction<EmployeeRecord>)=>{
            state.employeeList = deleteEmployeeRecords(state.employeeList,[action.payload]);
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(EMPLOYEE_RECORD_UPDATE_MESSAGE,(state,action:PayloadAction<AttendanceRecord>)=>{
            state.employeeList = updateEmployeeRecords(state.employeeList,[action.payload.Emp]);
        })
        .addCase(EMPLOYEE_RECORD_DELETE_MESSAGE,(state,action:PayloadAction<AttendanceRecord>)=>{
            state.employeeList = deleteEmployeeRecords(state.employeeList,[action.payload.Emp]);
        })
        .addCase(EMPLOYEE_RECORD_INSERT_SETUP,(state,action:PayloadAction<AttendanceRecord[]>)=>{
            state.employeeList = [...state.employeeList,...action.payload.map((record)=>record.Emp)];
        })  
    }
});

export const {INSERT_SETUP,UPDATE_MESSAGE,DELETE_MESSAGE} = employeeSlice.actions;
export default employeeSlice.reducer;
