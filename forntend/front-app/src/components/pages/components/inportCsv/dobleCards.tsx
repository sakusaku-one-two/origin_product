import React,{useState} from 'react';
import { AttendanceRecord } from '@/redux/recordType';
import { DupCard } from './dupulicateRecord';
import AttendanceCard from './attendanceCard';
import { Card } from '@/components/ui/card';


const DobleCards: React.FC<{Props:DupCard}> = ({Props}) => {
    const { fromDb,fromCsv} = Props;
    const [isSelected,setSelected] = useState<boolean>(false);
    
    const onSelected = (target:AttendanceRecord) => {
        Props.add(target);
        setSelected(true);
    };

    if (isSelected) return (
        <>
        </>
    );

    return (
        <Card className='flex-row' >
            <div onClick={() => onSelected(fromCsv)}>   
                {<AttendanceCard record={fromCsv} />}
            </div>
            <div onClick={() => onSelected(fromDb)}>
                {<AttendanceCard record={fromDb} />}
            </div>
        </Card>
    );
};


export default DobleCards;
