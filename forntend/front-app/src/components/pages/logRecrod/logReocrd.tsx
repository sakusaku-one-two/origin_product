import React, { useState,useEffect } from 'react';
import { AttendanceRecord, TimeRecord } from '../../../redux/recordType';
import { 
    Table,
    TableHeader,
    TableRow,
    TableBody,
    TableCell,
    TableHead,
    TableFooter,
} from '@/components/ui/table';
import { PlanName,ShowTime } from '@/components/pages/dasbord/timeCard/timeCard';

const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);

const LogRecord:React.FC = () => {
    const [records,setRecords] = useState<AttendanceRecord[]>([]);
    const [endDate,setEndDate] = useState<Date>(today);
    
    useEffect(()=>{
        const fetchRecords = async () => {
            try {
                const response = await fetch('/api/logRecord',{
                    method:'POST',
                    headers:{
                    'Content-Type':'application/json',
                },
                body:JSON.stringify({
                    endDate:endDate.toISOString(),
                }),
            });

                const reuslt = await response.json();
                if (response.ok) {
                    const data:{reocrds:AttendanceRecord[]} = reuslt;
                    console.log(data);
                    setRecords(data.reocrds);
                } else {
                    alert("loginしてください。");
                }
            
            } catch (error:Error|any) {
                alert(error.message);
            }
        };
        
        fetchRecords();
    },[endDate])
    
    return (
        <div>
            <div className='flex items-center mb-4 space-x-2'>
                <input
                    type="date"
                    value={endDate.toISOString().split('T')[0]}
                    onChange={(e) => setEndDate(new Date(e.target.value))}
                    className='border border-gray-300 p-2 rounded'
                />
                <button
                    onClick={() => setEndDate(new Date())}
                    className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
                >
                    Today
                </button>
            </div>
        <Table className='w-full'>
            <TableHeader>
                
                    <TableHead>報告タイプ</TableHead>
                    <TableHead>指名</TableHead>
                    <TableHead>予定時間</TableHead>
                    <TableHead>実績時間</TableHead>
                    <TableHead>結果</TableHead>
                
            </TableHeader>
            <TableBody>
                {records.map((record: AttendanceRecord) => (
                    record.TimeRecords.map((timeRecord: TimeRecord) => (
                        <TableRow key={`${record.ManageID}${timeRecord.ID}`} className='hover:bg-gray-200'>
                            <TableCell>{PlanName(timeRecord.PlanNo)}</TableCell>
                            <TableCell>{record.Emp.Name}</TableCell>
                            <TableCell>{ShowTime(timeRecord.PlanTime)}</TableCell>
                            <TableCell>{timeRecord.IsComplete ? ShowTime(timeRecord.ResultTime): '---'}</TableCell>
                            <TableCell>{timeRecord.IsComplete ? '完了' : '未完了'}</TableCell>
                        </TableRow>
                    ))
                ))}
            </TableBody> 
            <TableFooter>
                {/* フッターに追加の行が必要な場合はここに記述 */}
            </TableFooter>
        </Table>    
        
        </div>
    )
}

export default LogRecord;