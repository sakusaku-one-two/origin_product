import React from 'react';
import { TimeRecordWithOtherRecord } from '../../../hooks';
import { PlanNames } from './helper';
import { Card,CardHeader,CardContent, CardTitle, CardDescription } from '../../ui/card';
import { Checkbox } from '@/components/ui/checkbox';
// サブタイムレコード 選択されたレコードと同じ計画番号のレコードを表示するためのカード
const SubTimeRecord:React.FC<{record:TimeRecordWithOtherRecord}> = ({record})=>{
    console.log("SubTimeRecord",record);
    return (
    <Card>
        <div className='flex items-center'>
            <Checkbox defaultChecked={record.isSelected} onClick={()=>{record.isSelected=!record.isSelected}}/>
            <CardHeader>
                <CardDescription>{PlanNames.get(record.timeRecord.PlanNo)} {record.timeRecord.PlanTime.toLocaleString()}</CardDescription>
            </CardHeader>
            <CardContent>
                <CardTitle>{record.employeeRecord?.Name}</CardTitle>
                <CardDescription>{record.locationRecord?.LocationName}</CardDescription>
            </CardContent>
        </div>
    </Card>
    );
};


export default SubTimeRecord;