import React from 'react';
import { Card,CardHeader,CardContent, CardTitle, CardDescription } from '../../ui/card';
import { TimeRecordWithOtherRecord } from '../../../hooks';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { SelectedRecord, useSelectedRecord } from '../../../state/selectedRecord'; 
import { motion } from 'framer-motion';
import { PlanNames } from './helper';




const PlanName = (planNo:number) => {
    return PlanNames.get(planNo);
}   


const TimeCard:React.FC<{record:TimeRecordWithOtherRecord}> = ({record})=>{
    const [selectedRecord,setSelectedRecord] = useSelectedRecord();
    const timeRecord = record.timeRecord;
    const employeeRecord = record.employeeRecord;
    const locationRecord = record.locationRecord;
    const ItSelectedIsSelf = selectedRecord.record?.timeRecord.ID === timeRecord.ID;
    
    const Selected = () => {

        if(ItSelectedIsSelf){
            setSelectedRecord({record:null,isSelected:false});
            return;
        }   

 
        setSelectedRecord({record:null,isSelected:false});
        setTimeout(()=>{
            setSelectedRecord({record:record,isSelected:true});
        },10);
        
    }
    
    return (
        <motion.div layoutId={timeRecord.ID.toString()}
        key={timeRecord.ID.toString()}
        animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "" }}
            className='h-full'
        >
            <Card className='w-full h-full hover:bg-gray-200' onClick={Selected}>
                <CardHeader>
                <CardDescription>{PlanName(timeRecord?.PlanNo)} {timeRecord?.PlanTime.toLocaleString()}</CardDescription> 
                <CardTitle>{employeeRecord?.Name}</CardTitle>
            </CardHeader>
            <CardContent>
                <CardDescription>{locationRecord?.LocationName}</CardDescription>
            </CardContent>
            </Card>
        </motion.div>
    )
}

export default TimeCard;
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
