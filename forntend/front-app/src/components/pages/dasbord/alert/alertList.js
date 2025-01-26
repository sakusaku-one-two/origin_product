import React, { useEffect } from "react";
import { useGetAlertTimeRecordsWithOtherRecord, useGetPreAlertTimeRecordsWithOtherRecord } from "../../../../hooks";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '../../../ui/resizable';
import TimeCard from "../timeCard/timeCard";
import GetSounds, { SoundsName } from "../../../../sounds/GetSounds";
import { CardType } from "../timeCard/cardHelper";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, } from "@/components/ui/carousel";
var CreateSpeakText = function (prefix, argRecords) {
    var result = "".concat(prefix);
    argRecords.forEach(function (value) {
        var emp = value.employeeRecord;
        if (emp) {
            result = "".concat(result, "  ").concat(emp.Name);
        }
    });
    return "".concat(result, " \u306E\u5831\u544A\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002");
};
export var AlertList = function () {
    var alertRecords = useGetAlertTimeRecordsWithOtherRecord();
    var preAlertRecords = useGetPreAlertTimeRecordsWithOtherRecord();
    useEffect(function () {
        var SpeakDo = false;
        var speakText = '';
        if (alertRecords.length > 0) {
            SpeakDo = true;
            GetSounds(SoundsName.alert).play();
            speakText = CreateSpeakText("報告期限切れです。至急確認してください。", alertRecords);
        }
        else {
            GetSounds(SoundsName.alert).stop();
        }
        if (preAlertRecords.length > 0) {
            SpeakDo = true;
            GetSounds(SoundsName.preAlert).play();
            speakText = "".concat(speakText, " ").concat(CreateSpeakText("報告5分前になりました。", preAlertRecords));
        }
        else {
            GetSounds(SoundsName.preAlert).stop();
        }
        if (SpeakDo) {
            GetSounds(SoundsName.speach).speak(speakText);
        }
        else {
            GetSounds(SoundsName.speach).stop();
        }
    }, [alertRecords, preAlertRecords]);
    return (React.createElement(ResizablePanelGroup, { direction: "vertical", className: "min-h-[300px] max-w-full rounded-lg border md:min-w-[450px]" },
        React.createElement(ResizablePanel, { defaultSize: 50 },
            React.createElement(Carousel, { opts: {
                    loop: true,
                    align: "start",
                }, className: "w-full h-full" },
                React.createElement(CarouselContent, null, preAlertRecords.map(function (preRecord) {
                    return (React.createElement(CarouselItem, { key: preRecord.timeRecord.ID, className: "md:basis-1/2 lg:basis-1/3" },
                        React.createElement(TimeCard, { record: preRecord, cardType: CardType.PreAlertIgnore })));
                })),
                React.createElement(CarouselPrevious, null),
                React.createElement(CarouselNext, null))),
        React.createElement(ResizableHandle, null),
        React.createElement(ResizablePanel, { defaultSize: 50 },
            React.createElement(Carousel, { opts: {
                    loop: true,
                    align: "start",
                }, className: "w-full h-full" },
                React.createElement(CarouselContent, null, alertRecords.map(function (alertRecord) {
                    return (React.createElement(CarouselItem, { key: alertRecord.timeRecord.ID, className: "md:basis-1/2 lg:basis-1/3" },
                        React.createElement(TimeCard, { record: alertRecord, cardType: CardType.Alert })));
                })),
                React.createElement(CarouselPrevious, null),
                React.createElement(CarouselNext, null)))));
};
