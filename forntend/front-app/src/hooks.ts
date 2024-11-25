import { useDispatch,useSelector,TypedUseSelectorHook } from "react-redux";
import { UPDATE_MESSAGE as UPDATE_TIME_MESSAGE,DELETE_MESSAGE as DELETE_TIME_MESSAGE } from "./redux/slices/timeSlice";
import type { AppDispatch, RootState } from "./redux/store";
import type { AttendanceRecord } from "./redux/recordType";
import type { EmployeeRecord } from "./redux/recordType";
import type { TimeRecord } from "./redux/recordType";
import type { LocationRecord } from "./redux/recordType";
import { useCallback } from "react";




// -----------------------[AttendanceRecordのディスパッチとセレクターのカスタムフック]-----------------------------

export const useAttendanceDispatch = () => useDispatch<AppDispatch>();
export const useAttendanceSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useGetAttendanceRecords = ():[AttendanceRecord[],boolean] => useSelector((state:RootState) => [state.ATTENDANCE_RECORDS.AttendanceRecords,state.ATTENDANCE_RECORDS.isLoading]  );

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
    const deleteTime = useCallback((deletedTimeRecord:TimeRecord) => dispatch(DELETE_TIME_MESSAGE(deletedTimeRecord)),[dispatch]);
    return {updateTime,deleteTime};
};

export type TimeRecordWithEmployeeRecord = {
    timeRecord:TimeRecord,
    employeeRecord:EmployeeRecord | null
};

//TimeRecordとEmployeeRecordを結合する
export function TimeRecordMergeEmployeeRecord(timeRecords:TimeRecord[],state:RootState):TimeRecordWithEmployeeRecord[]{
    const attendanceRecords = state.ATTENDANCE_RECORDS.AttendanceRecords;

    return timeRecords.map((timeRecord)=>{
        const targetAttendanceRecord = attendanceRecords.find((attendanceRecord)=>attendanceRecord.ManageID === timeRecord.ManageID);
        if(targetAttendanceRecord){
            return {timeRecord,employeeRecord:targetAttendanceRecord.Emp};
        }
        return {timeRecord,employeeRecord:null};
    });
}

export const useGetTimeRecordsWithEmployeeRecord = ():TimeRecordWithEmployeeRecord[] => useSelector((state:RootState) => TimeRecordMergeEmployeeRecord(state.TIME_RECORDS.TimeRecords,state));
export const useGetCompletedTimeRecordsWithEmployeeRecord = ():TimeRecordWithEmployeeRecord[] => useSelector((state:RootState) => TimeRecordMergeEmployeeRecord(state.TIME_RECORDS.completedTimeRecords,state));
export const useGetWaitingTimeRecordsWithEmployeeRecord = ():TimeRecordWithEmployeeRecord[] => useSelector((state:RootState) => TimeRecordMergeEmployeeRecord(state.TIME_RECORDS.waitingTimeRecords,state));
export const useGetAlertTimeRecordsWithEmployeeRecord = ():TimeRecordWithEmployeeRecord[] => useSelector((state:RootState) => TimeRecordMergeEmployeeRecord(state.TIME_RECORDS.AlertTimeRecords,state));
export const useGetPreAlertTimeRecordsWithEmployeeRecord = ():TimeRecordWithEmployeeRecord[] => useSelector((state:RootState) => TimeRecordMergeEmployeeRecord(state.TIME_RECORDS.PreAlertTimeRecords,state));
export const useGetIsUpdate = ():boolean => useSelector((state:RootState) => state.TIME_RECORDS.isUpdate);

// -----------------------[LocationRecordのディスパッチとセレクターのカスタムフック]-----------------------------

export const useLocationDispatch = () => useDispatch<AppDispatch>();
export const useUpdateLocationDispatch = () => useDispatch<AppDispatch>();
export const useDeleteLocationDispatch = () => useDispatch<AppDispatch>();
export const useLocationSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useGetLocationRecords = ():[LocationRecord[],boolean] => useSelector((state:RootState) => [state.LOCATION_RECORDS.locationList,state.LOCATION_RECORDS.isLoading]);
