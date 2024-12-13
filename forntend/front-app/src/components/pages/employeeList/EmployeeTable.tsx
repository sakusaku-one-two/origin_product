import React,{useEffect,useState} from "react";
import { EmployeeRecord } from "../../../redux/recordType";
import { useDispatch } from "react-redux";
import { UPDATE } from "../../../redux/slices/employeeSlice";

const TODAY = new Date();
const TODAY_YEAR = TODAY.getFullYear();
const TODAY_MONTH = TODAY.getMonth();
const TODAY_DAY = TODAY.getDate();

//社員データの表示
const EmployeeTable:React.FC = () => {
    const [employeeRecords,setEmployeeRecords] = useState<EmployeeRecord[]>([]);//社員データの格納
    const [startDate,setStartDate] = useState<Date|null>(new Date(TODAY_YEAR,TODAY_MONTH - 1,TODAY_DAY));//開始日(前月から勤務した社員一覧を表示)
    const [endDate,setEndDate] = useState<Date|null>(new Date(TODAY_YEAR,TODAY_MONTH,TODAY_DAY));//終了日(今月)
    const dispatch = useDispatch();//websocketで更新

    useEffect(()=>{
        try {
            const fetchEmp = async () => {
                await fetch("api/employee/list",{   
                    method:"GET",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify({
                        "startDate":startDate?.toISOString(),
                        "endDate":endDate?.toISOString()
                    })
                })
                .then((res)=>res.json())
                .then((data)=>setEmployeeRecords(data));
            }
            fetchEmp();
        } catch (error:unknown) {
            alert("社員データの取得に失敗しました。");
            console.error(error);
        }
    },[startDate,endDate]);

    //更新ハンドラ
    const UpdateHandler = (record:EmployeeRecord) => {
        dispatch(UPDATE(record));
    };

    return (
        <div>
            <h1>EmployeeTable</h1>
            <input type="date" value={startDate} onChange={(e)=>setStartDate(new Date(e.target.value))}/>
            <input type="date" value={endDate} onChange={(e)=>setEndDate(new Date(e.target.value))}/>
            {employeeRecords.map((record)=>(
                <div key={record.EmpID}>
                    <p>{record.Name}</p>
                    <button onClick={()=>UpdateHandler(record)}>更新</button>
                </div>
            ))}
        </div>
    );
};

export default EmployeeTable;