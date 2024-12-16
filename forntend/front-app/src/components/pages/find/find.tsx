import {FC,useEffect} from "react";

import {
  Calculator,
  
  CreditCard,
  Settings,
  
  User,
} from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "../../ui/command";

import { FindDialogOpen } from "../../../state/openClose";
import { useRecoilState } from "recoil";
import { TimeRecordWithOtherRecord } from "../../../hooks";
import { useGetWaitingTimeRecordsWithOtherRecord } from "../../../hooks";
import TimeCard from "../dasbord/timeCard/timeCard";

import { useSelectedRecordsSelector,useSelectedRecordsDispatch } from "../../../hooks";
import { CardType } from "../dasbord/timeCard/cardHelper";


const FindTask:FC =() => {
  
  const [open,setIsOpen] = useRecoilState(FindDialogOpen);
  const selectedRecords = useSelectedRecordsSelector();
  const dispatch = useSelectedRecordsDispatch();
  const records:TimeRecordWithOtherRecord[] = useGetWaitingTimeRecordsWithOtherRecord();


  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [setIsOpen])

  return (
    <>
      <p className="text-sm text-muted-foreground">
        Press{" "}
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>J
        </kbd>
      </p>
      <CommandDialog open={open} onOpenChange={setIsOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            {records.map((record)=>(
              <CommandItem key={record.timeRecord.ID} onSelect={()=>{
                dispatch({type:"SELECTED_RECORDS/UPDATE",payload:record});
                setIsOpen(false);
              }}>
                <TimeCard record={record} cardType={CardType.Wait}/>
              </CommandItem>
            ))}
            <CommandItem onSelect={()=>{
              dispatch({type:"SELECTED_RECORDS/UPDATE",payload:null});
              setIsOpen(false);
            }}>
              <Calculator />
              <span>Calculator</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem>
              <User />
              <span>Profile</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <CreditCard />
              <span>Billing</span>
              <CommandShortcut>⌘B</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <Settings />
              <span>現在選択中のデータ</span>
              <CommandShortcut>⌘S</CommandShortcut>
                {
                  selectedRecords && (
                    <TimeCard record={selectedRecords as TimeRecordWithOtherRecord} cardType={CardType.ControlPanel} />
                  )
                }
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
};

export default FindTask; 
