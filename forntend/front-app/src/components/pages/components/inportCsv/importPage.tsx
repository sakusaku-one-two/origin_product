import { AttendanceRecord} from '@/redux/recordType';
import React,{useState} from 'react';
import {
    ResizablePanelGroup,
    ResizablePanel,
    ResizableHandle
} from '@/components/ui/resizable';
// import {
//     Carousel,
//     CarouselContent,
//     CarouselItem,
//     CarouselNext,
//     CarouselPrevious,
//   } from "@/components/ui/carousel";
import AttendanceCard from './attendanceCard';

export type ComfirmationRecords = {
    IsLeft:boolean,
    FromCsv:Map<number,AttendanceRecord[]>,
    FromDb:Map<number,AttendanceRecord[]>,
    UniqueRecord:AttendanceRecord[]
};

        // const InitialSelectedRecord:ComfirmationRecords = {
        //     IsLeft:false,
        //     FromCsv:new Map(),
        //     FromDb:new Map(),
        //     UniqueRecord:[]
        // };

//CSVをサーバーに送るページ
const ImportPage:React.FC = () => {
   

    //選択されたレコードを保持
    // const [isLeft,setIsLeft] = useState<boolean>(checkedData.IsLeft);
    const [fromCsv,setFromCsv] = useState<Map<number,AttendanceRecord[]>>(new Map());
    const [fromDb,setFromDb] = useState<Map<number,AttendanceRecord[]>>(new Map());
    const [selectedRecord,setSelectedRecord] = useState<AttendanceRecord[]>([]);
    

    const [csvData,setCsvData] = useState<string>("");
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
                console.log(await response.json())
                alert("CSVに不備があります。");
                return;
            }
            
            const result:ComfirmationRecords|any = await response.json();
            setCheckedData(result);
        };
        setCsv(file);
    };

    const SetToDBHandler = async () => {
        const response = await fetch('api/InsertRecords',{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body:JSON.stringify({insertRecords:selectedRecord}),
        });
        if (!response.ok) {
            alert("DBに登録に失敗しました。");
            return;
        }
        alert("DBに登録しました。");
    };
    
    // const perseCsv = (dataFromCSV:string):string[][] => {
    //     return dataFromCSV.split('/r/n').map((row) => row.split(','));
    // };

    return (
        <div className=''>
            <input type="file" accept='text/csv' onChange={SetCsvHandler}/>
            
            {checkedData && (
               checkedData.uniqueRecord.map((record:AttendanceRecord) => {
                return (
                    <div>
                        {record.ManageID}
                    </div>
                );
               })
            )}
        </div>
    );
};

export default ImportPage;