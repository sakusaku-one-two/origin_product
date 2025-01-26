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
import React, { useState } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
// import {
//     Carousel,
//     CarouselContent,
//     CarouselItem,
//     CarouselNext,
//     CarouselPrevious,
//   } from "@/components/ui/carousel";
import AttendanceCard from './attendanceCard';
//CSVをサーバーに送るページ
var ImportPage = function () {
    //選択されたレコードを保持
    // const [isLeft,setIsLeft] = useState<boolean>(checkedData.IsLeft);
    var _a = useState({}), fromCsv = _a[0], setFromCsv = _a[1];
    var _b = useState({}), fromDb = _b[0], setFromDb = _b[1];
    var _c = useState([]), selectedRecord = _c[0], setSelectedRecord = _c[1];
    var SetCsvHandler = function (event) {
        if (!(event.target instanceof HTMLInputElement))
            return;
        if (!event.target.files)
            return;
        var file = event.target.files[0];
        var setCsv = function (data) { return __awaiter(void 0, void 0, void 0, function () {
            var formData, response, message, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        formData = new FormData();
                        formData.append('file', data);
                        console.log(formData);
                        return [4 /*yield*/, fetch('api/Csvcheck', {
                                method: 'POST',
                                // headers:{
                                //     "Content-Type":"multipart/form-data"
                                // },
                                body: formData, //formDataを送信(ファイルを送信するために必要)
                            })];
                    case 1:
                        response = _a.sent();
                        if (!!response.ok) return [3 /*break*/, 3];
                        alert("CSVに不備があります。");
                        return [4 /*yield*/, response.json()];
                    case 2:
                        message = _a.sent();
                        console.log(message);
                        return [2 /*return*/];
                    case 3: return [4 /*yield*/, response.json()];
                    case 4:
                        result = _a.sent();
                        // console.log("FromCsv",result.FromCsv,result.FromCsv.size);
                        // console.log("FromDb",result.FromDb,result.FromDb.size);
                        // console.log("UniqueRecord",result.UniqueRecord,result.UniqueRecord.length);
                        setFromCsv(result.FromCsv);
                        setFromDb(result.FromDb);
                        setSelectedRecord(result.UniqueRecord);
                        return [2 /*return*/];
                }
            });
        }); };
        setCsv(file);
    };
    var SetToDBHandler = function () { return __awaiter(void 0, void 0, void 0, function () {
        var response, message;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch('api/InsertRecords', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ insertRecords: selectedRecord }),
                    })];
                case 1:
                    response = _a.sent();
                    if (!!response.ok) return [3 /*break*/, 3];
                    alert("DBに登録に失敗しました。");
                    return [4 /*yield*/, response.json()];
                case 2:
                    message = _a.sent();
                    console.log(message);
                    return [2 /*return*/];
                case 3:
                    alert("DBに登録しました。");
                    return [2 /*return*/];
            }
        });
    }); };
    // const perseCsv = (dataFromCSV:string):string[][] => {
    //     return dataFromCSV.split('/r/n').map((row) => row.split(','));
    // };
    return (React.createElement("div", { className: '' },
        React.createElement("div", { className: '' },
            React.createElement("div", { className: 'mb-4' },
                React.createElement("input", { type: "file", accept: 'text/csv', onChange: SetCsvHandler, className: 'border border-gray-300 p-2 rounded' }))),
        React.createElement(ResizablePanelGroup, { direction: 'horizontal', className: 'h-full space-x-2' },
            React.createElement(ResizablePanel, { defaultSize: 30 },
                React.createElement("div", { className: 'flex flex-col items-center justify-center h-full' },
                    React.createElement("h1", { className: 'text-xl font-semibold mb-4' }, "CSV"),
                    fromCsv &&
                        Object.values(fromCsv).map(function (record) { return (React.createElement("div", { className: 'flex flex-col items-center justify-center mb-2 w-full', key: "".concat(record.ManageID, "-fromcsv") },
                            React.createElement("h1", { className: 'text-xl font-semibold mb-4' }, record.ManageID),
                            React.createElement(AttendanceCard, { record: record }))); }))),
            React.createElement(ResizableHandle, null),
            React.createElement(ResizablePanel, { defaultSize: 30 },
                React.createElement("div", { className: 'flex flex-col items-center justify-center h-full' },
                    React.createElement("h1", null, "DB"),
                    fromDb &&
                        Object.values(fromDb).map(function (record) { return (React.createElement("div", { className: 'flex flex-col items-center justify-center', key: "".concat(record.ManageID, "-fromdb") },
                            React.createElement(AttendanceCard, { record: record }))); }))),
            React.createElement(ResizableHandle, null),
            React.createElement(ResizablePanel, { defaultSize: 30 },
                React.createElement("div", { className: 'flex flex-col items-center justify-center h-full' },
                    React.createElement("h1", null, "Unique"),
                    React.createElement("button", { onClick: SetToDBHandler, className: 'mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600' }, "DB\u306B\u767B\u9332"),
                    selectedRecord.map(function (record) { return (React.createElement("div", { className: 'flex flex-col items-center justify-center', key: "".concat(record.ManageID, "-unique") },
                        React.createElement(AttendanceCard, { record: record }))); }))))));
};
export default ImportPage;
