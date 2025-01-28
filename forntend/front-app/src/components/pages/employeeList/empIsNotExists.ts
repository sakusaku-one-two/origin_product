import { EmployeeRecord } from "../../../redux/recordType";

//フェッチと現在の社員データを比較して、フェッチの社員データが現在の社員データに存在しない場合は、フェッチの社員データを返す
export function emps(currentEmp:EmployeeRecord[],fetchEmp:EmployeeRecord[]){

    const result :EmployeeRecord[] = fetchEmp.map(emp => {
        const empIsExists = currentEmp.find(currentEmp => currentEmp.EmpID === emp.EmpID);
        if(empIsExists){
            return empIsExists;
        }
        return emp;
    })
    return result;
}