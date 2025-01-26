import React, { useState,useEffect } from 'react';
import { AttendanceRecord, TimeRecord } from '../../../redux/recordType';


const LogRecord:React.FC = () => {
    const [records,setRecords] = useState<AttendanceRecord[]>([]);
    const [endDate,setEndDate] = useState<Date>(new Date());
    
    useEffect(()=>{
        const fetchRecords = async () => {
            try {
                const response = await fetch('/api/logRecord',{
                    method:'POST',
                    headers:{
                    'Content-Type':'application/json',
                },
                body:JSON.stringify({
                    endDate:endDate.toJSON(),
                }),
            });

            const data = await response.json();
            
            
            setRecords(data.records as AttendanceRecord[]);
        } catch (error:Error|any) {
            console.error('Error fetching log records:', error);
        };
    };
        fetchRecords();
    },[endDate])
    
    return (
        <div>
            <input type="date" value={endDate.toISOString().split('T')[0]} onChange={(e)=>setEndDate(new Date(e.target.value))} />
            <button onClick={()=>setEndDate(new Date())}>Today</button>
        <table className='table-auto'>
            <thead className='bg-gray-200'>
                <tr className='text-left'>
                    <th>報告タイプ</th>
                    <th>指名</th>
                    <th>予定時間</th>
                    <th>実績時間</th>
                    <th>結果</th>
                </tr>
            </thead>
            <tbody className='bg-gray-100'>
                {records.map((record:AttendanceRecord)=>(
                    record.TimeRecords.map((timeRecord:TimeRecord)=>(
                    <tr key={`${record.ManageID}${timeRecord.ID}`}>
                        <td>{record.Emp.Name}</td>
                        <td>{timeRecord.PlanNo}</td>
                        <td>{timeRecord.PlanTime.toLocaleString()}</td>
                        <td>{timeRecord.ResultTime.toLocaleString()}</td>
                        <td>{timeRecord.IsComplete ? '完了' : '未完了'}</td>
                    </tr>
                    ))
                ))}
            </tbody>
        </table>    
        
        </div>
    )
}

export default LogRecord;