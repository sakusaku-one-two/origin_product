import { DuplicateRecord } from "./dupulicateRecord";
export function dictToArray(rows) {
    var values = Object.values(rows);
    return values;
}
;
export function ArrayToDict(rows) {
    var dict = {};
    rows.forEach(function (row) {
        dict[row.ManageID] = row;
    });
    return dict;
}
;
export function setUPDuplicateRecord(recordFromCsv, recordFromDb) {
    var duplicateRecord = [];
    Object.values(recordFromCsv).forEach(function (record) {
        if (recordFromDb[record.ManageID]) {
            duplicateRecord.push(DuplicateRecord({
                recordFromCsv: record,
                recordFromDb: recordFromDb[record.ManageID]
            }));
        }
    });
    return duplicateRecord;
}
