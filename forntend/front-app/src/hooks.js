import { useDispatch, useSelector } from "react-redux";
import { UPDATE as UPDATE_TIME_MESSAGE, DELETE as DELETE_TIME_MESSAGE } from "./redux/slices/timeSlice";
import { useCallback } from "react";
import { sampleAttendanceRecords } from "./redux/slices/sampleRecords";
import { INSERT_SETUP as INSERT_ATTENDANCE_MESSAGE } from "./redux/slices/attendanceSlice";
import { SET_SELECTED_RECORDS } from "./redux/slices/selectedRecordsSlice";
import { UPDATE as LOGIN_UPDATE } from "./redux/slices/loginSlice";
// -----------------------[AttendanceRecordのディスパッチとセレクターのカスタムフック]-----------------------------
export var useAttendanceDispatch = function () { return useDispatch(); };
export var useAttendanceSelector = useSelector;
export var useGetAttendanceRecords = function () { return useSelector(function (state) { return [state.ATTENDANCE_RECORDS.AttendanceRecords, state.ATTENDANCE_RECORDS.isLoading]; }); };
export var useSampelInsertAttendanceRecords = function () {
    var dispatch = useAttendanceDispatch();
    dispatch(INSERT_ATTENDANCE_MESSAGE(sampleAttendanceRecords));
};
// -----------------------[EmployeeRecordのディスパッチとセレクターのカスタムフック]-----------------------------
export var useEmployeeDispatch = function () { return useDispatch(); };
export var useEmployeeSelector = useSelector;
export var useGetEmployeeRecords = function () { return useSelector(function (state) { return [state.EMPLOYEE_RECORDS.employeeList, state.EMPLOYEE_RECORDS.isLoading]; }); };
// -----------------------[TimeRecordのディスパッチとセレクターのカスタムフック]-----------------------------
export var useTimeDispatch = function () { return useDispatch(); };
export var useTimeSelector = useSelector;
//TimeRecordの更新と削除のディスパッチ(ミドルウェアを通ってwebsocketでサーバーに送信される)
export var useTimeRecordDispatch = function () {
    var dispatch = useTimeDispatch();
    var updateTimeDispatch = useCallback(function (updatedTimeRecord) { return dispatch(UPDATE_TIME_MESSAGE(updatedTimeRecord)); }, [dispatch]);
    var deleteTimeDispatch = useCallback(function (deletedTimeRecord) { return dispatch(DELETE_TIME_MESSAGE(deletedTimeRecord)); }, [dispatch]);
    return { updateTimeDispatch: updateTimeDispatch, deleteTimeDispatch: deleteTimeDispatch };
};
//TimeRecordとEmployeeRecordを結合する
export function TimeRecordMergeOtherRecord(timeRecords, state) {
    var attendanceRecords = state.ATTENDANCE_RECORDS.AttendanceRecords;
    var employeeRecords = state.EMPLOYEE_RECORDS.employeeList;
    var locationRecords = state.LOCATION_RECORDS.locationList;
    var postRecords = state.POST_RECORDS.postList;
    var result = timeRecords.map(function (timeRecord) {
        var targetAttendanceRecord = attendanceRecords.find(function (attendanceRecord) { return attendanceRecord.ManageID === timeRecord.ManageID; });
        var targetEmployeeRecord = employeeRecords.find(function (employeeRecord) { return employeeRecord.EmpID === (targetAttendanceRecord === null || targetAttendanceRecord === void 0 ? void 0 : targetAttendanceRecord.EmpID); });
        var targetLocationRecord = locationRecords.find(function (locationRecord) { return locationRecord.ID === (targetAttendanceRecord === null || targetAttendanceRecord === void 0 ? void 0 : targetAttendanceRecord.Location.ID); });
        var targetPostRecord = postRecords.find(function (postRecord) { return postRecord.PostID === (targetAttendanceRecord === null || targetAttendanceRecord === void 0 ? void 0 : targetAttendanceRecord.PostID); });
        if (targetEmployeeRecord === undefined || targetLocationRecord === undefined || targetPostRecord === undefined) {
            console.log("存在しないtargetEmployeeRecord", targetEmployeeRecord);
            console.log("存在しないtargetLocationRecord", targetLocationRecord);
            console.log("存在しないtargetPostRecord", targetPostRecord);
        }
        return { timeRecord: timeRecord, employeeRecord: targetEmployeeRecord !== null && targetEmployeeRecord !== void 0 ? targetEmployeeRecord : null, locationRecord: targetLocationRecord !== null && targetLocationRecord !== void 0 ? targetLocationRecord : null, postRecord: targetPostRecord !== null && targetPostRecord !== void 0 ? targetPostRecord : null, isSelected: true };
    });
    return result;
}
export var useGetTimeRecordsWithOtherRecord = function () { return useSelector(function (state) { return TimeRecordMergeOtherRecord(state.TIME_RECORDS.TimeRecords, state); }); };
export var useGetCompletedTimeRecordsWithOtherRecord = function () { return useSelector(function (state) { return TimeRecordMergeOtherRecord(state.TIME_RECORDS.completedTimeRecords, state); }); };
export var useGetWaitingTimeRecordsWithOtherRecord = function () { return useSelector(function (state) { return TimeRecordMergeOtherRecord(state.TIME_RECORDS.waitingTimeRecords, state); }); };
export var useGetAlertTimeRecordsWithOtherRecord = function () { return useSelector(function (state) { return TimeRecordMergeOtherRecord(state.TIME_RECORDS.AlertTimeRecords, state); }); };
export var useGetPreAlertTimeRecordsWithOtherRecord = function () { return useSelector(function (state) { return TimeRecordMergeOtherRecord(state.TIME_RECORDS.PreAlertTimeRecords, state); }); };
export var useGetIgnoreTimeRecordsWithOtherRecord = function () { return useSelector(function (state) { return TimeRecordMergeOtherRecord(state.TIME_RECORDS.IgnoreTimeRecords, state); }); };
export var useGetOverTimeRecordsWithOtherRecord = function () { return useSelector(function (state) { return TimeRecordMergeOtherRecord(state.TIME_RECORDS.OverTimeRecords, state); }); };
export var useGetPreAlertIgnoreTimeRecordsWithOtherRecord = function () { return useSelector(function (state) { return TimeRecordMergeOtherRecord(state.TIME_RECORDS.PreAlertIgnoreTimeRecords, state); }); };
export var useGetIsUpdate = function () { return useSelector(function (state) { return state.TIME_RECORDS.isUpdate; }); };
export var useSelectedRecordsDispatch = function () { return useDispatch(); };
export var useSelectedRecordsSelector = function () { return useSelector(function (state) { return state.SELECTED_RECORDS.selectedRecords; }); };
export var useSetSelectedRecords = function () {
    var dispatch = useSelectedRecordsDispatch();
    var setSelectedRecords = useCallback(function (selectedRecords) { return dispatch(SET_SELECTED_RECORDS(selectedRecords)); }, [dispatch]);
    return { setSelectedRecords: setSelectedRecords };
};
// -----------------------[LocationRecordのディスパッチとセレクターのカスタムフック]-----------------------------
export var useLocationDispatch = function () { return useDispatch(); };
export var useLocationSelector = useSelector;
export var useGetLocationRecords = function () { return useSelector(function (state) { return [state.LOCATION_RECORDS.locationList, state.LOCATION_RECORDS.isLoading]; }); };
// -----------------------[PostRecordのディスパッチとセレクターのカスタムフック]-----------------------------
export var usePostDispatch = function () { return useDispatch(); };
export var usePostSelector = useSelector;
export var useGetPostRecords = function () { return useSelector(function (state) { return [state.POST_RECORDS.postList, state.POST_RECORDS.isLoading]; }); };
// -----------------------[LoginInfoのディスパッチとセレクターのカスタムフック]-----------------------------
export var useLoginDispatch = function () { return useDispatch(); };
export var useLoginSelector = useSelector;
export var useGetLoginInfo = function () { return useSelector(function (state) { return state.LOGIN; }); };
export var useSetLoginInfo = function () {
    var dispatch = useLoginDispatch();
    var setLoginInfo = useCallback(function (loginInfo) { return dispatch(LOGIN_UPDATE(loginInfo)); }, [dispatch]);
    return { setLoginInfo: setLoginInfo };
};
