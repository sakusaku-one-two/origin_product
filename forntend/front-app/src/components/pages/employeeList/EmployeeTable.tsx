import React, { useEffect, useState } from "react";
import { EmployeeRecord } from "../../../redux/recordType";
import { useDispatch } from "react-redux";
import { UPDATE } from "../../../redux/slices/employeeSlice";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableCell,
    TableHead,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";


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
        record.IsInTerm = !record.IsInTerm;
        console.log(record);
        dispatch(UPDATE(record));
    };

    return (
        <div className='container mx-auto p-4'>
            <h1 className='text-2xl font-bold mb-4 text-center'>社員一覧</h1>
            <div className='overflow-x-auto'>
                <Table className='min-w-full bg-white border border-gray-200'>
                    <TableHeader>
                        <TableRow>
                            <TableHead className='py-2 px-4 border-b'>社員ID</TableHead>
                            <TableHead className='py-2 px-4 border-b'>名前</TableHead>
                            <TableHead className='py-2 px-4 border-b'>外国人雇用者</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {employeeRecords.map((record) => (
                            <TableRow key={record.EmpID} className='hover:bg-gray-100'>
                                <TableCell className='py-2 px-4 border-b text-center'>{record.EmpID}</TableCell>
                                <TableCell className='py-2 px-4 border-b'>{record.Name}</TableCell>
                                <TableCell className='py-2 px-4 border-b text-center'>
                                    <Switch
                                        defaultChecked={record.IsInTerm}
                                        onCheckedChange={() => UpdateHandler(record)}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default EmployeeTable;