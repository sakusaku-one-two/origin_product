import { createSlice,PayloadAction} from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";




//----------------------------[ユーザー]--------------------------------------------

export interface User {
    ID:string,
    Name:string,
}

//----------------------------[従業員]--------------------------------------------
//従業員のデータ
export interface Employee {
    EmpID : number;
    Name:string;
}

//----------------------------[勤怠実績レコード]--------------------------------------------
//勤怠実績CSVのデータをサーバー側で読み取りその中で必要なデータを取捨選択してフロントに返したもの
//このデータをもとに、打刻のデータを作成する(childRecordが打刻のデータ)
export interface AttendanceRecord{//管制実績CSVのデータ
    
    ManageID:number;
    Emp:Employee;
    
    //現場名称
    LocationID:number;
    LocationName:string;

    //勤務ポスト
    PostID:number;
    PostName:string;

    //現場勤務ポストID
    LocationPostID:string; //このIDで同一現場の同一ポストの一括打刻を行えるようにする。

    //出発報告
    PlanHomeDepartureTime:Date;//予定自宅出発時間
    HomeDepartureTimeStamp:Date|null;//出発報告時間
    IsOverTimeAsDeparture:boolean;//出発報告時間が予定時間を超えているか
    HomeDepartureStampByUser:User|null;//出発打刻者
    
    //到着報告
    PlanReachTime:Date;//予定到着時間
    ReachTimeStamp:Date|null;//到着報告時間
    IsOverTimeAsReach:boolean;//到着報告時間が予定時間を超えているか
    ReachStampByUser:User|null;//到着打刻者

    //上番報告
    PlanStartTime:Date;//予定上番時間
    StartTimeStamp:Date|null;//上番報告時間
    IsOverTimeAsStart:boolean;//上番報告時間が予定時間を超えているか
    StartStampByUser:User|null;//上番打刻者

    //下番報告
    PlanFinishTime:Date;//予定下番時間
    FinishTimeStamp:Date|null;//下番報告時間
    IsOverTimeAsFinish:boolean;//下番報告時間が予定時間を超えているか
    FinishStampByUser:User|null;//下番報告者

    //各種残業時間
    EarlyOverTime:number;//早出時間
    LuchBreakWorkTime:number;//昼休み勤務時間
    ExtraHours:number;//残業時間

}


//ヘルパー関数：同一勤務ポストIDを設定する（同一現場の同一ポストの一括打刻を行えるようにするその為 代表者が報告するケースがあるので、）サーバー側で実装するのでもしかしたら不用かも。。
export function SetUpLocationAndPostID(targetRecord:AttendanceRecord):AttendanceRecord{
    const { LocationID, PostID } = targetRecord;
    const locationPostID = `${LocationID}:${PostID}`;
    return { ...targetRecord, LocationPostID: locationPostID };
}

//------------------------------------------------------------------------

//************[子レコードの種別]************//


export enum ReportTypeEnum {
    HOME_DEPARTURE='HomeDeparture',
    REACH='Reach',
    START='Start',
    FINISH='Finish',
}

export type ReportType = ReportTypeEnum.HOME_DEPARTURE | ReportTypeEnum.REACH | ReportTypeEnum.START | ReportTypeEnum.FINISH;

//**************************************//


//打刻のデータ これをもとにAttendanceRecordを更新する。つまりディスパッチャーのpyloadの型。
export interface ChildRecord {
    ManageID:number;//管理ID
    ReportType:ReportType;//報告種別
    PlanReportTime:Date;//予定報告時間
    ReportTimeStamp:Date|null;//報告時間
    ReportByUser:User|null;//報告者
}


export const UpdateAttendanceRecordByChildRecord = (state:AttendanceRecord[], childRecord:ChildRecord):AttendanceRecord|undefined => {
    const { ManageID, ReportType } = childRecord;
    const targetRecord = state.find(record => record.ManageID === ManageID);
    
    if (!targetRecord) {
        throw new Error('指定されたManageIDが見つかりません');
    }

    switch (ReportType) {
        case ReportTypeEnum.HOME_DEPARTURE:
            return { ...targetRecord, HomeDepartureTimeStamp: childRecord.ReportTimeStamp, HomeDepartureStampByUser: childRecord.ReportByUser };
        case ReportTypeEnum.REACH:
            return { ...targetRecord, ReachTimeStamp: childRecord.ReportTimeStamp, ReachStampByUser: childRecord.ReportByUser };
        case ReportTypeEnum.START:
            return { ...targetRecord, StartTimeStamp: childRecord.ReportTimeStamp, StartStampByUser: childRecord.ReportByUser };
        case ReportTypeEnum.FINISH:
            return { ...targetRecord, FinishTimeStamp: childRecord.ReportTimeStamp, FinishStampByUser: childRecord.ReportByUser };
    }
}




//ヘルパー関数：管制実績CSV（AttendanceRecord）をもとに各種打刻のデータ(ChildRecord)を作成する
export const AttendanceRecordDivision = (state:AttendanceRecord[]):{
    HomeDeparture:ChildRecord[],
    Reach:ChildRecord[],
    Start:ChildRecord[],
    Finish:ChildRecord[],
} => {
    
    const HomeDeparture:ChildRecord[] = [];
    const Reach:ChildRecord[] = [];
    const Start:ChildRecord[] = [];
    const Finish:ChildRecord[] = [];


    state.forEach(record => {

        const HomeDeparturechildRecord:ChildRecord = {
            ManageID: record.ManageID,
            ReportType: ReportTypeEnum.HOME_DEPARTURE,
            PlanReportTime: record.PlanHomeDepartureTime,
            ReportTimeStamp: record.HomeDepartureTimeStamp,
            ReportByUser: record.HomeDepartureStampByUser,
        };
        HomeDeparture.push(HomeDeparturechildRecord);
        
        const ReachchildRecord:ChildRecord = {
            ManageID: record.ManageID,
            ReportType: ReportTypeEnum.REACH,
            PlanReportTime: record.PlanReachTime,
            ReportTimeStamp: record.ReachTimeStamp,
            ReportByUser: record.ReachStampByUser,
        };

        Reach.push(ReachchildRecord);   
        
        const StartchildRecord:ChildRecord = {
            ManageID: record.ManageID,
            ReportType: ReportTypeEnum.START,
            PlanReportTime: record.PlanStartTime,   
            ReportTimeStamp: record.StartTimeStamp,
            ReportByUser: record.StartStampByUser,
        };
        Start.push(StartchildRecord);

        const FinishchildRecord:ChildRecord = {
            ManageID: record.ManageID,
            ReportType: ReportTypeEnum.FINISH,
            PlanReportTime: record.PlanFinishTime,
            ReportTimeStamp: record.FinishTimeStamp,
            ReportByUser: record.FinishStampByUser,
        };
        Finish.push(FinishchildRecord);
    });

    return { HomeDeparture, Reach, Start, Finish };
}






//---------------------[非同期レデューサーの作成（redux thunk)]---------------------------------------------------



//+++++++++++++++++++++++++++++++++++++++++++++++++++++
//サーバーにある管制実績CSVを基にしたAttendanceRcords を取得する
export const fetchAttendanceRecords = createAsyncThunk(
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


//cheildRecordをもとにAttendanceRecordを更新する
export const updateAttendanceRecord = createAsyncThunk(
    'updateAttendanceRecord',//typePrefix:string -> 非同期アクションの名前を定義します。redux toolkitが自動的に生成するアクションの名前に追加されます。
    async (childRecord:ChildRecord, {rejectWithValue}) => {//{rejectWithValue}はthunkAPIが保持しているプロパティ
        try{
            const response = await axios.post<ChildRecord>('/api/attendanceRecords/update', childRecord);
            return response.data;
        }catch(error){
            if (axios.isAxiosError(error as Error)){
                return rejectWithValue("error");
            }
            return rejectWithValue('予期せぬエラーが発生しました。');
        }
    }
)
//+++++++++++++++++++++++++++++++++++++++++++++++++++++

//+++++++++++++++++++++++++++++++++++++++++++++++++++++

//+++++++++++++++++++++++++++++++++++++++++++++++++++++

//------------------------------------------------------------------------
//スライスの作成

export type recodsState = {
    AttendanceRecords:AttendanceRecord[],
    [ReportTypeEnum.REACH]:ChildRecord[],
    [ReportTypeEnum.HOME_DEPARTURE]:ChildRecord[],
    [ReportTypeEnum.START]:ChildRecord[],
    [ReportTypeEnum.FINISH]:ChildRecord[],
    CurrentState:string,
    IsLoading:boolean,
};

const recodsInitialState:recodsState = {
    AttendanceRecords:[],
    [ReportTypeEnum.REACH]:[],
    [ReportTypeEnum.HOME_DEPARTURE]:[],
    [ReportTypeEnum.START]:[],
    [ReportTypeEnum.FINISH]:[],
    CurrentState:"",
    IsLoading:false
}

export const ReportSlice = createSlice({
    name:'Records',  
    initialState:recodsInitialState,
    reducers:{
        
    },
    extraReducers: (builder) => {
        builder.addCase(fetchAttendanceRecords.fulfilled, (state, action) => {//サーバーから管制実績の取得に成功したケース
            const recods:AttendanceRecord[] = action.payload;
            const {HomeDeparture, Reach, Start, Finish} = AttendanceRecordDivision(recods);
            return {// new state
                AttendanceRecords:recods,
                [ReportTypeEnum.REACH]:Reach,
                [ReportTypeEnum.HOME_DEPARTURE]:HomeDeparture,
                [ReportTypeEnum.START]:Start,
                [ReportTypeEnum.FINISH]:Finish,
            }
        })
        .addCase(fetchAttendanceRecords.rejected, (state, action) => {

            return {...state,IsLoading:false,CurrentState:"管制実績の取得に失敗しました。"}
        })
        .addCase(fetchAttendanceRecords.pending, (state, action) => {
            return {...state,IsLoading:true,CurrentState:"管制実績の取得中です。"}
        })
        .addCase(updateAttendanceRecord.fulfilled,(state,action)=>{// reportActionからAttendanceRecordを更新する。
            //reportActionから対象となるAttendanceRecordを取得しかつ内容を更新する。
            const updatedAttndanceRecord:AttendanceRecord = UpdateAttendanceRecordByChildRecord(state.AttendanceRecords as AttendanceRecord[],action.payload as ChildRecord);
            //更新したAttendanceRecordをAttendanceRecordsに再度格納
            const targetRecordIndex = state.AttendanceRecords.findIndex((record:AttendanceRecord)=> record.ManageID === action.payload.ManageID);
            state.AttendanceRecords[targetRecordIndex] = updatedAttndanceRecord;
            state.CurrentState="更新完了";
            state.IsLoading = false;

            return {
                ...state
            };

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