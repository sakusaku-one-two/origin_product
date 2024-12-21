import { AttendanceRecord, TimeRecord } from '@/redux/recordType';
import React,{useState} from 'react';


export type ComfirmationRecords = {
    IsLeft:boolean,
    FromCsv:Map<number,AttendanceRecord[]>,
    FromDb:Map<number,AttendanceRecord[]>,
    UniqueRecord:AttendanceRecord[]
};


//CSVをサーバーに送るページ
const ImportPage:React.FC = () => {
    const [checkedData,setCheckedData] = useState<null|ComfirmationRecords>(null);

    const SetCsvHandler = (event:HTMLInputElement|any) => {
        if (!(event.target instanceof HTMLInputElement)) return;
        if (!event.target.files) return;

        const file = event.target.files[0];
        
        const setCsv = async (data:File|Blob) => {
            
            const  formData = new FormData();
            formData.append('file',data);
            console.log(formData);
            const response = await fetch('api/Csvcheck',{
                method:'POST',
                body:formData,//formDataを送信(ファイルを送信するために必要)
           
            });

            if (!response.ok) {
                console.log(await response.json());
                alert("CSVに不備があります。");
                return;
            }
            
            const result:ComfirmationRecords|any = await response.json();
            setCheckedData(result);
        };
        setCsv(file);
    };
    
    // const perseCsv = (dataFromCSV:string):string[][] => {
    //     return dataFromCSV.split('/r/n').map((row) => row.split(','));
    // };

    return (
        <div>
            <input type="file" accept='text/csv' onChange={SetCsvHandler}/>
            
            {checkedData?.UniqueRecord && (
                checkedData.UniqueRecord.map((record:AttendanceRecord) => {
                    return (
                        <div>
                            {record.ManageID}
                            {record.TimeRecords.map((timeRecord:TimeRecord) => {
                                return (
                                    <div>
                                        {timeRecord.PlanTime.toLocaleString()}
                                        <div>
                                            {timeRecord.PlanNo}
                                        </div>
                                    </div>
                                    
                                );
                            })}
                        </div>
                    );
                })
            )}
        </div>
    );
};

export default ImportPage;