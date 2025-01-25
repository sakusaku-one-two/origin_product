import { AttendanceRecord } from "@/redux/recordType";
import React from "react";
import AttendanceCard from "./attendanceCard";


export const DuplicateRecord:React.FC<{recordFromCsv:AttendanceRecord,recordFromDb:AttendanceRecord}> = ({recordFromCsv,recordFromDb}) => {
    return (
        <div className='flex flex-col items-center justify-center'>
            <AttendanceCard record={recordFromCsv} />
            <AttendanceCard record={recordFromDb} />
        </div>
    )
}