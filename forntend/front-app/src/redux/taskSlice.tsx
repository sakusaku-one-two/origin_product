import { createSlice } from "@reduxjs/toolkit";

export interface User {
    UserID:number;
    UserName:string;
    Password:string;
    IsLogin:boolean;
    IsAdmin:boolean;
}

//社員
export interface Employee {
    empID:number;
    Name:string;
    Kana:string;
}
//管制実績のCSVの各行を要素で必要な項目を抽出したもの
export interface AttendanceRecord {
    RecordID: number;//管制実績の管理番号
    Emp: Employee;//社員

    PlannedDepartureTime: Date;//出発予定時刻
    DepartureActualTime: Date;//出発実績時刻
    DepartureActualByUser: User;//出発実績者

    PlannedArrivalTime: Date;//到着予定時刻
    ArrivalActualTime: Date;//到着実績時刻
    ArrivalActualByUser: User;//到着実績者


    PlannedPunchInTime: Date;//上番予定時刻
    PunchInActualTime: Date;//上番実績時刻
    PunchInActualByUser: User;//上番実績者

    PlannedPunchOutTime: Date;//下番予定時刻
    PunchOutActualTime: Date;//下番実績時刻
    PunchOutActualByUser: User;//下番実績者 
}

export interface RecordState {
    records: AttendanceRecord[];
}

const recordSlice = createSlice({
  name: "records",
  initialState: [],
  reducers: {
    addTask: (state, action) => {
      state.push(action.payload);
    },
  },
});