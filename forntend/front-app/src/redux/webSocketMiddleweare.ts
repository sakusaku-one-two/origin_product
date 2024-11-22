import { Middleware} from '@reduxjs/toolkit';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

export interface WebSocketMiddlewareOptions {
    url: string;
    onOpen: () => void;
    onClose: () => void;
    onError: (error: Error) => void;
    onMessage: (message: MessageEvent<any>) => void;
    onConnected: () => void;
    onDisconnected: () => void;
    onSend: (message: any) => void;
};


export const WEBSOCKET_CONNECT      = 'WEBSOCKET_CONNECT' as never;
export const WEBSOCKET_CONNECTED    = 'WEBSOCKET_CONNECTED' as never;
export const WEBSOCKET_DISCONNECT   = 'WEBSOCKET_DISCONNECT' as never;   
export const WEBSOCKET_NEW_MESSAGE  = 'WEBSOCKET_NEW_MESSAGE' as never;
export const WEBSOCKET_SEND_MESSAGE = 'WEBSOCKET_SEND_MESSAGE' as never;

//エントリーポイントでソケットを開く
export const useStartUpWebSocketAtEntryPoint = () => {
    const dispatch = useDispatch();
    useEffect(()=>{
        dispatch({type: WEBSOCKET_CONNECT});
    },[]);
}

//ブラウザの音声合成機能を利用してメッセージを読み上げる
function Announce(message:string) {
    const utterance = new SpeechSynthesisUtterance(message);
    window.speechSynthesis.speak(utterance);
}


export const createWebSocketMiddleware = (options: WebSocketMiddlewareOptions): Middleware => {
    let socket: WebSocket | null = null;//このソケットを利用してリアルタイムを行う

    const SocketCloser = ()=>{
        if (socket) {
            socket.send(JSON.stringify({
                Action:"CLOSE",
                Payload:{}
            }));
        }
    }
    //ソケットのミドルウェアを作製　おそらく
    return store => next => (action : unknown) => {
        const actionType = action as {type :string,payload:unknown};
        switch (actionType.type) {
            case 'WEBSOCKET_CONNECT':
                SocketCloser();//一回ソケットがすでにあれば閉じる
                socket = new WebSocket(options.url);
                socket.onopen = () => {
                    Announce("リアルタイム処理が開始しました。");
                    store.dispatch({type:WEBSOCKET_CONNECTED,payload:{
                        Message:"リアルタイム処理が開始しました。"
                    }});
                }
                
                break;
            case 'WEBSOCKET_DISCONNECT':
                if (socket) {
                    socket.close();
                }
                break;
            case 'ATTENDANCE_RECORD_UPDATE':
                if (socket) {
                    socket.send(JSON.stringify({
                        Action:"ATTENDANCE_RECORD_UPDATE",
                        Payload:actionType.payload
                    }));
                }
                break;
            case 'TIME_RECORD_UPDATE':
                if (socket) {
                    socket.send(JSON.stringify({
                        Action:"TIME_RECORD_UPDATE",
                        Payload:actionType.payload
                    }));
                }
                break;
            case 'EMPLOYEE_RECORD_UPDATE':
                if (socket) {
                    socket.send(JSON.stringify({
                        Action:"EMPLOYEE_RECORD_UPDATE",
                        Payload:actionType.payload
                    }));
                }
                break;
            default:
                return next(action);
        }

        
    }
}
