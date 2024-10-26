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

export const useStartUpWebSocketAtEntryPoint = () => {
    const dispatch = useDispatch();
    useEffect(()=>{
        dispatch({type: WEBSOCKET_CONNECT});
    },[]);
}


export const createWebSocketMiddleware = (options: WebSocketMiddlewareOptions): Middleware => {
    let socket: WebSocket | null = null;
    //ソケットのミドルウェアを作製　おそらく
    return store => next => action => {
        switch (action.type) {
            case 'WEBSOCKET_CONNECT':
                if (socket) {
                    socket.close();
                }

                socket = new WebSocket(options.url);
                socket.onopen = () => {
                    store.dispatch({type:WEBSOCKET_CONNECTED});
                }
                socket.on('open', options.onOpen);
                socket.on('close', options.onClose);
                socket.on('error', options.onError);
                socket.on('message', options.onMessage);
                socket.on('connect',() => {
                    store.dispatch({type: 'WEBSOCKET_CONNECTED'});
                });
                break;
            case 'WEBSOCKET_DISCONNECT':
                if (socket) {
                    
        }
        
    }
}
