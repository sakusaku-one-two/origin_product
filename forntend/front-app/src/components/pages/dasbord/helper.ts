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
  const ClinetID:number = record.locationRecord?.ClientID ?? -1;
  const LocationID:number = record.locationRecord?.LocationID ?? -1;
  const EmployeeID:number = record.employeeRecord?.EmpID ?? -1;

  if (EmployeeID === -1 || LocationID === -1 || PlanNo === -1 || PlanTime === null || ClinetID === -1) {
    console.log("GetGroupMemberRecord in function",EmployeeID,LocationID,PlanNo,PlanTime);
    return [];
  }
  
  const result = records.filter((item:TimeRecordWithOtherRecord)=>{
    // const itemEmpID:number = item.employeeRecord?.EmpID ?? 0;
    const itemLocationID:number = item.locationRecord?.LocationID ?? -1;
    const itemPlanNo:number = item.timeRecord.PlanNo;
    const itemPlanTime:Date = new Date(item.timeRecord.PlanTime);
    const itemClientID:number = item.locationRecord?.ClientID ?? -1;
    // if (itemEmpID === EmployeeID) return false;//同一社員はする無視する、
    if (itemClientID !== ClinetID) return false;//別の依頼元であれば無視、
    if (itemLocationID !== LocationID) return false;//別の場所であれば無視、
    if (PlanNo in [1,2]) return false; //出発報告と到着報告に関しては同一打刻の対象外
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