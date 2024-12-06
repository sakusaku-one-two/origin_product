import React ,{ useEffect,useCallback } from "react";
import { TimeRecordWithOtherRecord, useGetAlertTimeRecordsWithOtherRecord,useGetPreAlertTimeRecordsWithOtherRecord } from "../../../../hooks";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup
  } from '../../../ui/resizable';
import  TimeCard  from "../timeCard";
import GetSounds, { SoundsName } from "../../../../sounds/GetSounds";

export const AlertList:React.FC = () => {
    const alertRecords:TimeRecordWithOtherRecord[] = useGetAlertTimeRecordsWithOtherRecord();
    const preAlertRecords:TimeRecordWithOtherRecord[] = useGetPreAlertTimeRecordsWithOtherRecord();

    const alertSound = useCallback(()=> GetSounds(SoundsName.alert),[]);
    const preAlertSound = useCallback(() => GetSounds(SoundsName.preAlert),[]);
    useEffect(() => {


        if (alertRecords.length > 0) {
            alertSound().play();
        } else {
            alertSound().stop();
        }
        if (preAlertRecords.length > 0 ) {
          preAlertSound().play();
        } else {
          preAlertSound().stop();
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