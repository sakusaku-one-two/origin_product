import React from "react";
import AttendanceCard from "./attendanceCard";
export var DuplicateRecord = function (_a) {
    var recordFromCsv = _a.recordFromCsv, recordFromDb = _a.recordFromDb;
    return (React.createElement("div", { className: 'flex flex-col items-center justify-center' },
        React.createElement(AttendanceCard, { record: recordFromCsv }),
        React.createElement(AttendanceCard, { record: recordFromDb })));
};
