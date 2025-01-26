import React,{useState,useEffect} from 'react';
import { Table, TableHead, TableRow, TableHeader, TableCell } from '@/components/ui/table';
import {  TimeRecord,AttendanceRecord } from '@/redux/recordType';



// Timeレコードログ

const dateToStr = (date:Date):string => {
    return date.toISOString().split('T')[0];
}



export default function RecordLogs():React.ReactNode {
    const [endDate,setEndDate] = useState<string>(dateToStr(new Date()));
    const [logRecords,setLogRecords] = useState<AttendanceRecord[]>([]);

    useEffect(() => {
        const fetchLogRecords = async () => {
            const response = await fetch('/api/logRecord',{
                method:'GET',
                headers:{
                    'Content-Type':'application/json',
                },
                body:JSON.stringify({
                    endDate:endDate,
                })
            });
            const data:{records:AttendanceRecord[]} = await response.json();
            setLogRecords(data.records);
        };

        fetchLogRecords(); // ログレコードの取得
    }, [endDate]);
    
    return (
        <div>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>
                            <h1>社員ID</h1>
                        </TableHead>
                        <TableHead>
                            <h1>計画No</h1>
                        </TableHead>
                        <TableHead>
                            <h1>実施日</h1>
                        </TableHead>
                        <TableHead>
                            <h1>実施時間</h1>
                        </TableHead>
                        <TableHead>
                            <h1>実施内容</h1>
                        </TableHead>
                    </TableRow>
                    {logRecords.map((log:AttendanceRecord) => (
                        log.TimeRecords.map((record:TimeRecord) => (
                            <TableRow key={`${record.ManageID}-${record.PlanNo}`}>
                                <TableCell>{log.EmpID}</TableCell>
                                <TableCell>{record.PlanNo}</TableCell>
                                <TableCell>{dateToStr(new Date(record.PlanTime))}</TableCell>
                                <TableCell>{dateToStr(new Date(record.ResultTime))}</TableCell>
                                <TableCell>{record.IsComplete ? '完了' : '未完了'}</TableCell>
                            </TableRow>
                        ))
                    ))}
                </TableHeader>
            </Table>        
        </div>
    )  ;
}