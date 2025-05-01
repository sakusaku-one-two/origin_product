import { AttendanceRecord } from "@/redux/recordType";
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { PlanName,ShowTime } from "../../dasbord/timeCard/timeCard";

const AttendanceCard:React.FC<{record:AttendanceRecord}> = ({record}) => {
    return (
            <Card>
                <CardHeader>
                    <CardTitle>{record.Emp.Name}</CardTitle>
                    <CardDescription>{record.Location.LocationName}</CardDescription>
                    <CardDescription>{record.Post.PostName}</CardDescription>
                </CardHeader>
                <CardContent>
                    {record.TimeRecords.sort((a,b)=> a.PlanNo - b.PlanNo).map((timeRecord,index) => (
                        <p key={index}>{PlanName(timeRecord.PlanNo)}:{ShowTime(timeRecord.PlanTime)}</p>
                    ))}
                </CardContent>
            </Card>
       
    );
};

export default AttendanceCard;