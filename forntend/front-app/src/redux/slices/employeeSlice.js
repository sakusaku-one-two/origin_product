var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var _a;
import { createSlice } from "@reduxjs/toolkit";
import { UPDATE as ATTENDANCE_RECORD_UPDATE, DELETE as ATTENDANCE_RECORD_DELETE, INSERT_SETUP as ATTENDANCE_RECORD_INSERT_SETUP } from "./attendanceSlice";
// -----------------------[EmployeeRecordの初期値]-----------------------------
export var initialEmployeeState = {
    isLoading: false,
    employeeList: [],
};
//--------------------------[重複を削除]----------------------------------------
function UniqueEmployeeRecords(employeeRecords) {
    return employeeRecords.filter(function (record, index, self) { return self.findIndex(function (t) { return t.EmpID === record.EmpID; }) === index; });
}
// -----------------------[EmployeeRecordの更新と追加]-----------------------------
function updateAndInsertEmployeeRecords(oldState, updateEmployeeRecords) {
    // 既存の社員レコードから新しい社員レコードに置換
    var newReplacedArray = oldState.map(function (record) {
        var targetRecord = updateEmployeeRecords.find(function (updateRecord) { return updateRecord.EmpID === record.EmpID; });
        if (targetRecord) {
            return targetRecord;
        }
        return record;
    });
    // 置換されていない更新用のEmployeeRecordを取得(追加されたEmployeeRecordのケース)
    var nonReplacedArray = updateEmployeeRecords.filter(function (record) { return !newReplacedArray.includes(record); });
    return __spreadArray(__spreadArray([], nonReplacedArray, true), newReplacedArray, true).sort(function (a, b) { return a.EmpID - b.EmpID; });
}
;
// -----------------------[EmployeeRecordの削除]-----------------------------
function deleteEmployeeRecords(state, deleteEmployeeRecords) {
    return state.filter(function (record) { return !deleteEmployeeRecords.includes(record); });
}
// -----------------------[EmployeeRecordのスライス]-----------------------------
export var EmployeeSlice = createSlice({
    name: "EMPLOYEE_RECORD",
    initialState: initialEmployeeState,
    reducers: {
        INSERT_SETUP: function (state, action) {
            state.employeeList = updateAndInsertEmployeeRecords(state.employeeList, UniqueEmployeeRecords(action.payload));
        },
        UPDATE: function (state, action) {
            state.employeeList = updateAndInsertEmployeeRecords(state.employeeList, [action.payload]);
        },
        DELETE: function (state, action) {
            state.employeeList = deleteEmployeeRecords(state.employeeList, [action.payload]);
        }
    },
    extraReducers: function (builder) {
        builder.addCase(ATTENDANCE_RECORD_UPDATE, function (state, action) {
            state.employeeList = updateAndInsertEmployeeRecords(state.employeeList, [action.payload.Emp]);
        })
            .addCase(ATTENDANCE_RECORD_DELETE, function (state, action) {
            state.employeeList = deleteEmployeeRecords(state.employeeList, [action.payload.Emp]);
        })
            .addCase(ATTENDANCE_RECORD_INSERT_SETUP, function (state, action) {
            state.employeeList = updateAndInsertEmployeeRecords(state.employeeList, UniqueEmployeeRecords(action.payload.map(function (record) { return record.Emp; })));
        });
    }
});
export var INSERT_SETUP = (_a = EmployeeSlice.actions, _a.INSERT_SETUP), UPDATE = _a.UPDATE, DELETE = _a.DELETE;
export default EmployeeSlice.reducer;
