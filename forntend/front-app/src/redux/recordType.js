//----------------------------[ユーザー]--------------------------------------------
//----------------------------[配置先]--------------------------------------------
//打刻のデータ PlanNo 1 =>出発報告 2 =>到着報告 3 =>上番報告 4 =>下番報告
export var PlanNo;
(function (PlanNo) {
    PlanNo[PlanNo["HOME_DEPARTURE"] = 1] = "HOME_DEPARTURE";
    PlanNo[PlanNo["REACH"] = 2] = "REACH";
    PlanNo[PlanNo["START"] = 3] = "START";
    PlanNo[PlanNo["FINISH"] = 4] = "FINISH";
})(PlanNo || (PlanNo = {}));
//+++++++++++++++++++++++++++++++++++++++++++++++++++++
