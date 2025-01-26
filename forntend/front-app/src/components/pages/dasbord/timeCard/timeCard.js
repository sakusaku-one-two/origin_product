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
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '../../../ui/card';
import { useSetSelectedRecords } from '../../../../hooks';
import { useTimeDispatch } from '../../../../hooks';
import { UPDATE as UPDATE_TIME_RECORD, DELETE as DELETE_TIME_RECORD } from '../../../../redux/slices/timeSlice';
import { motion } from 'framer-motion';
import { PlanNames } from '../helper';
import { Button } from '../../../ui/button';
import { SetAlertAnimation } from './cardHelper';
import { CardType } from './cardHelper';
var PlanName = function (planNo) {
    return PlanNames.get(planNo);
};
//日付の文字列を日付フォーマット文字列に変換
export var ShowTime = function (raw_time) {
    var time = raw_time instanceof Date ? raw_time : new Date(raw_time);
    var month = String(time.getMonth() + 1).padStart(2, '0');
    var day = String(time.getDate()).padStart(2, '0');
    var hours = String(time.getHours()).padStart(2, '0');
    var miuntes = String(time.getMinutes()).padStart(2, '0');
    return "".concat(month, "/").concat(day, " ").concat(hours, ":").concat(miuntes);
};
var TimeCard = function (_a) {
    var record = _a.record, cardType = _a.cardType;
    var dispatch = useTimeDispatch();
    // const selectedRecord = useSelectedRecordsSelector();
    var setSelectedRecords = useSetSelectedRecords().setSelectedRecords;
    var timeRecord = record.timeRecord;
    var employeeRecord = record.employeeRecord;
    var locationRecord = record.locationRecord;
    var postRecord = record.postRecord;
    var isSelectedSelf = cardType === CardType.ControlPanel;
    var isPlanOnTime = timeRecord.IsComplete ? "bg-green-500" : "bg-red-500";
    var handleOnTimeRecord = function () {
        var updatedTimeRecord = __assign(__assign({}, timeRecord), { IsComplete: true, ResultTime: timeRecord.PlanTime });
        dispatch(UPDATE_TIME_RECORD(updatedTimeRecord));
    };
    var handleIgnore = function () {
        var updatedTimeRecord = __assign(__assign({}, timeRecord), { IsIgnore: true });
        dispatch(UPDATE_TIME_RECORD(updatedTimeRecord));
    };
    var handlePreAlertIgnore = function () {
        var updatedTimeRecord = __assign(__assign({}, timeRecord), { PreAlertIgnore: true });
        dispatch(UPDATE_TIME_RECORD(updatedTimeRecord));
    };
    var handleAlertIgnore = function () {
        if (timeRecord.IsAlert) {
            handleIgnore();
        }
        else {
            handlePreAlertIgnore();
        }
    };
    var handleSelect = function () {
        if (isSelectedSelf) {
            setSelectedRecords(null);
            return;
        }
        setSelectedRecords(null);
        setTimeout(function () {
            setSelectedRecords(record);
        }, 100);
    };
    //アラート状態の場合
    // if (timeRecord.IsAlert && !timeRecord.IsComplete && !timeRecord.IsIgnore) {
    //     return (
    //         <motion.div
    //             layoutId={timeRecord.ID.toString()}
    //             key={timeRecord.ID.toString()}
    //             animate={{ scale: 1, opacity: 1 }}
    //             exit={{ scale: 0.8, opacity: 0 }}
    //             transition={{ duration: 0.3 }}
    //             className='h-full'
    //         >
    //         </motion.div> 
    //     );
    // };
    return (React.createElement(motion.div, { layoutId: timeRecord.ID.toString(), key: timeRecord.ID.toString(), animate: { scale: 1, opacity: 1 }, exit: { scale: 0.8, opacity: 0 }, transition: { duration: 0.3 }, className: 'h-full' },
        React.createElement(Card, { className: "w-full h-full hover:bg-gray-200 transition-colors duration-300 ".concat(SetAlertAnimation(record)), onClick: handleSelect },
            React.createElement(CardHeader, null,
                React.createElement(CardDescription, { className: "text-sm text-gray-500" },
                    PlanName(timeRecord === null || timeRecord === void 0 ? void 0 : timeRecord.PlanNo),
                    " ",
                    ShowTime(timeRecord === null || timeRecord === void 0 ? void 0 : timeRecord.PlanTime),
                    " ", postRecord === null || postRecord === void 0 ? void 0 :
                    postRecord.PostName,
                    " id:",
                    timeRecord.ID),
                React.createElement(CardTitle, { className: "text-lg font-semibold" }, employeeRecord === null || employeeRecord === void 0 ? void 0 : employeeRecord.Name)),
            React.createElement(CardContent, null,
                isSelectedSelf && (React.createElement("div", { className: "flex justify-center items-center space-x-4 mt-4" },
                    React.createElement(Button, { onClick: handleOnTimeRecord, className: "px-4 py-2 text-white rounded hover:bg-blue-600 transition-colors duration-300 ".concat(isPlanOnTime) }, "\u5B9A\u6642\u6253\u523B"),
                    React.createElement(Button, { onClick: function () { return dispatch(DELETE_TIME_RECORD(timeRecord)); }, className: "px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-300" }, "\u6253\u523B\uFF08\u6307\u5B9A\uFF09"),
                    React.createElement(Button, { onClick: handleAlertIgnore, className: "px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-300" }, "\u30A2\u30E9\u30FC\u30C8\u7121\u8996"))),
                React.createElement(CardDescription, { className: "mt-2 text-sm text-gray-600" }, locationRecord === null || locationRecord === void 0 ? void 0 : locationRecord.LocationName)))));
};
export default TimeCard;
