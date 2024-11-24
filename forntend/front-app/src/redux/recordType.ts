

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
    ManageID : number;
    PlanNo : PlanNo;
    PlanReportTime : Date;
    ResultTime : Date|null;
    IsAlert : boolean;
    PreAlert : boolean;
    IsOver : boolean;
    IsIgnore : boolean;
    IsComplete : boolean;
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


//createAsyncThunkのオプションと解説
//
//    createAsyncThunk(typePrefix:string,
//                      thunk:AsyncThunkActionCreator<Returned,
//                      ThunkArg,
//                      ThunkApiConfig>)
//
//typePrefix:string -> 非同期アクションの名前を定義します。redux toolkitが自動的に生成するアクションの名前に追加されます。
//      ・pending:非同期アクションが実行されているときに生成されるアクション   -> ${typePrefix}/pending
//      ・fulfilled:非同期アクションが成功したときに生成されるアクション      -> ${typePrefix}/fulfilled
//      ・rejected:非同期アクションが失敗したときに生成されるアクション       -> ${typePrefix}/rejected
//payloadCreater:AsyncThunkActionCreator<Returned, ThunkArg, ThunkApiConfig> -> 非同期アクションを定義する関数
//  二つの引数を受け取ります。
//  第一引数:ディスパッチ時に渡されるパレメーター    
//  第二引数:thnkAPIオブジェクト
//     （以下のプロパティをふくみます）
//          ・dispathc:Reduxストアのディスパッチ関数
//          ・getState:現在のReduxステートを取得する関数
//
//
//Returned -> thunkが返す値の型
//ThunkArg -> thunkに渡される引数の型
//ThunkApiConfig -> thunkのAPI設定
//
//
//
//
//
//
//
//


//+++++++++++++++++++++++++++++++++++++++++++++++++++++

//+++++++++++++++++++++++++++++++++++++++++++++++++++++

//+++++++++++++++++++++++++++++++++++++++++++++++++++++

//------------------------------------------------------------------------

