import { createSlice,PayloadAction} from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";




//----------------------------[ユーザー]--------------------------------------------

export interface User {
    //ユーザーID
    ID:string,
    Name:string,
}

//----------------------------[従業員]--------------------------------------------
//従業員のデータ
export interface EmployeeRecord {
    EmpID : number;
    Name:string;
    Email:string;
}

//----------------------------[配置先]--------------------------------------------
//配置先場所 のデータ 例　セントラル　-　日比谷　＝　日比谷警備隊
export interface LocationRecord {
    LocationID : number;
    ClientID : number;
    ClientName : string;
    LocationName : string;
}
//----------------------------[勤務ポスト]--------------------------------------------
//勤務ポストのデータ 例　日勤　----　001
export interface PostRecord {
    PostID : number;
    PostName : string;
}

//----------------------------[配置先]--------------------------------------------
//打刻のデータ PlanNo 1 =>　出発報告　2 => 到着報告　3 => 上番報告 4 => 下番報告
export enum PlanNo {
    HOME_DEPARTURE = 1,
    REACH = 2,
    START = 3,
    FINISH = 4,
}

export interface TimeRecord {
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



//----------------------------[勤怠実績レコード]--------------------------------------------

//+++++++++++++++++++++++++++++++++++++++++++++++++++++
//サーバーにある管制実績CSVを基にしたAttendanceRcords を取得する
export const ATTENDANCE_RECORD_URL = process.env.ATTENDANCE_RECORD_URL;

export const  fetchAttendanceRecords = createAsyncThunk(
    'fetchAttendanceRecords',
    async (_,{rejectWithValue}) => {
        try{
            const response = await axios.get<AttendanceRecord[]>(ATTENDANCE_RECORD_URL);
            return response.data;
        }catch(error){
            if (axios.isAxiosError(error as Error)){
                return rejectWithValue("error");
            }
            return rejectWithValue('予期せぬエラーが発生しました。');
        }
    }
)

export const fetchAttendanceRecords__ = createAsyncThunk(
    'fetchAttendanceRecords',
    async (_,{rejectWithValue}) => {
        try{
            const response = await axios.get<AttendanceRecord[]>('/api/attendanceRecords');
            return response.data;
        }catch(error){
            if (axios.isAxiosError(error as Error)){
                return rejectWithValue("error");
            }
            return rejectWithValue('予期せぬエラーが発生しました。');
        }
    }
);


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
//スライスの作成

export type recodsState = {
    AttendanceRecords:AttendanceRecord[],
    [PlanNo.REACH]:TimeRecord[],
    [PlanNo.HOME_DEPARTURE]:TimeRecord[],
    [PlanNo.START]:TimeRecord[],
    [PlanNo.FINISH]:TimeRecord[],
    CurrentState:string,
    IsLoading:boolean,
    IsLogin:boolean,
    User:User,
};

const recodsInitialState:recodsState = {
    AttendanceRecords:[],
    [PlanNo.REACH]:[],
    [PlanNo.HOME_DEPARTURE]:[],
    [PlanNo.START]:[],
    [PlanNo.FINISH]:[],
    CurrentState:"",
    IsLoading:false,
    IsLogin:false,
    User:{
        ID:"",
        Name:"",
    },
}

export const RecordsSlice = createSlice({
    name:'Records',  
    initialState:recodsInitialState,
    reducers:{
        login:(state,action:PayloadAction<{User:User,Message:string,Records:AttendanceRecord[]}>)=>{
            state.IsLogin = true;
            state.User = action.payload.User;
            state.AttendanceRecords = action.payload.Records;
            state.CurrentState = action.payload.Message;
        },  
        logout:(state,action)=>{
            state.IsLogin = false;
        }   
    },
    extraReducers: (builder) => {
        builder.addCase(fetchAttendanceRecords.fulfilled, (state, action) => {//サーバーから管制実績の取得に成功したケース
            const recods:AttendanceRecord[] = action.payload;
            const {HomeDeparture, Reach, Start, Finish} = AttendanceRecordDivision(recods);
            
            state.AttendanceRecords = recods;
            state[ReportTypeEnum.REACH] = Reach;
            state[ReportTypeEnum.HOME_DEPARTURE] = HomeDeparture;
            state[ReportTypeEnum.START] = Start;
            state[ReportTypeEnum.FINISH] = Finish;
            state.IsLoading = false;
            state.CurrentState = "配信サーバーからデータの取得完了しました。";

        })
        .addCase(fetchAttendanceRecords.rejected, (state, action) => {

            return {...state,IsLoading:false,CurrentState:"管制実績の取得に失敗しました。"}
        })
        .addCase(fetchAttendanceRecords.pending, (state, action) => {
            return {...state,IsLoading:true,CurrentState:"管制実績の取得中です。"}
        })
        .addCase(updateAttendanceRecord.fulfilled,(state,action)=>{// reportActionからAttendanceRecordを更新する。
            //reportActionから対象となるAttendanceRecordを取得しかつ内容を更新する。
            const updatedAttndanceRecord:AttendanceRecord|undefined = UpdateAttendanceRecordByChildRecord(state.AttendanceRecords as AttendanceRecord[],action.payload as ChildRecord);
            //更新したAttendanceRecordをAttendanceRecordsに再度格納
            if (updateAttendanceRecord === undefined) return {...state} //状態を更新しない。
            
            //以下更新処理
            const targetRecordIndex = state.AttendanceRecords.findIndex((record:AttendanceRecord)=> record.ManageID === action.payload.ManageID);
            state.AttendanceRecords[targetRecordIndex] = updatedAttndanceRecord as AttendanceRecord;
            state.CurrentState="更新完了";
            state.IsLoading = false;
            
        })
        .addCase(updateAttendanceRecord.rejected,(state,action)=>{
            return {...state,IsLoading:false,CurrentState:"管制実績の更新失敗しました"}
        })
        .addCase(updateAttendanceRecord.pending,(state,action)=>{
            return {...state,IsLoading:true,CurrentState:"管制実績を更新中です。"}
        })
        
    }
});



//------------------------------------------------------------------------



//------------------------------------------------------------------------

//------------------------------------------------------------------------