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
import DuplicateRecord from './dupulicateRecord';
import { AnimatePresence,motion } from "framer-motion";



export type ComfirmationRecords = {
    IsLeft:boolean,
    FromCsv:Map<string,AttendanceRecord[]>,
    FromDb:Map<string,AttendanceRecord[]>,
    UniqueRecord:AttendanceRecord[]
};

        // const InitialSelectedRecord:ComfirmationRecords = {
        //     IsLeft:false,
        //     FromCsv:new Map(),
        //     FromDb:new Map(),
        //     UniqueRecord:[]
        // };
export interface RowType {
    [ManageID:string]:AttendanceRecord;
}

//CSVをサーバーに送るページ
const ImportPage:React.FC = () => {

    //選択されたレコードを保持
    // const [isLeft,setIsLeft] = useState<boolean>(checkedData.IsLeft);
    const [fromCsv,setFromCsv] = useState<RowType>({});
    const [fromDb,setFromDb] = useState<RowType>({});
    const [selectedRecord,setSelectedRecord] = useState<AttendanceRecord[]>([]);

    const addRecord = (record:AttendanceRecord) => {
        setSelectedRecord([...selectedRecord,record]);
    };

    // const removeRecord = (record:AttendanceRecord) => {
    //     setSelectedRecord(selectedRecord.filter((r) => r.ManageID !== record.ManageID));
    // };

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
            console.log("from csv",result.FromCsv);
            console.log("from db",result.FromDb);
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

                    <div className='flex flex-col items-center h-full'>
                        <DuplicateRecord 
                            recordFromDb={fromDb}
                            recordFromCsv={fromCsv}
                            addRecord={addRecord}
                        />
                    </div>
                </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel defaultSize={30}>   
                    <div className='flex flex-col items-center h-full'>
                        <h1>Unique</h1>
                        <button 
                            onClick={SetToDBHandler} 
                            className='mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
                        >
                            DBに登録
                        </button>
                        <AnimatePresence>
                            { 
                                selectedRecord.map((record) => (
                                    <motion.div
                                        layoutId={record.ManageID.toString()}
                                        key={record.ManageID.toString()}
                                        animate={{opacity:1,y:0}}
                                        exit={{opacity:0,y:20}}
                                        transition={{duraiton:0.3}}
                                    >
                                        <div className='flex flex-col items-center justify-center' key={`${record.ManageID}-unique`}>
                                            <AttendanceCard record={record} />
                                        </div>
                                    </motion.div>
                                ))
                            }
                            </AnimatePresence>
                        </div>
                    
                </ResizablePanel>
            </ResizablePanelGroup>
            
        </div>
    );
};

export default ImportPage;