import React from 'react';
import { TimeRecordWithOtherRecord } from '../../../hooks';
import { PlanNames } from './helper';
import { Card,CardHeader,CardContent, CardTitle, CardDescription } from '../../ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ShowTime } from './timeCard/timeCard';
// サブタイムレコード 選択されたレコードと同じ計画番号のレコードを表示するためのカード
const SubTimeRecord:React.FC<{record:TimeRecordWithOtherRecord}> = ({record})=>{

    return (
    <Card>
        <div className='flex items-center'>
            <Checkbox defaultChecked={record.isSelected} onClick={()=>{record.isSelected=!record.isSelected}}/>
            <CardHeader>
                <CardDescription>{PlanNames.get(record.timeRecord.PlanNo)}   :  {ShowTime(record.timeRecord.PlanTime)}</CardDescription>
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