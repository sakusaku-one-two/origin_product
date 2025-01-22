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
import type { PostRecord } from "./redux/recordType";
import { SET_SELECTED_RECORDS } from "./redux/slices/selectedRecordsSlice";



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
export const useTimeRecordDispatch = ():{updateTimeDispatch:(updatedTimeRecord:TimeRecord)=>void,deleteTimeDispatch:(deletedTimeRecord:TimeRecord)=>void} => {
    const dispatch = useTimeDispatch();
    const updateTimeDispatch = useCallback((updatedTimeRecord:TimeRecord) => dispatch(UPDATE_TIME_MESSAGE(updatedTimeRecord)),[dispatch]);
    const deleteTimeDispatch = useCallback((deletedTimeRecord:TimeRecord) => dispatch(DELETE_TIME_MESSAGE (deletedTimeRecord)),[dispatch]);
    return {updateTimeDispatch,deleteTimeDispatch};
};

export type TimeRecordWithOtherRecord = {
    timeRecord:TimeRecord,
    employeeRecord:EmployeeRecord | null,
    locationRecord:LocationRecord | null,
    postRecord :PostRecord | null,//PostRecordが抜けていた。
    isSelected:boolean
};



//TimeRecordとEmployeeRecordを結合する
export function TimeRecordMergeOtherRecord(timeRecords:TimeRecord[],state:RootState):TimeRecordWithOtherRecord[]{
    const attendanceRecords = state.ATTENDANCE_RECORDS.AttendanceRecords as AttendanceRecord[];
    const employeeRecords = state.EMPLOYEE_RECORDS.employeeList as EmployeeRecord[];
    const locationRecords = state.LOCATION_RECORDS.locationList as LocationRecord[];
    const postRecords = state.POST_RECORDS.postList as PostRecord[];

    const fetchList:number[] = [];    
    const result:TimeRecordWithOtherRecord[] = timeRecords.map((timeRecord)=>{
        const targetAttendanceRecord = attendanceRecords.find((attendanceRecord)=>attendanceRecord.ManageID === timeRecord.ManageID);
        const targetEmployeeRecord = employeeRecords.find((employeeRecord)=>employeeRecord.EmpID === targetAttendanceRecord?.EmpID);
        const targetLocationRecord = locationRecords.find((locationRecord)=>locationRecord.ID === targetAttendanceRecord?.Location.ID);
        const targetPostRecord = postRecords.find((postRecord)=>postRecord.PostID === targetAttendanceRecord?.PostID);

        if (targetEmployeeRecord === undefined || targetLocationRecord === undefined || targetPostRecord === undefined) {
            console.log("存在しないtargetEmployeeRecord",targetEmployeeRecord);
            console.log("存在しないtargetLocationRecord",targetLocationRecord);
            console.log("存在しないtargetPostRecord",targetPostRecord);
            fetchList.push(timeRecord.ManageID);
        }

        return {timeRecord,employeeRecord:targetEmployeeRecord ?? null,locationRecord:targetLocationRecord ?? null,postRecord:targetPostRecord ?? null,isSelected:true};
    }); 

    // データがない場合はサーバーにデータを送信する 返り値はwebsocketで受信する。
    if (fetchList.length > 0) {
        console.log("fetchList",fetchList);
        fetch("/api/import",{
            method:"POST",
            body:JSON.stringify({
                manage_ids:fetchList
            }),
            headers:{
                "Content-Type":"application/json"
            }
        }).then((res)=>{
            return res.json();
        }).then((data)=>{
            
            if (data.message === "success") {
                alert("データをインポートしました。");
                // useAttendanceDispatch()(INSERT_ATTENDANCE_MESSAGE(data.attendances));
            }
        })
    }
    return result;

}

export const useGetTimeRecordsWithOtherRecord = ():TimeRecordWithOtherRecord[] => useSelector((state:RootState) => TimeRecordMergeOtherRecord(state.TIME_RECORDS.TimeRecords,state));
export const useGetCompletedTimeRecordsWithOtherRecord = ():TimeRecordWithOtherRecord[] => useSelector((state:RootState) => TimeRecordMergeOtherRecord(state.TIME_RECORDS.completedTimeRecords,state));
export const useGetWaitingTimeRecordsWithOtherRecord = ():TimeRecordWithOtherRecord[] => useSelector((state:RootState) => TimeRecordMergeOtherRecord(state.TIME_RECORDS.waitingTimeRecords,state));
export const useGetAlertTimeRecordsWithOtherRecord = ():TimeRecordWithOtherRecord[] => useSelector((state:RootState) => TimeRecordMergeOtherRecord(state.TIME_RECORDS.AlertTimeRecords,state));
export const useGetPreAlertTimeRecordsWithOtherRecord = ():TimeRecordWithOtherRecord[] => useSelector((state:RootState) => TimeRecordMergeOtherRecord(state.TIME_RECORDS.PreAlertTimeRecords,state));
export const useGetIgnoreTimeRecordsWithOtherRecord = ():TimeRecordWithOtherRecord[] => useSelector((state:RootState) => TimeRecordMergeOtherRecord(state.TIME_RECORDS.IgnoreTimeRecords,state));
export const useGetOverTimeRecordsWithOtherRecord = ():TimeRecordWithOtherRecord[] => useSelector((state:RootState) => TimeRecordMergeOtherRecord(state.TIME_RECORDS.OverTimeRecords,state));
export const useGetPreAlertIgnoreTimeRecordsWithOtherRecord = ():TimeRecordWithOtherRecord[] => useSelector((state:RootState) => TimeRecordMergeOtherRecord(state.TIME_RECORDS.PreAlertIgnoreTimeRecords,state));
export const useGetIsUpdate = ():boolean => useSelector((state:RootState) => state.TIME_RECORDS.isUpdate);


export const useSelectedRecordsDispatch = () => useDispatch<AppDispatch>();

export const useSelectedRecordsSelector = ():TimeRecordWithOtherRecord | null => useSelector((state:RootState) => state.SELECTED_RECORDS.selectedRecords);

export const useSetSelectedRecords = ():{setSelectedRecords:(selectedRecords:TimeRecordWithOtherRecord | null)=>void} => {
    const dispatch = useSelectedRecordsDispatch();
    const setSelectedRecords = useCallback((selectedRecords:TimeRecordWithOtherRecord | null) => dispatch(SET_SELECTED_RECORDS(selectedRecords)),[dispatch]);
    return {setSelectedRecords};
};

// -----------------------[LocationRecordのディスパッチとセレクターのカスタムフック]-----------------------------

export const useLocationDispatch = () => useDispatch<AppDispatch>();
export const useLocationSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useGetLocationRecords = ():[LocationRecord[],boolean] => useSelector((state:RootState) => [state.LOCATION_RECORDS.locationList,state.LOCATION_RECORDS.isLoading]);


// -----------------------[PostRecordのディスパッチとセレクターのカスタムフック]-----------------------------

export const usePostDispatch = () => useDispatch<AppDispatch>();
export const usePostSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useGetPostRecords = ():[PostRecord[],boolean] => useSelector((state:RootState) => [state.POST_RECORDS.postList,state.POST_RECORDS.isLoading]);