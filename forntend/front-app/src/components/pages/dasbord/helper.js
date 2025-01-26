var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
export var PlanNames = new Map();
PlanNames.set(1, "自宅 出発時刻");
PlanNames.set(2, "現場 到着時刻");
PlanNames.set(3, "上番時刻");
PlanNames.set(4, "下番時刻");
// 同じ計画番号のレコードを取得する
export function GetGroupMemberRecord(record, records) {
    var _a, _b, _c, _d, _e, _f;
    if (!record) {
        return [];
    }
    var PlanNo = record.timeRecord.PlanNo;
    var PlanTime = new Date(record.timeRecord.PlanTime);
    var ClinetID = (_b = (_a = record.locationRecord) === null || _a === void 0 ? void 0 : _a.ClientID) !== null && _b !== void 0 ? _b : -1;
    var LocationID = (_d = (_c = record.locationRecord) === null || _c === void 0 ? void 0 : _c.LocationID) !== null && _d !== void 0 ? _d : -1;
    var EmployeeID = (_f = (_e = record.employeeRecord) === null || _e === void 0 ? void 0 : _e.EmpID) !== null && _f !== void 0 ? _f : -1;
    if (EmployeeID === -1 || LocationID === -1 || PlanNo === -1 || PlanTime === null || ClinetID === -1) {
        console.log("GetGroupMemberRecord in function", EmployeeID, LocationID, PlanNo, PlanTime);
        return [];
    }
    var result = records.filter(function (item) {
        var _a, _b, _c, _d;
        // const itemEmpID:number = item.employeeRecord?.EmpID ?? 0;
        var itemLocationID = (_b = (_a = item.locationRecord) === null || _a === void 0 ? void 0 : _a.LocationID) !== null && _b !== void 0 ? _b : -1;
        var itemPlanNo = item.timeRecord.PlanNo;
        var itemPlanTime = new Date(item.timeRecord.PlanTime);
        var itemClientID = (_d = (_c = item.locationRecord) === null || _c === void 0 ? void 0 : _c.ClientID) !== null && _d !== void 0 ? _d : -1;
        // if (itemEmpID === EmployeeID) return false;//同一社員はする無視する、
        if (itemClientID !== ClinetID)
            return false; //別の依頼元であれば無視、
        if (itemLocationID !== LocationID)
            return false; //別の場所であれば無視、
        if (PlanNo in [1, 2])
            return false; //出発報告と到着報告に関しては同一打刻の対象外
        if (itemPlanNo !== PlanNo)
            return false; //同一計画番号は無視しない、
        if (itemPlanTime.getTime() !== PlanTime.getTime())
            return false; //同一計画時刻は無視しない、
        return true;
    });
    return result;
}
export var NewCompleteTimeRecord = function (oldRecord, CompletedTime) {
    return __assign(__assign({}, oldRecord), { IsComplete: true, ResultTime: CompletedTime });
};
