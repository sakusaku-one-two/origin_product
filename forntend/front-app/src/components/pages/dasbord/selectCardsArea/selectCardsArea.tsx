import React, {useState,useEffect} from "react";
import { AnimatePresence } from "framer-motion";
import {
    ResizablePanelGroup,
    ResizablePanel,
    ResizableHandle
} from '@/components/ui/resizable'
import { TimeRecordWithOtherRecord,
         useGetWaitingTimeRecordsWithOtherRecord,
        useGetAlertTimeRecordsWithOtherRecord,
        useGetPreAlertTimeRecordsWithOtherRecord, 
        useGetIgnoreTimeRecordsWithOtherRecord} from "@/hooks";
import { GetGroupMemberRecord } from "../helper";
import { useRecoilState } from "recoil";
import { SelectedRecord } from "@/state/selectedRecord";
import TimeCard from "../timeCard"; 
import { FindDialogOpen } from "@/state/openClose";
import { useTimeDispatch } from "@/hooks";
import { TimeRecord } from "@/redux/recordType";
import {UPDATE as UPDATE_TIME_RECORD } from '@/redux/slices/timeSlice'
import { ScrollArea,ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import FindTask from "@/components/pages/find/find";
import SubTimeRecord from "../subTimeRecord";

// 下部のカード選択エリア
export const SelectCardsArea:React.FC = () => {
    // カード選択エリアのデータを取得

    const [FindOpen,setFindOpen] = useRecoilState(FindDialogOpen);
    const [targetRecord,setTargetRecord] = useRecoilState(SelectedRecord);
    const records:TimeRecordWithOtherRecord[] = useGetWaitingTimeRecordsWithOtherRecord();
    const alertRecords:TimeRecordWithOtherRecord[] = useGetAlertTimeRecordsWithOtherRecord();
    const preAlertRecords:TimeRecordWithOtherRecord[] = useGetPreAlertTimeRecordsWithOtherRecord();
    const ignoreRecords:TimeRecordWithOtherRecord[] = useGetIgnoreTimeRecordsWithOtherRecord();
    const groupMemberRecords:TimeRecordWithOtherRecord[] = GetGroupMemberRecord(targetRecord.record,records.concat(alertRecords,preAlertRecords,ignoreRecords));
    const [
      groupMemberRecordsState,
      setGroupMemberRecordsState
      ] = useState<TimeRecordWithOtherRecord[]>(groupMemberRecords);
  
    const dispatch = useTimeDispatch();
  
    useEffect(()=>{
      setGroupMemberRecordsState(groupMemberRecords);
    },[targetRecord.record]);
  
  
    const FindDailogHandler = () => {
      setFindOpen(!FindOpen);
    };
  
    const GroupTimeRegistory = (trancerateFunction:(target:TimeRecord)=> TimeRecord) => {
    
      groupMemberRecordsState.forEach((record:TimeRecordWithOtherRecord)=>{
        const new_time = trancerateFunction(record.timeRecord);
        dispatch(UPDATE_TIME_RECORD(new_time));
      });
  
      if(targetRecord.record){
          const timeRecord = targetRecord.record.timeRecord;
          const new_time = trancerateFunction(timeRecord);
          dispatch(UPDATE_TIME_RECORD(new_time));
          setTargetRecord({
            isSelected:false,
            record:null
          });
      }
    };
  
    
    
    return (
        <>
         <ResizablePanelGroup
                direction="horizontal"
                className="min-h-[500px] max-w-full rounded-lg border"
              >
                <ResizablePanel defaultSize={75}>
                    <ResizablePanelGroup direction="vertical">
                        <ResizablePanel defaultSize={25}>
                            
                            <AnimatePresence > 
                            {targetRecord.record && (
                                <TimeCard record={targetRecord.record}/>
                            
                                )}
                            </AnimatePresence>
                            
                        </ResizablePanel>
                        <ResizableHandle />
                        <ResizablePanel defaultSize={75}>
                            { 
                                groupMemberRecordsState.map((record:TimeRecordWithOtherRecord)=>(
                                    <SubTimeRecord record={record}/>
                                ))
                            }
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel defaultSize={25}>
                <ScrollArea className='h-[500px] bg-slate-100'>
                     <div className='sticky top-0 z-50
                        w-full border-border/40 bg-background/95 bg-blue-500
                        backdrop-blur supports-[backdrop-filter]:bg-background/60'>
                            <Button className='inline-flex items-center gap-2 whitespace-nowrap transition-colors
                          focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring 
                          disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none 
                          [&_svg]:size-4 [&_svg]:shrink-0 border border-input hover:bg-accent 
                          hover:text-accent-foreground px-4 py-2 relative h-8 w-full 
                          justify-start rounded-[0.5rem] bg-muted/50 text-sm font-normal 
                          text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64'
                          onClick={FindDailogHandler}>
                          打刻の検索 {<FindTask/>}
          </Button>
          </div>
          
          <ScrollBar orientation='horizontal' />
            {ignoreRecords.length >=1 ? <h5>アラート無視状態:{ignoreRecords.length}件</h5>: ''}
                {
                    ignoreRecords.map((record:TimeRecordWithOtherRecord) => {
                        return (
                            <TimeCard record={record}/>
                        );
                    })
                }

                
                {records.length >=1 ? <h5>未報告:{records.length}件</h5>: <h1>勤怠データをアップロードしてください。</h1>}
                {records.map((record :TimeRecordWithOtherRecord) => (

                    <TimeCard record={record}/>  
                
                ))}
                
          </ScrollArea>
                   

                </ResizablePanel>
              </ResizablePanelGroup>

        </>
    );        
};

export default SelectCardsArea;