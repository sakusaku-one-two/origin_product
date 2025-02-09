import React ,{useState}from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '../../../ui/card';
import { TimeRecordWithOtherRecord } from '../../../../hooks';
import { useSetSelectedRecords } from '../../../../hooks';
import { useTimeDispatch } from '../../../../hooks';
import { UPDATE as UPDATE_TIME_RECORD} from '../../../../redux/slices/timeSlice';
import { motion } from 'framer-motion';
import { PlanNames } from '../helper';
import { Button } from '../../../ui/button';
import { SetAlertAnimation } from './cardHelper';
import { CardType } from './cardHelper';
import { Input } from '@/components/ui/input';

//計画名を取得
export const PlanName = (planNo: number) => {
    return PlanNames.get(planNo);
}   


//日付の文字列を日付フォーマット文字列に変換
export const ShowTime = (raw_time:string|Date):string => {
    const time =  raw_time instanceof Date ? raw_time : new Date(raw_time);
    const localTime = time.toLocaleTimeString(`ja-JP`,{timeZone:'Asia/Tokyo'});
    const localDate = time.toLocaleDateString(`ja-JP`,{timeZone:'Asia/Tokyo'});

    return `${localDate} ${localTime}`
    
};
//文字列をINPUTように整形
const TolocalTimeFormat = (raw_time:string | Date):string => {
    const date =  raw_time instanceof Date ? raw_time : new Date(raw_time);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const TimeCard: React.FC<{ record: TimeRecordWithOtherRecord,cardType: CardType }> = ({ record,cardType }) => {
    const dispatch = useTimeDispatch(); 
    // const selectedRecord = useSelectedRecordsSelector();
    const {setSelectedRecords} = useSetSelectedRecords();
    const timeRecord = record.timeRecord;
    const employeeRecord = record.employeeRecord;
    const locationRecord = record.locationRecord;
    const postRecord = record.postRecord;
    const [targetTime,setTargetTime] = useState<string>(TolocalTimeFormat(new Date()));
    
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
    const handleSelect = (e:React.MouseEvent) => {
        const clickedElement = e.target as HTMLElement;
        
        if (['INPUT', 'BUTTON'].includes(clickedElement.tagName) && isSelectedSelf) {
            return;
        }
        setTargetTime(TolocalTimeFormat(new Date()));
        if (isSelectedSelf) {
            setSelectedRecords(null)
            return ;
        }

        setSelectedRecords(null);
        setTimeout(() => {
            setSelectedRecords(record);
        }, 100);
    }
    



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
                        {PlanName(timeRecord?.PlanNo)} {ShowTime(timeRecord?.PlanTime)} {postRecord?.PostName}
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

                            <Input
                                type="datetime-local"
                                value={targetTime}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setTargetTime(event.target.value)}
                                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-300 text-sm w-full max-w-xs"
                            />
                            <Button
                            onClick={() => {
                                const newTimeRecord = {
                                    ...timeRecord,
                                    ResultTime: new Date( targetTime ),
                                    IsComplete: true
                                };
                                
                                dispatch(UPDATE_TIME_RECORD(newTimeRecord));
                            }}
                            >
                                指定時間での打刻
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
