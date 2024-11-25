import { useDispatch,useSelector,TypedUseSelectorHook } from "react-redux";
import {UPDATE as UPDATE_TIME_MESSAGE,DELETE as DELETE_TIME_MESSAGE} from "./redux/slices/timeSlice";
import type { AppDispatch, RootState } from "./redux/store";
import type { AttendanceRecord } from "./redux/recordType";
import type { EmployeeRecord } from "./redux/recordType";
import type { TimeRecord } from "./redux/recordType";
import type { LocationRecord } from "./redux/recordType";
import { useCallback } from "react";
import { sampleAttendanceRecords } from "./redux/slices/sampleRecords";
import { INSERT_SETUP as INSERT_ATTENDANCE_MESSAGE } from "./redux/slices/attendanceSlice";


// -----------------------[AttendanceRecordのディスパッチとセレクターのカスタムフック]-----------------------------

export const useAttendanceDispatch = () => useDispatch<AppDispatch>();
export const useAttendanceSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useGetAttendanceRecords = ():[AttendanceRecord[],boolean] => useSelector((state:RootState) => [state.ATTENDANCE_RECORDS.AttendanceRecords,state.ATTENDANCE_RECORDS.isLoading]  );

export const useSampelInsertAttendanceRecords = () => {
  const dispatch = useAttendanceDispatch();
  dispatch(INSERT_ATTENDANCE_MESSAGE(sampleAttendanceRecords));
};


// -----------------------[EmployeeRecordのディスパッチとセレクターのカスタムフック]-----------------------------

export const useEmployeeDispatch = () => useDispatch<AppDispatch>();
export const useEmployeeSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useGetEmployeeRecords = ():[EmployeeRecord[],boolean] => useSelector((state:RootState) => [state.EMPLOYEE_RECORDS.employeeList,state.EMPLOYEE_RECORDS.isLoading]);

// -----------------------[TimeRecordのディスパッチとセレクターのカスタムフック]-----------------------------

export const useTimeDispatch = () => useDispatch<AppDispatch>();
export const useTimeSelector: TypedUseSelectorHook<RootState> = useSelector;

//TimeRecordの更新と削除のディスパッチ(ミドルウェアを通ってwebsocketでサーバーに送信される)
export const useTimeRecordDispatch = () => {
    const dispatch = useTimeDispatch();
    const updateTime = useCallback((updatedTimeRecord:TimeRecord) => dispatch(UPDATE_TIME_MESSAGE(updatedTimeRecord)),[dispatch]);
    const deleteTime = useCallback((deletedTimeRecord:TimeRecord) => dispatch(DELETE_TIME_MESSAGE (deletedTimeRecord)),[dispatch]);
    return {updateTime,deleteTime};
};

export type TimeRecordWithOtherRecord = {
    timeRecord:TimeRecord,
    employeeRecord:EmployeeRecord | null,
    locationRecord:LocationRecord | null
};

//TimeRecordとEmployeeRecordを結合する
export function TimeRecordMergeOtherRecord(timeRecords:TimeRecord[],state:RootState):TimeRecordWithOtherRecord[]{
    const attendanceRecords = state.ATTENDANCE_RECORDS.AttendanceRecords;
    const employeeRecords = state.EMPLOYEE_RECORDS.employeeList;
    const locationRecords = state.LOCATION_RECORDS.locationList;

    
    return timeRecords.map((timeRecord)=>{
        const targetAttendanceRecord = attendanceRecords.find((attendanceRecord)=>attendanceRecord.ManageID === timeRecord.ManageID);
        const targetEmployeeRecord = employeeRecords.find((employeeRecord)=>employeeRecord.EmpID === targetAttendanceRecord?.EmpID);
        const targetLocationRecord = locationRecords.find((locationRecord)=>locationRecord.ID === targetAttendanceRecord?.LocationID);
        return {timeRecord,employeeRecord:targetEmployeeRecord ?? null,locationRecord:targetLocationRecord ?? null};
    });
}

export const useGetTimeRecordsWithOtherRecord = ():TimeRecordWithOtherRecord[] => useSelector((state:RootState) => TimeRecordMergeOtherRecord(state.TIME_RECORDS.TimeRecords,state));
export const useGetCompletedTimeRecordsWithOtherRecord = ():TimeRecordWithOtherRecord[] => useSelector((state:RootState) => TimeRecordMergeOtherRecord(state.TIME_RECORDS.completedTimeRecords,state));
export const useGetWaitingTimeRecordsWithOtherRecord = ():TimeRecordWithOtherRecord[] => useSelector((state:RootState) => TimeRecordMergeOtherRecord(state.TIME_RECORDS.waitingTimeRecords,state));
export const useGetAlertTimeRecordsWithOtherRecord = ():TimeRecordWithOtherRecord[] => useSelector((state:RootState) => TimeRecordMergeOtherRecord(state.TIME_RECORDS.AlertTimeRecords,state));
export const useGetPreAlertTimeRecordsWithOtherRecord = ():TimeRecordWithOtherRecord[] => useSelector((state:RootState) => TimeRecordMergeOtherRecord(state.TIME_RECORDS.PreAlertTimeRecords,state));
export const useGetIsUpdate = ():boolean => useSelector((state:RootState) => state.TIME_RECORDS.isUpdate);

// -----------------------[LocationRecordのディスパッチとセレクターのカスタムフック]-----------------------------

export const useLocationDispatch = () => useDispatch<AppDispatch>();
export const useLocationSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useGetLocationRecords = ():[LocationRecord[],boolean] => useSelector((state:RootState) => [state.LOCATION_RECORDS.locationList,state.LOCATION_RECORDS.isLoading]);
