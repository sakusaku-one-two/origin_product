import React from 'react';
import { TimeRecordWithOtherRecord } from '../../../hooks';
import { PlanNames } from './helper';
import { Card,CardHeader,CardContent, CardTitle, CardDescription } from '../../ui/card';

// サブタイムレコード 選択されたレコードと同じ計画番号のレコードを表示するためのカード
const SubTimeRecord:React.FC<{record:TimeRecordWithOtherRecord}> = ({record})=>{
    console.log("SubTimeRecord",record);
    return (
    <Card>
        <CardHeader>
            <CardDescription>{PlanNames.get(record.timeRecord.PlanNo)} {record.timeRecord.PlanTime.toLocaleString()}</CardDescription>
        </CardHeader>
        <CardContent>
            <CardTitle>{record.employeeRecord?.Name}</CardTitle>
            <CardDescription>{record.locationRecord?.LocationName}</CardDescription>
        </CardContent>
    </Card>
    );
};


export default SubTimeRecord;