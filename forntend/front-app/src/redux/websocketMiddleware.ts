import { Middleware,Dispatch} from '@reduxjs/toolkit';
import type { AttendanceRecord,EmployeeRecord,LocationRecord,TimeRecord } from "./recordType";
import { RootState } from "./store";
import { TimeRecordWithOtherRecord } from "@/hooks";
import { Store } from "@reduxjs/toolkit";
import { RecordRequest } from './webSocketHelper';


export type ActionType = {type:string,payload:unknown | RecordType | RecordArrayType | null};
export type RecordType = TimeRecord | AttendanceRecord | LocationRecord | EmployeeRecord;
type RecordArrayType = RecordType[];
let socket:WebSocket|null;

// WebSocketのインスタンスを取得
function getSocket():WebSocket {
    if (!socket) {
        socket = new WebSocket(import.meta.env.VITE_WS_URL);
    }
    return socket;
};

function deleteSocket():void {
    socket = null;
}

// サーバーリアルタイム接続の初期化 
function WebSocketSetup(socket:WebSocket,next:Dispatch,store:Store<RootState>):void{
    //nextは次のミドルウエアに渡される関数

    socket.onopen = ()=>{
        next({
            type:"WEBSOCKET/OPENED",
            payload:"サーバーリアルタイム接続が開始しました。"
        });
    };
    // サーバーリアルタイム接続に失敗
    socket.onerror = (event:Event)=>{
        alert("サーバーリアルタイム接続に失敗しました。");
        console.log(event);
        
        next({
            type:"WEBSOCKET/ERROR",
            payload:"websocketの接続に失敗しました。"
        });
        fetch(`api/logout`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            }
        });
        next({  
            type:"LOGIN/UPDATE",
            payload:{
                userName:"",
                isLogin:false
            }
        });
        socket.close();
        
    };  

    socket.onclose = () => {
        alert("リアルタイム同期が切断されました。再度ログインしてください。");
        deleteSocket();
    };
    // サーバーからのメッセージを受信してREDUXのリデューサーに届ける
    socket.onmessage = (event:MessageEvent<string>)=>{
        const state = store.getState();
        const selectedRecord:TimeRecordWithOtherRecord | null = state.SELECTED_RECORDS.selectedRecords;
        const persedEvent = JSON.parse(event.data);
        const actionObject = {type:persedEvent["Action"] as string,payload:persedEvent["Payload"] as RecordType} as ActionType;  
        RecordRequest(state,actionObject);

        // ミドルウエアのチェーンに受信したアクションオブジェクトを渡す
        next(actionObject);

        // 選択中のレコードが更新された場合は、選択中のレコードをクリアする
        if(selectedRecord !== null  && (actionObject.type === "TIME_RECORD/UPDATE" || actionObject.type === "TIME_RECORD/DELETE")){
            const  insertRecord:TimeRecord = actionObject.payload as TimeRecord;
            if (insertRecord.ID === selectedRecord.timeRecord.ID){
                //選択中のレコードをクリアにする。
                next({  
                    type:"SELECTED_RECORDS/SET_SELECTED_RECORDS",
                    payload:null
                });
            }
        }
        
        
    };
}

const WebSocketMiddleware:Middleware = (store)=> (next)=>{
    store.getState();//リンターがうるさいので一回呼び出す。

    let socket:WebSocket | undefined;
    return (action:unknown)=>{
        const actionObject = action as ActionType;
        switch (actionObject.type) {
            case "WEBSOCKET/SETUP":
                // サーバーリアルタイム接続の初期化
                socket = getSocket();
                WebSocketSetup(socket,next as Dispatch,store as Store<RootState>);
                return;
            case "SELECTED_RECORDS/SET_SELECTED_RECORDS":
                // 選択中のレコードを更新
                next(actionObject);
                    
                
                return;
            default:
                // サーバーへのメッセージ送信
                if (socket) {
                    socket.send(JSON.stringify({
                        Action:actionObject.type,
                        Payload:actionObject.payload as RecordType
                    }));
                    return;
                } else {
                    // サーバーリアルタイム接続が開始していない場合は、通常のミドルウエアに渡す
                    next(actionObject);
                }
            
        };
    };
};

export default WebSocketMiddleware;
