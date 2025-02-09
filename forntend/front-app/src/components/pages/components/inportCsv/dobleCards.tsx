import React,{useState} from 'react';
import { AttendanceRecord } from '@/redux/recordType';
import { DupCard } from './dupulicateRecord';
import AttendanceCard from './attendanceCard';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';





const DobleCards: React.FC<{Props:DupCard}> = ({Props}) => {
    const { fromDb,fromCsv,no} = Props;
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
        <motion.div
            layoutId={no.toString()}
            key={no.toString()}
            initial={{opacity:0,y:-50}}//初期状態
            animate={{opacity:1,y:0}}//アニメーション後の状態
            exit={{opacity:0,y:20}}
            transition={{duration:1}}
        >
            <Card className='flex flex-row py-5 px-5' >
                <div className='hover:bg-gray-500' onClick={() => onSelected(fromCsv)}>   
                    {<AttendanceCard record={fromCsv} />}
                </div>
                <div className='hover:bg-gray-500' onClick={() => onSelected(fromDb)}>
                    {<AttendanceCard record={fromDb} />}
                </div>
            </Card>
        </motion.div>
    );
};


export default DobleCards;
