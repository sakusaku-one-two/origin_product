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
import React, { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { useGetWaitingTimeRecordsWithOtherRecord, useGetAlertTimeRecordsWithOtherRecord, useGetPreAlertTimeRecordsWithOtherRecord, useGetIgnoreTimeRecordsWithOtherRecord, useGetPreAlertIgnoreTimeRecordsWithOtherRecord } from "@/hooks";
import { GetGroupMemberRecord } from "../helper";
import { useRecoilState } from "recoil";
import TimeCard from "../timeCard/timeCard";
import { FindDialogOpen } from "@/state/openClose";
import { useTimeDispatch } from "@/hooks";
import { UPDATE as UPDATE_TIME_RECORD } from '@/redux/slices/timeSlice';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import FindTask from "@/components/pages/find/find";
import SubTimeRecord from "../subTimeRecord";
import { useSetSelectedRecords, useSelectedRecordsSelector } from "@/hooks";
import { CardType } from "../timeCard/cardHelper";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, } from "@/components/ui/carousel";
// 下部のカード選択エリア
export var SelectCardsArea = function () {
    // カード選択エリアのデータを取得
    var _a = useRecoilState(FindDialogOpen), FindOpen = _a[0], setFindOpen = _a[1];
    var setSelectedRecords = useSetSelectedRecords().setSelectedRecords;
    var selectedRecord = useSelectedRecordsSelector();
    var records = useGetWaitingTimeRecordsWithOtherRecord();
    var alertRecords = useGetAlertTimeRecordsWithOtherRecord();
    var preAlertRecords = useGetPreAlertTimeRecordsWithOtherRecord();
    var ignoreRecords = useGetIgnoreTimeRecordsWithOtherRecord();
    var preAlertIgnoreRecords = useGetPreAlertIgnoreTimeRecordsWithOtherRecord();
    var groupMemberRecords = GetGroupMemberRecord(selectedRecord, records.concat(alertRecords, preAlertRecords, ignoreRecords, preAlertIgnoreRecords));
    var _b = useState(groupMemberRecords), groupMemberRecordsState = _b[0], setGroupMemberRecordsState = _b[1];
    var dispatch = useTimeDispatch();
    //変更があれば自動で更新
    useEffect(function () {
        setGroupMemberRecordsState(groupMemberRecords);
    }, [selectedRecord]);
    var FindDailogHandler = function () {
        setFindOpen(!FindOpen);
    };
    var GroupTimeRegistory = function (trancerateFunction) {
        groupMemberRecordsState.forEach(function (record) {
            if (record.isSelected) {
                var new_time = trancerateFunction(record.timeRecord);
                dispatch(UPDATE_TIME_RECORD(new_time));
            }
        });
        if (selectedRecord) {
            var timeRecord = selectedRecord.timeRecord;
            var new_time = trancerateFunction(timeRecord);
            dispatch(UPDATE_TIME_RECORD(new_time));
            setSelectedRecords(null);
        }
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(ResizablePanelGroup, { direction: "horizontal", className: "min-h-[600px] max-w-full rounded-lg border" },
            React.createElement(ResizablePanel, { defaultSize: 75 },
                React.createElement(ResizablePanelGroup, { direction: "vertical" },
                    React.createElement(ResizablePanel, { defaultSize: 25 },
                        React.createElement(AnimatePresence, null, selectedRecord && (React.createElement(TimeCard, { record: selectedRecord, cardType: CardType.ControlPanel })))),
                    React.createElement(ResizableHandle, null),
                    React.createElement(ResizablePanel, { defaultSize: 15 },
                        React.createElement("div", null,
                            React.createElement(Button, { className: "w-full", onClick: function () { return GroupTimeRegistory(function (target) {
                                    return __assign(__assign({}, target), { IsComplete: true, ResultTime: target.PlanTime });
                                }); } }, "\u5B9A\u6642\u6253\u523B\uFF08\u4E00\u62EC\uFF09"))),
                    React.createElement(ResizableHandle, null),
                    React.createElement(ResizablePanel, { defaultSize: 60 }, groupMemberRecordsState.map(function (record) { return (React.createElement(SubTimeRecord, { record: record })); })))),
            React.createElement(ResizableHandle, null),
            React.createElement(ResizablePanel, { defaultSize: 30 },
                React.createElement(ScrollArea, { className: 'h-[800px] bg-slate-100' },
                    React.createElement("div", { className: 'sticky top-0 z-50\n                        w-full border-border/40 bg-background/95 bg-blue-500\n                        backdrop-blur supports-[backdrop-filter]:bg-background/60' },
                        React.createElement(Button, { className: 'inline-flex items-center gap-2 whitespace-nowrap transition-colors\n                          focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring \n                          disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none \n                          [&_svg]:size-4 [&_svg]:shrink-0 border border-input hover:bg-accent \n                          hover:text-accent-foreground px-4 py-2 relative h-8 w-full \n                          justify-start rounded-[0.5rem] bg-muted/50 text-sm font-normal \n                          text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64', onClick: FindDailogHandler },
                            "\u6253\u523B\u306E\u691C\u7D22 ",
                            React.createElement(FindTask, null))),
                    React.createElement(ScrollBar, { orientation: 'horizontal', className: "" }),
                    React.createElement(Carousel, { opts: {
                            loop: true,
                            align: "start",
                        }, orientation: "vertical", className: "w-full h-full" },
                        React.createElement(CarouselContent, null,
                            preAlertIgnoreRecords.length >= 1 ? React.createElement("h5", { className: "text-center pt-4" },
                                "5\u5206\u524D\u30A2\u30E9\u30FC\u30C8\u7121\u8996\u72B6\u614B:",
                                preAlertIgnoreRecords.length,
                                "\u4EF6") : '',
                            preAlertIgnoreRecords.map(function (record) {
                                return (React.createElement(CarouselItem, { key: record.timeRecord.ID, className: "md:basis-1/2 lg:basis-1/3" },
                                    React.createElement(TimeCard, { record: record, cardType: CardType.PreAlertIgnore })));
                            }),
                            ignoreRecords.length >= 1 ? React.createElement("h5", { className: "text-center pt-4" },
                                "\u30A2\u30E9\u30FC\u30C8\u7121\u8996\u72B6\u614B:",
                                ignoreRecords.length,
                                "\u4EF6") : '',
                            ignoreRecords.map(function (record) {
                                return (React.createElement(CarouselItem, { key: record.timeRecord.ID, className: "md:basis-1/2 lg:basis-1/3" },
                                    React.createElement(TimeCard, { record: record, cardType: CardType.Ignore })));
                            }),
                            records.length >= 1 ? React.createElement("h5", { className: "text-center pt-4" },
                                "\u672A\u5831\u544A:",
                                records.length,
                                "\u4EF6") : React.createElement("h1", { className: "text-center pt-4" }, "\u52E4\u6020\u30C7\u30FC\u30BF\u3092\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u3057\u3066\u304F\u3060\u3055\u3044\u3002"),
                            records.map(function (record) { return (React.createElement(CarouselItem, { key: record.timeRecord.ID, className: "md:basis-1/2 lg:basis-1/3" },
                                React.createElement(TimeCard, { record: record, cardType: CardType.Wait }))); })),
                        React.createElement(CarouselPrevious, null),
                        React.createElement(CarouselNext, null)))))));
};
export default SelectCardsArea;
