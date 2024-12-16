import React ,{ useEffect } from "react";
import { TimeRecordWithOtherRecord, useGetAlertTimeRecordsWithOtherRecord,useGetPreAlertTimeRecordsWithOtherRecord } from "../../../../hooks";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup
  } from '../../../ui/resizable';
import  TimeCard  from "../timeCard/timeCard";
import GetSounds, { SoundsName } from "../../../../sounds/GetSounds";
import { EmployeeRecord } from "@/redux/recordType";
import { CardType } from "../timeCard/cardHelper";

const CreateSpeakText = (prefix:string,argRecords:TimeRecordWithOtherRecord[]):string => {
  
  let result:string =  `${prefix}`
  argRecords.forEach((value) => {
    const emp:EmployeeRecord|null = value.employeeRecord as EmployeeRecord;
    if(emp){
      result = `${result}  ${emp.Name}`
    }
  });

  return `${result} の報告を確認してください。`
} ;


export const AlertList:React.FC = () => {
    const alertRecords:TimeRecordWithOtherRecord[] = useGetAlertTimeRecordsWithOtherRecord();
    const preAlertRecords:TimeRecordWithOtherRecord[] = useGetPreAlertTimeRecordsWithOtherRecord();

    
    useEffect(() => {

        let isSpeak:boolean = false;
        let speakText:string = '';
        if (alertRecords.length > 0) {
            isSpeak = true;
            GetSounds(SoundsName.alert).play();
            speakText =  CreateSpeakText(
                "報告期限切れです。至急確認してください。"
                ,alertRecords
              );
        } else {
            GetSounds(SoundsName.alert).stop();
        }

        if (preAlertRecords.length > 0 ) {
          isSpeak = true;
          GetSounds(SoundsName.preAlert).play();
            speakText = `${speakText} ${CreateSpeakText(
              "報告5分前になりました。",
              preAlertRecords
            )}` 
        } else {
          GetSounds(SoundsName.preAlert).stop();
        }
        
        if (isSpeak) {
          GetSounds(SoundsName.speach).speak(speakText);
        }
        

    }, [alertRecords,preAlertRecords]);
    
    return (
        <ResizablePanelGroup
        direction="vertical"
        className="min-h-[300px] max-w-full rounded-lg border md:min-w-[450px]"
      >
        <ResizablePanel defaultSize={50}>
          <div className="flex h-full w-full items-center justify-center p-6">
              {preAlertRecords.map((preRecord) => {
                return (
                    <TimeCard record={preRecord} cardType={CardType.PreAlertIgnore} />
                );
              })}
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50}>
            <div className="flex h-full w-full items-center justify-center p-6">
              { alertRecords.map((alertRecord) => {
                return (
                  <TimeCard record={alertRecord} cardType={CardType.Alert} />
                );
                })}
            </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    );
};