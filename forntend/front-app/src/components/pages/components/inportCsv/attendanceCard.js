import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
var AttendanceCard = function (_a) {
    var record = _a.record;
    return (React.createElement(Card, null,
        React.createElement(CardHeader, null,
            React.createElement(CardTitle, null, record.Emp.Name),
            React.createElement(CardDescription, null, record.TimeRecords[0].PlanTime.toString()),
            React.createElement(CardDescription, null, record.Post.PostName)),
        React.createElement(CardContent, null, record.TimeRecords.map(function (timeRecord, index) { return (React.createElement("p", { key: index }, timeRecord.PlanTime.toString())); }))));
};
export default AttendanceCard;
