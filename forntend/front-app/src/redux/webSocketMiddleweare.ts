import { Middleware} from '@reduxjs/toolkit';
import { io, socket } from './socket';

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

export const Optons:WebSocketMiddlewareOptions = {
    url: "",
    onOpen:() => {

    },

    onError: (error:Error) => {

    },

    onSend:(message:any) {

    }
}


export const WEBSOCKET_CONNECT = 'WEBSOCKET_CONNECT' as never;
export const WEBSOCKET_CONNECTED = 'WEBSOCKET_CONNECTED' as never;
export const WEBSOCKET_DISCONNECT = 'WEBSOCKET_DISCONNECT' as never;    



export const createWebSocketMiddleware = (options: WebSocketMiddlewareOptions): Middleware => {
    let socket: Socket | null = null;

    //ソケットのミドルウェアを作製　おそらく
    return store => next => action => {
        switch (action.type) {
            case 'WEBSOCKET_CONNECT':
                if (socket) {
                    socket.close();
                }
                socket = io(options.url);
                socket.on('open', options.onOpen);
                socket.on('close', options.onClose);
                socket.on('error', options.onError);
                socket.on('message', (catch_the_message:{type:string,payload:string

                })=> {
                    store.dispatch({
                        type:catch_the_message.type,
                        payload:catch_the_message.payload,
                    });

                });
                socket.on('connect',() => {
                    store.dispatch({type: 'WEBSOCKET_CONNECTED'});
                });
                break;
            
                case 'WEBSOCKET_DISCONNECT':
                if (socket) {
                    
                }

                case ''
        }

        return next(action)
        
    }
}
