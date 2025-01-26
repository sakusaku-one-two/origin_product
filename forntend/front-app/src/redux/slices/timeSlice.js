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
// -----------------------[TimeRecordの初期値]-----------------------------
var initialTimeState = {
    isLoading: false,
    TimeRecords: [],
    completedTimeRecords: [],
    waitingTimeRecords: [],
    AlertTimeRecords: [],
    PreAlertTimeRecords: [],
    PreAlertIgnoreTimeRecords: [],
    OverTimeRecords: [],
    IgnoreTimeRecords: [],
    isUpdate: false,
};
//--------------------------[重複を削除]----------------------------------------
function UniqueTimeRecords(timeRecords) {
    return timeRecords.filter(function (record, index, self) { return self.findIndex(function (t) { return t.ID === record.ID; }) === index; });
}
// -----------------------[TimeRecordの更新と追加]-----------------------------   
function updateAndInsertTimeRecords(oldState, updateTimeRecords) {
    // 既存のTimeRecordから更新用のTimeRecordに置換
    var newReplacedRecords = oldState.map(function (oldRecord) {
        var newRecord = updateTimeRecords.find(function (updateRecord) { return updateRecord.ID === oldRecord.ID; });
        if (newRecord) {
            return newRecord;
        }
        return oldRecord;
    });
    // 更新用のTimeRecordから既存のTimeRecordに置換されていないTimeRecordを取得
    var nonReplacedRecordsFromUpdate = updateTimeRecords.filter(function (record) { return !newReplacedRecords.includes(record); });
    // 重複を削除してソート
    return UniqueTimeRecords(__spreadArray(__spreadArray([], nonReplacedRecordsFromUpdate, true), newReplacedRecords, true)).sort(function (a, b) { return new Date(a.PlanTime).getTime() - new Date(b.PlanTime).getTime(); });
}
//--------------------------[TimeRecordの分類]----------------------------------------
function separateTimeRecords(state, timeRecords) {
    var completedTimeRecords = timeRecords.filter(function (record) { return record.IsComplete || record.IsOver; });
    var waitingTimeRecords = timeRecords.filter(function (record) { return !record.IsComplete && !record.IsAlert && !record.IsOver && !record.PreAlert && !record.IsIgnore; });
    var AlertTimeRecords = timeRecords.filter(function (record) { return record.IsAlert && !record.IsComplete && !record.IsIgnore && !record.IsOver; });
    var PreAlertTimeRecords = timeRecords.filter(function (record) { return record.PreAlert && !record.PreAlertIgnore && !record.IsAlert && !record.IsComplete && !record.IsIgnore && !record.IsOver; });
    var IgnoreTimeRecords = timeRecords.filter(function (record) { return record.IsIgnore && !record.IsComplete; });
    var OverTimeRecords = timeRecords.filter(function (record) { return record.IsOver && !record.IsComplete && !record.IsIgnore; });
    var PreAlertIgnoreTimeRecords = timeRecords.filter(function (record) { return record.PreAlert && record.PreAlertIgnore && !record.IsComplete && !record.IsAlert && !record.IsOver; });
    state.completedTimeRecords = completedTimeRecords;
    state.waitingTimeRecords = waitingTimeRecords;
    state.AlertTimeRecords = AlertTimeRecords;
    state.PreAlertTimeRecords = PreAlertTimeRecords;
    state.IgnoreTimeRecords = IgnoreTimeRecords;
    state.OverTimeRecords = OverTimeRecords;
    state.PreAlertIgnoreTimeRecords = PreAlertIgnoreTimeRecords;
}
// -----------------------[TimeRecordの削除]-----------------------------
function deleteTimeRecords(state, deleteTimeRecords) {
    var deleteTimeRecordIDs = deleteTimeRecords.map(function (record) { return record.ID; });
    return state.filter(function (record) { return !deleteTimeRecordIDs.includes(record.ID); });
}
// -----------------------[TimeRecordのスライス]-----------------------------
export var TimeSlice = createSlice({
    name: "TIME_RECORD",
    initialState: initialTimeState,
    reducers: {
        UPDATE: function (state, action) {
            state.TimeRecords = updateAndInsertTimeRecords(state.TimeRecords, [action.payload]);
            separateTimeRecords(state, state.TimeRecords);
            state.isUpdate = true;
        },
        DELETE: function (state, action) {
            state.TimeRecords = deleteTimeRecords(state.TimeRecords, [action.payload]);
            separateTimeRecords(state, state.TimeRecords);
            state.isUpdate = true;
        }
    },
    extraReducers: function (builder) {
        builder.addCase(ATTENDANCE_RECORD_UPDATE, function (state, action) {
            //timeRecordを取り出す
            var updateTimeRecordArray = action.payload.TimeRecords;
            //timeRecordを更新する
            state.TimeRecords = updateAndInsertTimeRecords(state.TimeRecords, updateTimeRecordArray);
            separateTimeRecords(state, state.TimeRecords);
            state.isUpdate = true;
        })
            .addCase(ATTENDANCE_RECORD_DELETE, function (state, action) {
            state.TimeRecords = deleteTimeRecords(state.TimeRecords, action.payload.TimeRecords);
            separateTimeRecords(state, state.TimeRecords);
            state.isUpdate = true;
        })
            .addCase(ATTENDANCE_RECORD_INSERT_SETUP, function (state, action) {
            var insertTimeRecordArray = action.payload.flatMap(function (record) { return record.TimeRecords; });
            state.TimeRecords = updateAndInsertTimeRecords(state.TimeRecords, insertTimeRecordArray);
            separateTimeRecords(state, state.TimeRecords);
            state.isUpdate = true;
        });
    }
});
export var UPDATE = (_a = TimeSlice.actions, _a.UPDATE), DELETE = _a.DELETE;
export default TimeSlice.reducer;
