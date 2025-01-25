import { AttendanceRecord } from "@/redux/recordType";
import { RowType } from "./importPage";
import { DuplicateRecord } from "./dupulicateRecord";
export function dictToArray(rows:RowType):AttendanceRecord[] {
    const values = Object.values(rows);
    return values;
};



export function ArrayToDict(rows:AttendanceRecord[]):RowType {
    const dict:RowType = {};
    rows.forEach((row) => {
        dict[row.ManageID] = row;
    });
    return dict;
};



export function setUPDuplicateRecord(recordFromCsv:RowType,recordFromDb:RowType):React.ReactNode[] {
    const duplicateRecord:React.ReactNode[] = [];
    Object.values(recordFromCsv).forEach((record) => {
        if(recordFromDb[record.ManageID]) {
            duplicateRecord.push(
                DuplicateRecord({
                    recordFromCsv: record,
                    recordFromDb: recordFromDb[record.ManageID]
                })
            );
        }
    });
    return duplicateRecord;
}