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
import { TimeRecordWithOtherRecord, useGetWaitingTimeRecordsWithOtherRecord } from '../../../hooks';
import { motion, AnimatePresence } from "framer-motion";
import TimeCard from './timeCard';
import { SelectedRecord } from '../../../state/selectedRecord';
import SubTimeRecord from './subTimeRecord';
import { GetGroupMemberRecord } from './helper';


const DashBord:FC=() => {
  const [FindOpen,setFindOpen] = useRecoilState(FindDialogOpen);
  const [targetRecord,setTargetRecord] = useRecoilState(SelectedRecord);
  const records:TimeRecordWithOtherRecord[] = useGetWaitingTimeRecordsWithOtherRecord();
  const groupMemberRecords:TimeRecordWithOtherRecord[] = GetGroupMemberRecord(targetRecord.record,records);
  const [
    groupMemberRecordsState,
    setGroupMemberRecordsState
    ] = useState<TimeRecordWithOtherRecord[]>(groupMemberRecords);

  useEffect(()=>{
    setGroupMemberRecordsState(groupMemberRecords);
  },[targetRecord.record]);


  console.log("DashBord",groupMemberRecords,targetRecord.record);

  const FindDailogHandler = () => {
    setFindOpen(!FindOpen);
  };


  
  return (
    <ResizablePanelGroup
      direction='horizontal'
      className='max-w-[3/2-screen] rounded-lg border md:min-w-[500px]'
    >
      
      
      <ResizablePanel defaultSize={70}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={30} className='bg-slate-100'>
                <AnimatePresence >
                  {targetRecord.record && (
                    // <motion.div layoutId={targetRecord.record.timeRecord.ID.toString()}
                    //   animate={{ scale: 1, opacity: 1 }}
                    //   exit={{ scale: 0.8, opacity: 0 }}
                    //   transition={{ type: "" }}
                    //   className='h-full'
                    // >
                      <TimeCard record={targetRecord.record}/>
                    // </motion.div>
                  
                )}
                </AnimatePresence>
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
        <div className='p-2'>
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
        <ScrollArea className='h-[500px] bg-slate-100'>
          <ScrollBar orientation='horizontal' />
              
              {records.map((record :TimeRecordWithOtherRecord) => (
                // <motion.div layoutId={record.timeRecord.ID.toString()}  
                //   // animate={{ scale: 1, opacity: 1 }}
                //   // exit={{ scale: 0.8, opacity: 0 }}
                //   // transition={{ type: "" }}
                // >
                  <TimeCard record={record}/>  
                // </motion.div>
              ))}

        </ScrollArea>
      </ResizablePanel>

   
    </ResizablePanelGroup>
  )
}



export default DashBord;