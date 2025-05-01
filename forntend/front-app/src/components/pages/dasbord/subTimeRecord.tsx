import React from 'react';
import { TimeRecordWithOtherRecord } from '../../../hooks';
import { PlanNames } from './helper';
import { Card,CardHeader, CardTitle, CardDescription } from '../../ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ShowTime } from './timeCard/timeCard';
// サブタイムレコード 選択されたレコードと同じ計画番号のレコードを表示するためのカード
const SubTimeRecord:React.FC<{record:TimeRecordWithOtherRecord}> = ({record})=>{

    return (
    <Card className="bg-white shadow-md rounded-lg p-2 w-full max-w-full mx-auto">
        <div className="flex items-center justify-between mb-2 p-4">
            <Checkbox
                defaultChecked={record.isSelected}
                onClick={() => { record.isSelected = !record.isSelected }}
                className="mr-2"
            />
            <CardHeader className="flex-1 text-center">
                <CardDescription className="text-gray-600 text-sm">
                    {PlanNames.get(record.timeRecord.PlanNo)} : {ShowTime(record.timeRecord.PlanTime)}
                </CardDescription>
            </CardHeader>
            <div className='flex-1 flex items-center justify-center'>
                <CardTitle className="text-base font-semibold text-gray-800">
                    {record.employeeRecord?.Name}
                </CardTitle>
            </div>
            <div className='flex-1 flex items-center justify-center'>
                <CardDescription className="text-xs text-gray-500">
                    {record.locationRecord?.LocationName}
                </CardDescription>
            </div>
        </div>
    </Card>
    );
};


export default SubTimeRecord;