
// CSVの読み取りに関するヘルパー関数
// 業務システムから吐き出されるCSVがUTF-8のDOM付きなので、直接バックエンドに送信してもGO側で対応していない。
// 一応フロント側でDOM付きか判定して、DOM付きなら外す処理を挟む。


export interface CleandUtf {
    result:boolean
    CsvFile:File
    CsvFileReader:FileReader
    text:string
    errorMessage:string
};



//DOM付きか判定して、DOM付きなら外す処理を挟む。
export default function Utf8Clean(target:File,callbackFunction:Function):CleandUtf {
    //CSVファイルか判定
    //もしCSVであればBOM付きの判定とトリアージを実行
    return forCSV(target);
};


//CSVか判定
const forCSV = (target:File):CleandUtf =>  {
    if(!target) return {result:false} as CleandUtf;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        const readAsArrayBuffer = e.target?.result as string;
        //文字列インスタンスかの判定　文字列では無ければエラーを飛ばす。
        if (typeof readAsArrayBuffer !== 'string') new Error("文字列として扱えないファイルが渡されました。");
    };

    try {
        reader.readAsText(target,'utf-8');
    } catch (error:any | Error) {
        return {
            result:false,
            errorMessage : error.message,
        } as CleandUtf;
    };

    const reulstFromReadeer:string | ArrayBuffer | null = reader.;
    const text:string|null =  reulstFromReadeer instanceof ArrayBuffer ? new TextDecoder('utf-8').decode(reulstFromReadeer) : reulstFromReadeer;
    console.log(text,target);
    if(!text) return {result:false,
        errorMessage:'nullでした',
    } as CleandUtf;


    const notBom:string = RemoveBom(text);



    return {
        result:true,
        CsvFile:target,
        CsvFileReader:reader,
        text:notBom,
    } as CleandUtf;
};


//BOMの削除
const RemoveBom = (content:string):string => {
    if (content.startsWith('\ufeff')){
        return content.slice(1);
    }
    return content;
};

