

//----------------------------[ユーザー]--------------------------------------------

export interface User {
    //ユーザーID
    ID:string,
    Name:string,
    Email:string,
}

//----------------------------[従業員]--------------------------------------------
//従業員のデータ
export interface EmployeeRecord {
    EmpID : number;
    Name:string;
    Email:string;
    IsInTerm:boolean;
}

//----------------------------[配置先]--------------------------------------------
//配置先場所 のデータ 例 セントラル : 日比谷 ＝ 日比谷警備隊
export interface LocationRecord {
    ID : number;
    LocationID : number;
    ClientID : number;
    ClientName : string;
    LocationName : string;
}
//----------------------------[勤務ポスト]--------------------------------------------
//勤務ポストのデータ 例 日勤----001
export interface PostRecord {
    ID : number;
    PostID : number;
    PostName : string;
}

//----------------------------[配置先]--------------------------------------------
//打刻のデータ PlanNo 1 =>出発報告 2 =>到着報告 3 =>上番報告 4 =>下番報告
export enum PlanNo {
    HOME_DEPARTURE = 1,
    REACH = 2,
    START = 3,
    FINISH = 4,
}

export interface TimeRecord {
    ID : number;
    ManageID: number; // gorm:"index;not null"
    PlanNo: PlanNo; // 1=> 出発報告2=>到着報告 3=>上番報告 4=>下番報告
    PlanTime: Date;
    ResultTime: Date | null;
    IsAlert: boolean; // gorm:"default:false" // このフラグでクライアント側でアラートを発報する。
    PreAlert: boolean; // gorm:"default:false" //このフラグは予定時刻の5分前に予備アラートの発報フラグ
    IsOver: boolean; // gorm:"default:false" //このフラグは予定時刻を超えた事を表す
    IsIgnore: boolean; // gorm:"default:false" // このフラグはアラートや無視を表す
    PreAlertIgnore: boolean; // gorm:"default:false" // このフラグは予定時刻の5分前に無視を表す
    IsComplete: boolean; // gorm:"default:false" //完了フラグ
}

//----------------------------[勤怠実績レコード]--------------------------------------------

export interface AttendanceRecord {
    ManageID:number;
    EmpID:number;
    Emp:EmployeeRecord;
    LocationID:number;
    Location:LocationRecord;
    PostID:number;
    Post:PostRecord;
    TimeRecords:TimeRecord[];
    Description:string;
    EarlyOverTime:number;
    LunchBreakWorkTime:number;
    ExtraHours:number;  
}




//+++++++++++++++++++++++++++++++++++++++++++++++++++++


