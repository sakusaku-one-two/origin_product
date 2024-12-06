import React ,{ useEffect,useCallback } from "react";
import { TimeRecordWithOtherRecord, useGetAlertTimeRecordsWithOtherRecord,useGetPreAlertTimeRecordsWithOtherRecord } from "../../../../hooks";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup
  } from '../../../ui/resizable';
import  TimeCard  from "../timeCard";
import GetSounds, { SoundsName } from "../../../../sounds/GetSounds";
import { EmployeeRecord } from "@/redux/recordType";


const CreateSpeakText = (prefix:string,argRecords:TimeRecordWithOtherRecord[]):string => {
  
  let result:string =  `${prefix}です`
  argRecords.forEach((value) => {
    const emp:EmployeeRecord = value.employeeRecord;
    result = `${result}  ${emp.Name}`
  });

  return `${result} の報告は確認してください。`
} ;


export const AlertList:React.FC = () => {
    const alertRecords:TimeRecordWithOtherRecord[] = useGetAlertTimeRecordsWithOtherRecord();
    const preAlertRecords:TimeRecordWithOtherRecord[] = useGetPreAlertTimeRecordsWithOtherRecord();

    const alertSound = useCallback(()=> GetSounds(SoundsName.alert),[]);
    const preAlertSound = useCallback(() => GetSounds(SoundsName.preAlert),[]);
    const speakSound = useCallback(() => GetSounds(SoundsName.speach),[]);
    useEffect(() => {

        let isSpeak:boolean = false;
        let speakText:string = '';
        if (alertRecords.length > 0) {
            isSpeak = true;
            alertSound().play();
            speakText =  CreateSpeakText(
                "報告期限切れです。至急"
                ,alertRecords
              );
        } else {
            alertSound().stop();
        }

        if (preAlertRecords.length > 0 ) {
          preAlertSound().play();
          
            speakText = `${speakText} ${CreateSpeakText(
              "報告5分前になりました。",
              preAlertRecords
            )}` 
        } else {
          preAlertSound().stop();
        }
        
        if (isSpeak) {
          speakSound().speak(speakText);
        }
        

    }, [alertRecords,preAlertRecords]);
    
    return (
        <ResizablePanelGroup
        direction="vertical"
        className="min-h-[300px] max-w-full rounded-lg border md:min-w-[450px]"
      >
        <ResizablePanel defaultSize={50}>
          <div className="flex h-full items-center justify-center p-6">
              {preAlertRecords.map((preRecord) => {
                return (
                    <TimeCard record={preRecord} />
                );
              })}
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50}>
          <div className="flex h-full items-center justify-center p-6">
            { alertRecords.map((alertRecord) => {
              return (
                <TimeCard record={alertRecord} />
              );
              })}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    );
};