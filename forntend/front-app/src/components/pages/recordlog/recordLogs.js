var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import React, { useState, useEffect } from 'react';
import { Table, TableHead, TableRow, TableHeader, TableCell } from '@/components/ui/table';
// Timeレコードログ
var dateToStr = function (date) {
    return date.toISOString().split('T')[0];
};
export default function RecordLogs() {
    var _this = this;
    var _a = useState(dateToStr(new Date())), endDate = _a[0], setEndDate = _a[1];
    var _b = useState([]), logRecords = _b[0], setLogRecords = _b[1];
    useEffect(function () {
        var fetchLogRecords = function () { return __awaiter(_this, void 0, void 0, function () {
            var response, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch('/api/logRecord', {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                endDate: endDate,
                            })
                        })];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = _a.sent();
                        setLogRecords(data.records);
                        return [2 /*return*/];
                }
            });
        }); };
        fetchLogRecords(); // ログレコードの取得
    }, [endDate]);
    return (React.createElement("div", null,
        React.createElement("input", { type: "date", value: endDate, onChange: function (e) { return setEndDate(e.target.value); } }),
        React.createElement(Table, null,
            React.createElement(TableHeader, null,
                React.createElement(TableRow, null,
                    React.createElement(TableHead, null,
                        React.createElement("h1", null, "\u793E\u54E1ID")),
                    React.createElement(TableHead, null,
                        React.createElement("h1", null, "\u8A08\u753BNo")),
                    React.createElement(TableHead, null,
                        React.createElement("h1", null, "\u5B9F\u65BD\u65E5")),
                    React.createElement(TableHead, null,
                        React.createElement("h1", null, "\u5B9F\u65BD\u6642\u9593")),
                    React.createElement(TableHead, null,
                        React.createElement("h1", null, "\u5B9F\u65BD\u5185\u5BB9"))),
                logRecords.map(function (log) { return (log.TimeRecords.map(function (record) { return (React.createElement(TableRow, { key: "".concat(record.ManageID, "-").concat(record.PlanNo) },
                    React.createElement(TableCell, null, log.EmpID),
                    React.createElement(TableCell, null, record.PlanNo),
                    React.createElement(TableCell, null, dateToStr(new Date(record.PlanTime))),
                    React.createElement(TableCell, null, dateToStr(new Date(record.ResultTime))),
                    React.createElement(TableCell, null, record.IsComplete ? '完了' : '未完了'))); })); })))));
}
