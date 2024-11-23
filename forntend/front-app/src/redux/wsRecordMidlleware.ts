import { Middleware,Dispatch } from '@reduxjs/toolkit';
import type { AttendanceRecord,EmployeeRecord,LocationRecord,TimeRecord } from "./taskSlice";
import { Store } from "@reduxjs/toolkit";
import { WEBSOCKET_CONNECT} from './webSocketMiddleweare';

export type ServerActionType = {Action:string,Payload:unknown};
export type ClientActionType = {type:string,payload:unknown};

export type CaseType = {
    type:string,//メッセージの種類（redux向け)
    ModelType:AttendanceRecord |  TimeRecord |  LocationRecord | EmployeeRecord | null,
    Action:string//メッセージの種類（サーバー向け）
}

export class CasePattern<T> {
    type:string;
    Action:string;
    ModelType!:T;
    constructor(type:string,Action:string){
        this.type = type;
        this.Action = Action;
    }
    parse(payload:unknown):T{
        return payload as T;
    }
    
}

export const Cases:CasePattern<AttendanceRecord |  TimeRecord |  LocationRecord | EmployeeRecord | null>[] = [
    new CasePattern<AttendanceRecord>("ATTENDANCE_RECORD/UPDATE","ATTENDANCE_RECORD/UPDATE_MESSAGE"),
    new CasePattern<AttendanceRecord>("ATTENDANCE_RECORD/DELETE","ATTENDANCE_RECORD/DELETE_MESSAGE"),
    new CasePattern<TimeRecord>("TIME_RECORD/UPDATE","TIME_RECORD/UPDATE_MESSAGE"),
    new CasePattern<TimeRecord>("TIME_RECORD/DELETE","TIME_RECORD/DELETE_MESSAGE"),
    new CasePattern<LocationRecord>("LOCATION_RECORD/UPDATE","LOCATION_RECORD/UPDATE_MESSAGE"),
    new CasePattern<LocationRecord>("LOCATION_RECORD/DELETE","LOCATION_RECORD/DELETE_MESSAGE"),
    new CasePattern<EmployeeRecord>("EMPLOYEE_RECORD/UPDATE","EMPLOYEE_RECORD/UPDATE_MESSAGE"),
    new CasePattern<EmployeeRecord>("EMPLOYEE_RECORD/DELETE","EMPLOYEE_RECORD/DELETE_MESSAGE"),
    new CasePattern("CLOSE","CLOSE/MESSAGE"),
];




//サーバーからのメッセージを受け取った際の処理を登録する。
export function OnMessageSetUp(dispatch:Dispatch,socket:WebSocket){
    socket.onmessage = (target:MessageEvent<ServerActionType>)=>{
        const actionType = target.data as ServerActionType;
        const casePattern:CasePattern<AttendanceRecord |  TimeRecord |  LocationRecord | EmployeeRecord | null>|undefined = Cases.find(c=>c.type === actionType.Action);
        if (casePattern) {
            dispatch({type:casePattern.Action,payload:casePattern.parse(actionType.Payload)});
        }
    }
};

//サーバーへのメッセージを送信する際のアクションをサーバーように変換して送信
export function OnSend(socket:WebSocket,action:ClientActionType):boolean {   
    const casePattern:CasePattern<AttendanceRecord |  TimeRecord |  LocationRecord | EmployeeRecord | null>|undefined = Cases.find(c=>c.type === action.type);
    if (casePattern) {
        socket.send(JSON.stringify({Action:casePattern.type,Payload:casePattern.parse(action.payload)}));
        return true;
    }
    return false;   
};

let WEBSOCKET : WebSocket | undefined = undefined;
let WEB_SOCKET_URL = process.env.REACT_APP_WEBSOCKET_URL;

export const getWebSocket = (store:Store)=>{
    if (typeof WEBSOCKET === "undefined") {
        try {
            WEBSOCKET = new WebSocket(WEB_SOCKET_URL as string);
            WEBSOCKET.onerror = ()=>{
                store.dispatch({type:"WEBSOCKET/ERROR",payload:"シンクロに失敗しました。"});
            };
            WEBSOCKET.onopen = ()=>{
                store.dispatch({type:"WEBSOCKET/OPEN",payload:"シンクロを開始します。"});
            };
        } catch (error) {
            const err = error as Error
            store.dispatch({type:"WEBSOCKET/ERROR",payload:err.message});
        }
        
    }
    return WEBSOCKET as WebSocket;
}


//ソケットのミドルウェアを作製 受信時と送信時のtypeに応じた分岐処理を行う
//アクション発行　＝＞　ミドルウェア　＝＞　ミドルウェアの中でwebソケットでメッセージをサーバーに送信しredux reducerには届けない。
//サーバーでは、メッセージを受け取ったら、そのメッセージに応じたDBやキャッシュの更新を行う　＝＞　その内容をサーバープッシュしredux reducerに届ける
export const createWebSocketMiddleware = (): Middleware => {
    let mysocket:WebSocket | undefined = undefined;
    
    //ソケットのミドルウェアを作製 受信時と送信時のtypeに応じた分岐処理を行う
    return (store) => (next) => (action : unknown) => {
        const actionName = action as ClientActionType;
        if (actionName.type === WEBSOCKET_CONNECT) {//接続のアクションが発行されたら、ソケットを作成し、受信のコールバックを設定する
            mysocket = getWebSocket(store as Store);
            OnMessageSetUp(store.dispatch,mysocket);//websocketインスタンスの受信コールバックを設定する。受信したアクションobjectをdispatch
        }
        if (typeof mysocket !== "undefined") {//ソケットが作成されている場合は、送信のアクションが発行されたら、ソケットにメッセージを送信する
            if(OnSend(mysocket,actionName)){//サーバーに送信対象のアクションを送信する
            return;
        }
        }
        
        return next(action);
    };
};

