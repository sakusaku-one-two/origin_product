import {FC,useEffect,useState} from 'react'

import { useRecoilState } from 'recoil';  
import { FindDialogOpen } from '../../../state/openClose';
import { Button } from '../../ui/button';
import FindTask from '../find/find';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from '../../ui/resizable';
import { ScrollArea,ScrollBar } from "../../ui/scroll-area"
import { UPDATE as UPDATE_TIME_RECORD } from '../../../redux/slices/timeSlice';

import { TimeRecordWithOtherRecord,
         useGetWaitingTimeRecordsWithOtherRecord,
         useGetPreAlertTimeRecordsWithOtherRecord,
         useGetAlertTimeRecordsWithOtherRecord,
         useTimeDispatch } from '../../../hooks';

import { AnimatePresence } from "framer-motion";
import TimeCard from './timeCard/timeCard';
import { SelectedRecord } from '../../../state/selectedRecord';
import SubTimeRecord from './subTimeRecord';
import { GetGroupMemberRecord } from './helper';
import { TimeRecord } from '@/redux/recordType';



const DashBord:FC=() => {


  const [FindOpen,setFindOpen] = useRecoilState(FindDialogOpen);
  const [targetRecord,setTargetRecord] = useRecoilState(SelectedRecord);
  const records:TimeRecordWithOtherRecord[] = useGetWaitingTimeRecordsWithOtherRecord();
  const alertRecords:TimeRecordWithOtherRecord[] = useGetAlertTimeRecordsWithOtherRecord();
  const preAlertRecords:TimeRecordWithOtherRecord[] = useGetPreAlertTimeRecordsWithOtherRecord();
  const groupMemberRecords:TimeRecordWithOtherRecord[] = GetGroupMemberRecord(targetRecord.record,records.concat(alertRecords,preAlertRecords));
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
    <ResizablePanelGroup direction='vertical' className='max-w-full max-h-screen'>
    
      
        
        <ResizablePanel defaultSize={70}>
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel defaultSize={30} className='bg-slate-100'>
                  {/* 操作対象 */}
                  <AnimatePresence > 
                    {targetRecord.record && (
                        <TimeCard record={targetRecord.record}/>
                    
                  )}
                  </AnimatePresence>
              </ResizablePanel>
              
              <ResizableHandle />
                <ResizablePanel
                    defaultSize={30}
                    className='flex items-center justify-center h-full'
                >
                    <div className='flex-col justify-between px-10 h-hull'>
                    <Button onClick={() =>GroupTimeRegistory((target:TimeRecord)=>{
                      return {
                        ...target,
                        IsComplete:true,
                        ResultTime:target.PlanTime
                      }
                    })} className='hover:bg-slate-200 hover:text-slate-800 transition-colors duration-300'>
                      <span>同一勤務対象者を一括で打刻（予定時刻）</span>
                    </Button>
                    <span className='px-5'></span>
                    <Button onClick={() =>GroupTimeRegistory((target:TimeRecord)=>{
                      return {
                        ...target,
                        IsComplete:true,
                        ResultTime:target.ResultTime
                      }
                    })} className='hover:bg-slate-200 hover:text-slate-800 transition-colors duration-300'>
                      <span>同一勤務対象者を一括で打刻（打刻時刻）</span>
                    </Button>
                    <span className='px-5'></span>
                    <Button onClick={() =>GroupTimeRegistory((target:TimeRecord)=>{
                      return {
                        ...target,
                        IsIgnore:true
                      }
                    })} className='hover:bg-slate-200 hover:text-slate-800 transition-colors duration-300'>
                      <span>アラートを無視</span>
                    </Button>
                    </div>
                  </ResizablePanel>
                  <ResizableHandle />
                  <ResizablePanel defaultSize={20}>
                    <div>
                      <h1>アラート</h1>
                    </div>
                  </ResizablePanel>

                  <ResizableHandle />

                  <ResizablePanel
                    defaultSize={50}
                  >

                    {
                      groupMemberRecordsState.map((record:TimeRecordWithOtherRecord)=>(
                        <SubTimeRecord record={record}/>
                      ))
                    }
                  </ResizablePanel>
              </ResizablePanelGroup>
        </ResizablePanel >
        <ResizableHandle />
        <ResizablePanel defaultSize={30}>
        <ScrollArea className='h-[500px] bg-slate-100'>
          <div className='sticky top-20 z-50
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

            <h1 className='text-lg font-bold'>アラート</h1>
              
              {alertRecords.map((record :TimeRecordWithOtherRecord) => (
                  <TimeCard record={record}/>     
            ))}
            
            
              <h1 className='text-lg font-bold'>5分前アラート</h1>
              
                {preAlertRecords.map((record :TimeRecordWithOtherRecord) => (
                
                <TimeCard record={record}/>  
              
                ))}
            
              <h1 className='text-lg font-bold'>打刻</h1>
              
                {records.map((record :TimeRecordWithOtherRecord) => (

                    <TimeCard record={record}/>  
                
                ))}  
          </ScrollArea>
        </ResizablePanel>
      </ResizablePanelGroup>
    
    
  )
}



export default DashBord;