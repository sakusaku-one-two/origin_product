import React, { useState } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from 'react-resizable-panels';
import AttendanceCard from './AttendanceCard';

const ImportPage: React.FC = () => {
    // 既存のstate
    const [fromCsv, setFromCsv] = useState<Map<number, AttendanceRecord[]>>(new Map());
    const [fromDb, setFromDb] = useState<Map<number, AttendanceRecord[]>>(new Map());
    const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord[]>([]);
    
    // ローディング状態の追加
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const SetCsvHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files?.length) return;
        
        try {
            setIsLoading(true);
            setError(null);
            const file = event.target.files[0];
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('api/Csvcheck', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'CSVの処理中にエラーが発生しました');
            }
            
            const result = await response.json() as ComfirmationRecords;
            setFromCsv(result.FromCsv);
            setFromDb(result.FromDb);
            setSelectedRecord(result.UniqueRecord);
        } catch (err) {
            setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='h-screen p-4'>
            <div className='mb-4'>
                <input 
                    type="file" 
                    accept='text/csv' 
                    onChange={SetCsvHandler}
                    disabled={isLoading}
                    className='mb-2'
                />
                {isLoading && <p className='text-blue-500'>処理中...</p>}
                {error && <p className='text-red-500'>{error}</p>}
            </div>
            
            <ResizablePanelGroup direction='horizontal' className='h-[calc(100vh-100px)]'>
                <ResizablePanel defaultSize={30}>
                    <div className='flex flex-col items-center p-4 h-full overflow-auto'>
                        <h1 className='text-xl font-bold mb-4'>CSV</h1>
                        {fromCsv.size > 0 &&
                            Array.from(fromCsv.values()).flat().map((record) => (
                                <AttendanceCard key={`csv-${record.id}`} record={record} />
                            ))
                        }
                    </div>
                </ResizablePanel>
                <ResizableHandle />
                {/* 他のパネルも同様に更新 */}
            </ResizablePanelGroup>
        </div>
    );
};

export default ImportPage; 