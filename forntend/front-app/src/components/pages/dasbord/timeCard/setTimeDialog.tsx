// import { Button } from "@/components/ui/button";
// import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { useState } from "react";
// import { TimeRecord } from "../../../../../redux/recordTypes";

// export default function SetTimeDialog({timeRecord,updateFunction}:{timeRecord:TimeRecord,updateFunction:(timeRecord:TimeRecord)=>void}){
//     const [dateTime, setDateTime] = useState<Date | null | string>(timeRecord.PlanTime);
//     const [open, setOpen] = useState(false);
//     return(
//         <Dialog open={open} onOpenChange={setOpen}>
//             <DialogTrigger>
//                 <Button>
//                     定時打刻
//                 </Button>
//             </DialogTrigger>
//             <DialogContent>
//                 <DialogTitle>定時打刻</DialogTitle>
//                 <Input type="datetime-local" value={new Date(dateTime).toISOString().slice(0, -1)} onChange={(e) => setDateTime(new Date(e.target.value))}/>
//                 <Button onClick={() => setOpen(false)}>
//                     キャンセル
//                 </Button>
//                 <Button onClick={() => {
//                     if(dateTime){
//                         updateFunction({...timeRecord, ResultTime: dateTime, IsComplete: true});
//                         setOpen(false);
//                     }
//                 }}>
//                     決定
//                 </Button>
//             </DialogContent>
//         </Dialog>
//     )       
// }