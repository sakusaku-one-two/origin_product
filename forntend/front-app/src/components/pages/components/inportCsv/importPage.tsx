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
                alert("CSVに不備があります。");
                const message = await response.json();
                console.log(message);
                return;
            }
            
            const result:ComfirmationRecords|any = await response.json();
            console.log(result);
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
            <input type="file" accept='text/csv' onChange={SetCsvHandler}/>
            <ResizablePanelGroup direction='horizontal' className='h-full'>
                <ResizablePanel defaultSize={30}>
                    <div className='flex flex-col items-center justify-center h-full'>
                        <h1>CSV</h1>
                            {fromCsv.size > 0 &&
                                Array.from(fromCsv.values()).flat().map((record) => (
                                    <AttendanceCard record={record} />
                                ))
                            }
                        </div>
                </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel defaultSize={30}>
                    <div className='flex flex-col items-center justify-center h-full'>
                        <h1>DB</h1>
                            {fromDb.size > 0 &&
                                Array.from(fromDb.values()).flat().map((record) => (
                                    <AttendanceCard record={record} />
                                ))
                            }
                    </div>
                </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel defaultSize={30}>   
                    <div className='flex flex-col items-center justify-center h-full'>
                        <h1>Unique</h1>
                        <button onClick={SetToDBHandler}>DBに登録</button>
                            {
                                selectedRecord.map((record) => (
                                    <AttendanceCard record={record} />
                                ))
                            }
                        </div>
                    
                </ResizablePanel>
            </ResizablePanelGroup>
            
        </div>
    );
};

export default ImportPage;