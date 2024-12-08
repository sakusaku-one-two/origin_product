import { Middleware,Dispatch} from '@reduxjs/toolkit';
import type { AttendanceRecord,EmployeeRecord,LocationRecord,TimeRecord } from "./recordType";



type ActionType = {type:string,payload:unknown | RecordType | RecordArrayType | null};
type RecordType = TimeRecord | AttendanceRecord | LocationRecord | EmployeeRecord;
type RecordArrayType = RecordType[];
let socket:WebSocket;

// WebSocketのインスタンスを取得
function getSocket():WebSocket {
    if (!socket) {
        socket = new WebSocket(import.meta.env.VITE_WS_URL);
    }
    return socket;
};

// サーバーリアルタイム接続の初期化 
function WebSocketSetup(socket:WebSocket,next:Dispatch):void{
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

    };  
    // サーバーからのメッセージを受信
    socket.onmessage = (event:MessageEvent<{Action:string,Payload:unknown | RecordType}>)=>{
        next({
            type:event.data.Action,
            payload:event.data.Payload as RecordType | RecordArrayType
        });
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
                WebSocketSetup(socket,next as Dispatch);
                return;
            default:
                // サーバーへのメッセージ送信
                if (socket) {
                    socket.send(JSON.stringify({
                        Action:actionObject.type,
                        Payload:actionObject.payload
                    }));
                    return ;
                } else {
                    // サーバーリアルタイム接続が開始していない場合は、通常のミドルウエアに渡す
                    next(action);
                }
            
        };
    };
};

export default WebSocketMiddleware;
