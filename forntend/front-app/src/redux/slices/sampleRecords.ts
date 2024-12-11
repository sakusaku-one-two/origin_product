import { PlanNo, AttendanceRecord } from "../recordType";

// サンプルの勤怠記録データ
export const sampleAttendanceRecords: AttendanceRecord[] = [
    {
      ManageID: 1, // 管理実績番号
      EmpID: 101, // 従業員ID
      Emp: {
        EmpID: 101, // 従業員の識別番号
        Name: "田中一郎", // 従業員の名前
        Email: "ichiro.tanaka@example.com", // 従業員のメールアドレス
        IsInTerm:true,
      },
      LocationID: 201, // 配置先ID
      Location: {
        ID: 201, // 配置先の識別番号
        LocationID: 201, // 配置先の詳細識別番号
        ClientID: 301, // クライアントID
        ClientName: "株式会社サンプルクライアント", // クライアントの正式名称
        LocationName: "東京本社", // 配置先の正式名称
      },
      PostID: 401, // 勤務ポストID
      Post: {
        PostID: 401, // 勤務ポストの詳細識別番号
        PostName: "エンジニア", // 勤務ポストの名前
      },
      TimeRecords: [
        {
          ID: 501, // 打刻の識別番号
          ManageID: 1, // 管理実績番号
          PlanNo: PlanNo.HOME_DEPARTURE, // 計画番号：出発報告
          PlanTime: "2024-04-01T08:00:00Z", // 計画時刻：2024年4月1日8時
          ResultTime: "2024-04-01T08:05:00Z", // 結果時刻：2024年4月1日8時5分
          IsAlert: false, // アラートフラグ：アラートなし
          PreAlert: true, // 事前アラートフラグ：事前アラートあり
          IsOver: false, // 予定時刻超過フラグ：超過なし
          IsIgnore: false, // 無視フラグ：無視していない
          IsComplete: false, // 完了フラグ：完了していない
          PreAlertIgnore: false, // 事前アラート無視フラグ：無視していない
        },
        {
          ID: 502,
          ManageID: 1,
          PlanNo: PlanNo.START, // 計画番号：上番報告
          PlanTime: "2024-04-02T09:00:00Z",
          ResultTime: "", // 結果時刻：未報告
          IsAlert: false, // アラートフラグ：アラートあり
          PreAlert: false, // 事前アラートフラグ：事前アラートなし
          IsOver: false,
          IsIgnore: false,
          IsComplete: false,
          PreAlertIgnore: false,
        },
      ],
      Description: "通常勤務", // 説明：通常勤務
      EarlyOverTime: 0.5, // 出勤前残業時間：0.5時間（30分）
      LunchBreakWorkTime: 1.0, // 昼残業時間：1時間
      ExtraHours: 2.0, // 退勤時の残業時��：2時間
    },
    {
      ManageID: 2,
      EmpID: 102,
      Emp: {
        EmpID: 102,
        Name: "佐藤花子",
        Email: "hanako.sato@example.com",
        IsInTerm:true,
      },
      LocationID: 201, // 配置先ID
      Location: {
        ID: 201,
        LocationID: 201,
        ClientID: 301,
        ClientName: "株式会社サンプルクライアント",
        LocationName: "東京本社",
      },
      PostID: 401,
      Post: {
          PostID: 401,
        PostName: "エンジニア",
      },
      TimeRecords: [
        {
          ID: 503,
          ManageID: 2,
          PlanNo: PlanNo.REACH, // 計画番号：到着報告
          PlanTime: "2024-04-02T09:00:00Z",
          ResultTime: "",
          IsAlert: false,
          PreAlert: true,
          IsOver: false,
          IsIgnore: false,
          IsComplete: false,
          PreAlertIgnore: false,
        },
        {
          ID: 504,
          ManageID: 2,
          PlanNo: PlanNo.FINISH, // 計画番号：下番報告
          PlanTime: "2024-04-02T17:00:00Z",
          ResultTime: "2024-04-02T17:15:00Z",
          IsAlert: true,
          PreAlert: false,
          IsOver: true,
          IsIgnore: false,
          IsComplete: false,
          PreAlertIgnore: false,
        },
      ],
      Description: "プロジェクトデザイン",
      EarlyOverTime: 0,
      LunchBreakWorkTime: 0.5,
      ExtraHours: 1.5,
    },
    // その他の既存レコード...

    // 新しいサンプルレコードの追加
    {
      ManageID: 21, // 新しい管理実績番号
      EmpID: 121, // 新しい従業員ID
      Emp: {
        EmpID: 121, // 従業員の識別番号
        Name: "松本二郎", // 従業員の名前
        Email: "jiro.matsumoto@example.com", // 従業員のメールアドレス
        IsInTerm:true,
      },
      LocationID: 301, // 同じ配置先ID
      Location: {
        ID: 301, // 配置先の識別番号
        LocationID: 301, // 配置先の詳細識別番号
        ClientID: 401, // 同じクライアントID
        ClientName: "株式会社同一クライアント", // クライアントの正式名称
        LocationName: "大阪本社", // 配置先の正式名称
      },
      PostID: 502,
      Post: {
        PostID: 502,
        PostName: "デザイナー",
      },
      TimeRecords: [
        {
          ID: 601, // 打刻の識別番号
          ManageID: 21, // 管理実績番号
          PlanNo: PlanNo.HOME_DEPARTURE, // 計画番号：出発報告
          PlanTime: "2024-04-21T08:00:00Z", // 同じ計画時刻
          ResultTime: "", // 結果時刻
          IsAlert: false, // アラートフラグ：アラートなし
          PreAlert: false, // 事前アラートフラグ：事前アラートなし
          IsOver: false, // 予定時刻超過フラグ：超過なし
          IsIgnore: false, // 無視フラグ：無視していない
          IsComplete: false, // 完了フラグ：完了していない
          PreAlertIgnore: false, // 事前アラート無視フラグ：無視していない
        },
        {
          ID: 602,
          ManageID: 21,
          PlanNo: PlanNo.START, // 計画番号：上番報告
          PlanTime: "2024-04-21T09:00:00Z",
          ResultTime: "",
          IsAlert: false,
          PreAlert: false,
          IsOver: false,
          IsIgnore: false,
          IsComplete: false,
          PreAlertIgnore: false,
        },
      ],
      Description: "新規プロジェクト",
      EarlyOverTime: 0.0,
      LunchBreakWorkTime: 1.0,
      ExtraHours: 2.0,
    },
    {
      ManageID: 22,
      EmpID: 122,
      Emp: {
        EmpID: 122,
        Name: "山田三郎",
        Email: "saburo.yamada@example.com",
        IsInTerm:true,
      },
      LocationID: 301, // 同じ配置先ID
      Location: {
        ID: 301,
        LocationID: 301,
        ClientID: 401, // 同じクライアントID
        ClientName: "株式会社同一クライアント",
        LocationName: "大阪本社",
      },
      PostID: 502,
      Post: {
        PostID: 502,
        PostName: "デザイナー",
      },
      TimeRecords: [
        {
          ID: 603,
          ManageID: 22,
          PlanNo: PlanNo.HOME_DEPARTURE,
          PlanTime: "2024-04-21T08:00:00Z", // 同じ計画時刻
          ResultTime: "",
          IsAlert: false,
          PreAlert: false,
          IsOver: false,
          IsIgnore: false,
          IsComplete: false,
          PreAlertIgnore: false,
        },
        {
          ID: 604,
          ManageID: 22,
          PlanNo: PlanNo.START,
          PlanTime: "2024-04-21T09:00:00Z",
          ResultTime: "2024-04-21T09:00:00Z",
          IsAlert: false,
          PreAlert: false,
          IsOver: false,
          IsIgnore: false,
          IsComplete: false,
          PreAlertIgnore: false,
        },
      ],
      Description: "デザイン作業",
      EarlyOverTime: 0.0,
      LunchBreakWorkTime: 1.0,
      ExtraHours: 2.0,
    },
    // 必要に応じてさらにサンプルを追加できます
];