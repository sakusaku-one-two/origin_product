import { AttendanceRecord } from '@/redux/recordType';
import React,{useState} from 'react';

export type ComfirmationRecords = {
    isLeft:boolean,
    fromCsv:Map<number,AttendanceRecord[]>,
    fromDb:Map<number,AttendanceRecord[]>,
    uniqueRecord:AttendanceRecord[]
};


//CSVをサーバーに送るページ
const ImportPage:React.FC = () => {
    const [checkedData,setCheckedData] = useState<null|ComfirmationRecords>(null);

    const [csvData,setCsvData] = useState<string>("");
    const SetCsvHandler = (event:HTMLInputElement|any) => {
        if (!(event.target instanceof HTMLInputElement)) return;
        if (!event.target.files) return;

        const file = event.target.files[0];
        
        const setCsv = async (data:File|Blob) => {
            
            const  formData = new FormData();
            formData.append('import_csv',data);

            const response = await fetch('api/Csvcheck',{
                method:'POST',
                body:formData,//formDataを送信(ファイルを送信するために必要)
                headers:{
                    'Content-Type':'multipart/form-data',
                },
            });

            if (!response.ok) {
                alert("CSVに不備があります。");
                return;
            }
            
            const result:ComfirmationRecords|any = await response.json();
            
           
            

            
           
        };
        setCsv(file);
    };
    
    const perseCsv = (dataFromCSV:string):string[][] => {
        return dataFromCSV.split('/r/n').map((row) => row.split(','));
    };

    return (
        <div>
            <input type="file" accept='text/csv' onChange={SetCsvHandler}/>
            { perseCsv(csvData).map((row:string[]) => {
              return (
                <div>
                    {
                        row.map((cell:string) => cell )
                    }
                </div>
              );
            })
            }
        </div>
    );
};

export default ImportPage;