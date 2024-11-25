import type {FC} from 'react';
import {Card} from '../../../ui/card';
import type {TimeRecordWithEmployeeRecord} from '../../../hooks';
import { useRecoilState } from 'recoil';


const TimeCard:FC<{timeRecord:TimeRecordWithEmployeeRecord,onClick:() => void}> = ({timeRecord,onClick}) => {

    return (
        <Card className='transition duration-500
            hover:shadow-md hover:bg-slate-200'
            onClick={onClick}>
            <h1>{timeRecord.timeRecord.ManageID}</h1>
            <h2>{timeRecord.employeeRecord?.Name}</h2>
        </Card>
    )
};

export default TimeCard;
