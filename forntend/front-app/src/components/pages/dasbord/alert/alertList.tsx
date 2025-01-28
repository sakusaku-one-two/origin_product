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

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
 



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

        let SpeakDo:boolean = false;
        let speakText:string = '';
        if (alertRecords.length > 0) {
            SpeakDo = true;
            GetSounds(SoundsName.alert).play();
            speakText =  CreateSpeakText(
                "報告期限切れです。至急確認してください。"
                ,alertRecords
              );
        } else {
            GetSounds(SoundsName.alert).stop();
            
        }

        if (preAlertRecords.length > 0 ) {
          SpeakDo = true;
          GetSounds(SoundsName.preAlert).play();
            speakText = `${speakText} ${CreateSpeakText(
              "報告5分前になりました。",
              preAlertRecords
            )}` 
        } else {
          GetSounds(SoundsName.preAlert).stop();
          
        }
        
        if (SpeakDo) {
          GetSounds(SoundsName.speach).speak(speakText);
        } else {
          GetSounds(SoundsName.speach).stop();
        }
        

    }, [alertRecords,preAlertRecords]);
    
    return (
        <ResizablePanelGroup
        direction="vertical"
        className="min-h-[300px] max-w-full rounded-lg border md:min-w-[450px]"
      >
        <ResizablePanel defaultSize={50}>
            <Carousel
              opts={{
                loop: true,
                align: "start",
                
              }}
              className="w-full h-full"
            >
              <CarouselContent>
              {preAlertRecords.length > 0 && preAlertRecords.map((preRecord) => {
                return (
                    <CarouselItem key={preRecord.timeRecord.ID} className="md:basis-1/2 lg:basis-1/3">
                    <TimeCard record={preRecord} cardType={CardType.PreAlertIgnore} />
                    </CarouselItem>
                );
              })}
              {preAlertRecords.length === 0 && <div className="w-full h-full">
                <h1 className="text-2xl font-bold text-center">報告5分前はありません。</h1>
              </div>}
              
              
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50}>
            <Carousel
              opts={{
                loop: true,
                align: "start",
                
              }}
              className="w-full h-full"
            >
              <CarouselContent>
              { alertRecords.length > 0 && alertRecords.map((alertRecord) => {
                return (
                  <CarouselItem key={alertRecord.timeRecord.ID} className="md:basis-1/2 lg:basis-1/3">
                  <TimeCard record={alertRecord} cardType={CardType.Alert} />
                  </CarouselItem>
                );
              })}
              {alertRecords.length === 0 && <div className="w-full h-full">
                <h1 className="text-2xl font-bold text-center">報告期限切れはありません。</h1>
              </div>}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
        </ResizablePanel>
      </ResizablePanelGroup>
    );
};