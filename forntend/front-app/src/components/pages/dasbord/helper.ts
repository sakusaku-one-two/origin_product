import { TimeRecordWithOtherRecord } from "../../../hooks";
import { useGetWaitingTimeRecordsWithOtherRecord } from "../../../hooks";

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
  const PlanTime:Date|null = record.timeRecord.PlanTime;
  const LocationID:number = record.locationRecord?.LocationID ?? 0;
  const EmployeeID:number = record.employeeRecord?.EmpID ?? 0;
  console.log("empid,panno,plantime,location",EmployeeID,PlanNo,PlanTime,LocationID);
  const result = records.filter(item =>{
    console.log("GetGroupMemberRecord in function",item.timeRecord.PlanNo,item.timeRecord.PlanTime,item.locationRecord?.LocationID,item.employeeRecord?.EmpID);
    if (item.timeRecord.PlanNo !== PlanNo) return false;
    console.log("GetGroupMemberRecord in function",item.timeRecord.PlanTime,PlanTime);
    if (item.timeRecord.PlanTime !== PlanTime) return false;
    console.log("GetGroupMemberRecord in function",item.locationRecord?.LocationID,LocationID);
    if (item.locationRecord?.LocationID !== LocationID) return false;
    console.log("GetGroupMemberRecord in function",item.employeeRecord?.EmpID,EmployeeID);
    if (item.employeeRecord?.EmpID === EmployeeID) return false;
    return true;
  }) 
  console.log("GetGroupMemberRecord in function",result);
  return result;
                    // && item.timeRecord.PlanTime === PlanTime 
                    // && item.locationRecord?.LocationID === LocationID 
                    // && item.employeeRecord?.EmpID !== EmployeeID);
}
