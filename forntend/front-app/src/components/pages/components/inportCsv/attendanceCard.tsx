import { AttendanceRecord } from "@/redux/recordType";
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";


const AttendanceCard:React.FC<{record:AttendanceRecord}> = ({record}) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{record.Emp.Name}</CardTitle>
                <CardDescription>{record.TimeRecords[0].PlanTime.toString()}</CardDescription>
                <CardDescription>{record.Post.PostName}</CardDescription>
            </CardHeader>
            <CardContent>
                {record.TimeRecords.map((timeRecord,index) => (
                    <p key={index}>{timeRecord.PlanTime.toString()}</p>
                ))}
            </CardContent>
        </Card>
    );
};

export default AttendanceCard;