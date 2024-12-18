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
            const  formData = new FormData();
            formData.append('file',data);
            formData.append('fileName',file.name);

            const response = await fetch('api/csvImport',{
                method:'POST',
                body:formData,//formDataを送信(ファイルを送信するために必要)
                headers:{
                    'Content-Type':'multipart/form-data',
                },
            });

            if (!response.ok) {
                alert('ファイルのアップロードに失敗しました');
                return;
            }
            
            const response_json = await response.json();

            if (response_json.status === 'success') {
                console.log(response_json.message);
            } else {
                console.log(response_json.message);
            }
            

            
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