import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '../../../ui/card';
import { TimeRecordWithOtherRecord } from '../../../../hooks';
import { useSetSelectedRecords } from '../../../../hooks';
import { useTimeDispatch } from '../../../../hooks';
import { UPDATE as UPDATE_TIME_RECORD, DELETE as DELETE_TIME_RECORD } from '../../../../redux/slices/timeSlice';
import { motion } from 'framer-motion';
import { PlanNames } from '../helper';
import { Button } from '../../../ui/button';
import { SetAlertAnimation } from './cardHelper';
import { CardType } from './cardHelper';

const PlanName = (planNo: number) => {
    return PlanNames.get(planNo);
}   

const TimeCard: React.FC<{ record: TimeRecordWithOtherRecord,cardType: CardType }> = ({ record,cardType }) => {
    const dispatch = useTimeDispatch(); 
    // const selectedRecord = useSelectedRecordsSelector();
    const {setSelectedRecords} = useSetSelectedRecords();
    const timeRecord = record.timeRecord;
    const employeeRecord = record.employeeRecord;
    const locationRecord = record.locationRecord;
    
    const isSelectedSelf = cardType === CardType.ControlPanel;

   
    const isPlanOnTime: string = timeRecord.IsComplete ? "bg-green-500" : "bg-red-500";
    
    const handleOnTimeRecord = () => {
        const updatedTimeRecord = {
            ...timeRecord,
            IsComplete: true,
            ResultTime: timeRecord.PlanTime
        };
        dispatch(UPDATE_TIME_RECORD(updatedTimeRecord));
    }

    const handleIgnore = () => {
        const updatedTimeRecord = {
            ...timeRecord,
            IsIgnore: true,
        };
        dispatch(UPDATE_TIME_RECORD(updatedTimeRecord));
    }

    const handlePreAlertIgnore = () => {
        const updatedTimeRecord = {
            ...timeRecord,
            PreAlertIgnore: true,
        };
        dispatch(UPDATE_TIME_RECORD(updatedTimeRecord));
    }

    const handleAlertIgnore = () => {
        if (timeRecord.IsAlert) {
            handleIgnore();
        }else {
            handlePreAlertIgnore();
        }
    };
    const handleSelect = () => {
        if (isSelectedSelf) {
            setSelectedRecords(null);
            return;
        } 

        setSelectedRecords(null);
        setTimeout(() => {
            setSelectedRecords(record);
        }, 100);
    }
    //アラート状態の場合
    // if (timeRecord.IsAlert && !timeRecord.IsComplete && !timeRecord.IsIgnore) {
    //     return (
    //         <motion.div
    //             layoutId={timeRecord.ID.toString()}
    //             key={timeRecord.ID.toString()}
    //             animate={{ scale: 1, opacity: 1 }}
    //             exit={{ scale: 0.8, opacity: 0 }}
    //             transition={{ duration: 0.3 }}
    //             className='h-full'
    //         >

    //         </motion.div> 
    //     );
    // };




    return (
        <motion.div
            layoutId={timeRecord.ID.toString()}
            key={timeRecord.ID.toString()}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className='h-full'
        >
            <Card
                className={`w-full h-full hover:bg-gray-200 transition-colors duration-300 ${SetAlertAnimation(record)}`}
                onClick={handleSelect}
            >
                <CardHeader >
                    <CardDescription className="text-sm text-gray-500">
                        {PlanName(timeRecord?.PlanNo)} {new Date(timeRecord?.PlanTime).toLocaleString()}
                    </CardDescription> 
                    <CardTitle className="text-lg font-semibold">
                        {employeeRecord?.Name}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {isSelectedSelf && (
                        <div className="flex justify-center items-center space-x-4 mt-4">
                            <Button
                                onClick={handleOnTimeRecord}
                                className={`px-4 py-2 text-white rounded hover:bg-blue-600 transition-colors duration-300 ${isPlanOnTime}`}
                            >
                                定時打刻
                            </Button>

                            <Button
                                onClick={() => dispatch(DELETE_TIME_RECORD(timeRecord))}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-300"
                            >
                                打刻（指定）
                            </Button>

                            <Button
                                onClick={handleAlertIgnore}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-300"
                            >
                                アラート無視
                            </Button>
                        </div>
                    )}
                    <CardDescription className="mt-2 text-sm text-gray-600">
                        {locationRecord?.LocationName}
                    </CardDescription>
                </CardContent>
            </Card>
        </motion.div>
    )
}

export default TimeCard;
