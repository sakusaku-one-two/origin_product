// import React, { useState } from 'react';
// import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/ui/table';
// import { useSelector } from 'react-redux';
// import { RootState } from '@/store/store';
// import { dispatch } from '@/store/store';
// import { UPDATE } from '@/store/employeeSlice';





// const DepartTimeConfig:React.FC = () => {
//     const [searchEmpName, setSearchEmpName] = useState('');
//     const employeeRecords = useSelector((state: RootState) => state.employee.employeeRecords);
//     const [searchResults, setSearchResults] = useState<Employee[]>([]);

//     const handleSearch = () => {
//         const results = employeeRecords.filter((employee) => employee.Name.includes(searchEmpName));
//         setSearchResults(results);
//     };

//     return (
//         <div className='container mx-auto p-4'>
//             <h1 className='text-2xl font-bold mb-4 text-center'>出勤時間設定</h1>
//             <input type='text' placeholder='社員名' className='mb-4' />
//             <Table className='min-w-full bg-white border border-gray-200'>
//                 <TableHeader>
//                     <TableRow>
//                         <TableHead className='py-2 px-4 border-b'></TableHead>
//                         <TableHead className='py-2 px-4 border-b'>勤務地</TableHead>
//                         <TableHead className='py-2 px-4 border-b'>出勤時間</TableHead>
//                         <TableHead className='py-2 px-4 border-b'>退勤時間</TableHead>
//                     </TableRow>
//                 </TableHeader>
//             </Table>
//         </div>
//     )
// }

// export default DepartTimeConfig;