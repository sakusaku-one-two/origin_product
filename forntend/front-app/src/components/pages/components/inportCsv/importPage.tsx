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
export interface RowType {
    [ManageID:number]:AttendanceRecord;
}

//CSVをサーバーに送るページ
const ImportPage:React.FC = () => {

    //選択されたレコードを保持
    // const [isLeft,setIsLeft] = useState<boolean>(checkedData.IsLeft);
    const [fromCsv,setFromCsv] = useState<RowType>({});
    const [fromDb,setFromDb] = useState<RowType>({});
    const [selectedRecord,setSelectedRecord] = useState<AttendanceRecord[]>([]);
    

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
                // headers:{
                //     "Content-Type":"multipart/form-data"
                // },
                body:formData,//formDataを送信(ファイルを送信するために必要)
            });

            if (!response.ok) {
                alert("CSVに不備があります。");
                const message = await response.json();
                console.log(message);
                return;
            }
            
            const result:ComfirmationRecords|any = await response.json();
            
            // console.log("FromCsv",result.FromCsv,result.FromCsv.size);
            // console.log("FromDb",result.FromDb,result.FromDb.size);
            // console.log("UniqueRecord",result.UniqueRecord,result.UniqueRecord.length);

            setFromCsv(result.FromCsv);
            setFromDb(result.FromDb);
            setSelectedRecord(result.UniqueRecord);
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
            const message = await response.json();
            console.log(message);

            return;
        }
        alert("DBに登録しました。");
    };
    
    // const perseCsv = (dataFromCSV:string):string[][] => {
    //     return dataFromCSV.split('/r/n').map((row) => row.split(','));
    // };

    return (
        <div className=''>
            <div className=''>
                <div className='mb-4'>
                    <input 
                        type="file" 
                        accept='text/csv' 
                        onChange={SetCsvHandler} 
                        className='border border-gray-300 p-2 rounded'
                    />
                </div>
            </div>
            <ResizablePanelGroup direction='horizontal' className='h-full space-x-2'>
                <ResizablePanel defaultSize={30}>
                    <div className='flex flex-col items-center justify-center h-full'>
                        <h1 className='text-xl font-semibold mb-4'>CSV</h1>
                            {
                                fromCsv &&
                                Object.values(fromCsv).map((record) => (
                                    <div className='flex flex-col items-center justify-center mb-2 w-full' key={`${record.ManageID}-fromcsv`}>
                                        <h1 className='text-xl font-semibold mb-4'>{record.ManageID}</h1>
                                        <AttendanceCard record={record} />
                                    </div>
                                ))
                            }
                        </div>
                </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel defaultSize={30}>
                    <div className='flex flex-col items-center justify-center h-full'>
                        <h1>DB</h1>
                            {
                                fromDb &&
                                
                                Object.values(fromDb).map((record) => (
                                    <div className='flex flex-col items-center justify-center' key={`${record.ManageID}-fromdb`}>
                                        <AttendanceCard record={record} />
                                    </div>
                                ))
                            }
                    </div>
                </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel defaultSize={30}>   
                    <div className='flex flex-col items-center justify-center h-full'>
                        <h1>Unique</h1>
                        <button 
                            onClick={SetToDBHandler} 
                            className='mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
                        >
                            DBに登録
                        </button>
                            {
                                selectedRecord.map((record) => (
                                    <div className='flex flex-col items-center justify-center' key={`${record.ManageID}-unique`}>
                                        <AttendanceCard record={record} />
                                    </div>
                                ))
                            }
                        </div>
                    
                </ResizablePanel>
            </ResizablePanelGroup>
            
        </div>
    );
};

export default ImportPage;