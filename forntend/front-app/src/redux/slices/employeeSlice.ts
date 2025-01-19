import { createSlice,PayloadAction } from "@reduxjs/toolkit";
import { EmployeeRecord ,AttendanceRecord} from "../recordType";
import { UPDATE as ATTENDANCE_RECORD_UPDATE,
         DELETE as ATTENDANCE_RECORD_DELETE,
        INSERT_SETUP as ATTENDANCE_RECORD_INSERT_SETUP} from "./attendanceSlice";

// -----------------------[EmployeeRecordの初期値]-----------------------------
export const initialEmployeeState = {
    isLoading:false as boolean,
    employeeList:[] as EmployeeRecord[],
};

//--------------------------[重複を削除]----------------------------------------
function UniqueEmployeeRecords(employeeRecords:EmployeeRecord[]):EmployeeRecord[]{
    return employeeRecords.filter((record,index,self)=>self.findIndex((t)=>t.EmpID === record.EmpID) === index);
}

// -----------------------[EmployeeRecordの更新と追加]-----------------------------
function updateAndInsertEmployeeRecords(oldState:EmployeeRecord[],updateEmployeeRecords:EmployeeRecord[]){
    // 既存の社員レコードから新しい社員レコードに置換
    const newReplacedArray:EmployeeRecord[] = oldState.map((record)=>{
        const targetRecord = updateEmployeeRecords.find((updateRecord)=>updateRecord.EmpID === record.EmpID);
        if(targetRecord){
            return targetRecord;
        }
        return record;
    });
    // 置換されていない更新用のEmployeeRecordを取得(追加されたEmployeeRecordのケース)
    const nonReplacedArray:EmployeeRecord[] = updateEmployeeRecords.filter((record)=>!newReplacedArray.includes(record));
    return [...nonReplacedArray,...newReplacedArray].sort((a,b)=>a.EmpID - b.EmpID);
};

// -----------------------[EmployeeRecordの削除]-----------------------------
function deleteEmployeeRecords(state:EmployeeRecord[],deleteEmployeeRecords:EmployeeRecord[]){
    return state.filter((record)=>!deleteEmployeeRecords.includes(record));
}

// -----------------------[EmployeeRecordのスライス]-----------------------------
export const EmployeeSlice = createSlice({
    name:"EMPLOYEE_RECORD",
    initialState:initialEmployeeState,
    reducers:{
        INSERT_SETUP:(state,action:PayloadAction<EmployeeRecord[]>)=>{
            state.employeeList = updateAndInsertEmployeeRecords(state.employeeList,UniqueEmployeeRecords(action.payload));
        },
        UPDATE:(state,action:PayloadAction<EmployeeRecord>)=>{
            state.employeeList = updateAndInsertEmployeeRecords(state.employeeList,[action.payload]);
        },
        DELETE:(state,action:PayloadAction<EmployeeRecord>)=>{
            state.employeeList = deleteEmployeeRecords(state.employeeList,[action.payload]);
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(ATTENDANCE_RECORD_UPDATE,(state,action:PayloadAction<AttendanceRecord>)=>{
                state.employeeList = updateAndInsertEmployeeRecords(state.employeeList,[action.payload.Emp]);
        })
        .addCase(ATTENDANCE_RECORD_DELETE,(state,action:PayloadAction<AttendanceRecord>)=>{
            state.employeeList = deleteEmployeeRecords(state.employeeList,[action.payload.Emp]);
        })
        .addCase(ATTENDANCE_RECORD_INSERT_SETUP,(state,action:PayloadAction<AttendanceRecord[]>)=>{
            state.employeeList = updateAndInsertEmployeeRecords(state.employeeList,UniqueEmployeeRecords(action.payload.map((record)=>record.Emp)));
        })  
    }
});

export const {INSERT_SETUP,UPDATE,DELETE} = EmployeeSlice.actions;
export default EmployeeSlice.reducer;
