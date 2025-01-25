import React, { useEffect, useState } from "react";
import { EmployeeRecord } from "../../../redux/recordType";
import { useDispatch } from "react-redux";
import { UPDATE } from "../../../redux/slices/employeeSlice";


//社員データの表示
const EmployeeTable: React.FC = () => {
    const [employeeRecords, setEmployeeRecords] = useState<EmployeeRecord[]>([]);//社員データの格納
    const dispatch = useDispatch();//websocketで更新

    useEffect(() => {
        //社員データを取得する副作用
        try {
            const fetchEmp = async () => {
                const response = await fetch("api/employeeList", {   
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setEmployeeRecords(data);
                } else {
                    alert("社員データの取得に失敗しました。");
                }
            }
            
            fetchEmp();
        } catch (error: unknown) {
            alert("社員データの取得に失敗しました。");
            console.error(error);
        }
    }, []);

    //更新ハンドラ
    const UpdateHandler = (record: EmployeeRecord) => {
        dispatch(UPDATE(record));
    };

    return (
        <div className='container mx-auto p-4'>
            <h1 className='text-2xl font-bold mb-4 text-center'>社員一覧</h1>
            <div className='overflow-x-auto'>
                <table className='min-w-full bg-white border border-gray-200'>
                    <thead>
                        <tr>
                            <th className='py-2 px-4 border-b'>社員ID</th>
                            <th className='py-2 px-4 border-b'>名前</th>
                            <th className='py-2 px-4 border-b'>アクション</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employeeRecords.map((record) => (
                            <tr key={record.EmpID} className='hover:bg-gray-100'>
                                <td className='py-2 px-4 border-b text-center'>{record.EmpID}</td>
                                <td className='py-2 px-4 border-b'>{record.Name}</td>
                                <td className='py-2 px-4 border-b text-center'>
                                    <button
                                        onClick={() => UpdateHandler(record)}
                                        className='bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600'
                                    >
                                        更新
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EmployeeTable;