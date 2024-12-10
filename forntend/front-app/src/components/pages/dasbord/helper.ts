  import { TimeRecordWithOtherRecord } from "../../../hooks";
import { TimeRecord } from "../../../redux/recordType";



export const PlanNames: Map<number,string> = new Map();

PlanNames.set(1,"自宅 出発時刻");
PlanNames.set(2,"現場 到着時刻");
PlanNames.set(3,"上番時刻");
PlanNames.set(4,"下番時刻");


// 同じ計画番号のレコードを取得する
export function GetGroupMemberRecord(record:TimeRecordWithOtherRecord | null,records:TimeRecordWithOtherRecord[]):TimeRecordWithOtherRecord[]{
  if(!record){
    return [];
  }
  const PlanNo:number = record.timeRecord.PlanNo;
  const PlanTime:Date|null = new Date(record.timeRecord.PlanTime);
  const LocationID:number = record.locationRecord?.LocationID ?? 0;
  const EmployeeID:number = record.employeeRecord?.EmpID ?? 0;

  if (EmployeeID === 0 || LocationID === 0 || PlanNo === 0 || PlanTime === null) {
    console.log("GetGroupMemberRecord in function",EmployeeID,LocationID,PlanNo,PlanTime);
    return [];
  }
  
  const result = records.filter((item:TimeRecordWithOtherRecord)=>{
    const itemEmpID:number = item.employeeRecord?.EmpID ?? 0;
    const itemLocationID:number = item.locationRecord?.LocationID ?? 0;
    const itemPlanNo:number = item.timeRecord.PlanNo;
    const itemPlanTime:Date = new Date(item.timeRecord.PlanTime);
    if (itemEmpID === EmployeeID) return false;//同一社員はする無視する、
    if (itemLocationID !== LocationID) return false;//同一現場は無視しない、
    if (itemPlanNo !== PlanNo) return false;//同一計画番号は無視しない、
    if (itemPlanTime.getTime() !== PlanTime.getTime()) return false;//同一計画時刻は無視しない、
    return true;
  });
  return result;
}

export const NewCompleteTimeRecord  = (oldRecord:TimeRecord,CompletedTime :Date):TimeRecord => {
  return {
    ...oldRecord,
    IsComplete:true,
    ResultTime:CompletedTime
  };
};