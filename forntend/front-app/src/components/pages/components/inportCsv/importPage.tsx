import React,{useState} from 'react';

//CSVをサーバーに送るページ
const ImportPage:React.FC = () => {

    const [csvData,setCsvData] = useState<string>("");
    const SetCsvHandler = (event:HTMLInputElement|any) => {
        if (!(event.target instanceof HTMLInputElement)) return;
        if (!event.target.files) return;

        
        const file = event.target.files[0];
        
        const setCsv = async (data:File|Blob) => {
            const csv_data:string = await data.text();
            setCsvData (csv_data);
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