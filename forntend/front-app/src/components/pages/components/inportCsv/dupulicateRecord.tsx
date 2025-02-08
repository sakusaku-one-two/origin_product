import { AttendanceRecord } from "@/redux/recordType";
// import React, { useState } from "react";
// import AttendanceCard from "./attendanceCard";
import { RowType } from "./importPage";
import DobleCards from "./dobleCards";

export interface DuplicateRecordProps { 
    recordFromCsv:RowType;
    recordFromDb:RowType;
    addRecord: (record:AttendanceRecord) => void;
}

export type DupCard = {
    no:number
    fromCsv :AttendanceRecord
    fromDb :AttendanceRecord
    add:(target:AttendanceRecord) => void
}


const ToDupCards = ( {recordFromCsv,recordFromDb,addRecord}:DuplicateRecordProps):DupCard[] => {
    
    return Object.keys(recordFromCsv).map((value:string):DupCard=>{
        return {
            no:new Number(value),
            fromCsv:recordFromCsv[value],
            fromDb:recordFromDb[value],
            add:(target)=> addRecord(target)
        } as DupCard;
    })

};

//CSVとDBのレコードが重複している場合に表示するコンポーネント 選択したほうを登録する
export default function DuplicateRecord({ recordFromCsv, recordFromDb, addRecord }: DuplicateRecordProps) {
    

    const dobleCardList: DupCard[] = ToDupCards({
        recordFromCsv,
        recordFromDb,
        addRecord
    });
  
    

    
    
    return (
        <div className="w-hull h-hull">
            {dobleCardList.map((value:DupCard) => {
                return (
                    <div key={`${value.no}-dup`}>
                        <DobleCards Props={value} />
                    </div>
                );
            })}

        </div>
    )
}