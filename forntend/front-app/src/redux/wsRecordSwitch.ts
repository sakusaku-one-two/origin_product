import { Middleware} from '@reduxjs/toolkit';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import type { AttendanceRecord,EmployeeRecord,LocationRecord,TimeRecord } from "./taskSlice";
import { Store } from "@reduxjs/toolkit";
import { WEBSOCKET_CONNECT, WEBSOCKET_SEND_MESSAGE } from './webSocketMiddleweare';

export type ServerActionType = {Action:string,Payload:unknown};
export type ClientActionType = {type:string,payload:unknown};

export type CaseType = {
    type:string,
    ModelType:AttendanceRecord |  TimeRecord |  LocationRecord | EmployeeRecord | null,
    Action:string
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
    new CasePattern<AttendanceRecord>("ATTENDANCE_RECORD_UPDATE","ATTENDANCE_RECORD_UPDATE_MESSAGE"),
    new CasePattern<AttendanceRecord>("ATTENDANCE_RECORD_DELETE","ATTENDANCE_RECORD_DELETE_MESSAGE"),
    new CasePattern<TimeRecord>("TIME_RECORD_UPDATE","TIME_RECORD_UPDATE_MESSAGE"),
    new CasePattern<TimeRecord>("TIME_RECORD_DELETE","TIME_RECORD_DELETE_MESSAGE"),
    new CasePattern<LocationRecord>("LOCATION_RECORD_UPDATE","LOCATION_RECORD_UPDATE_MESSAGE"),
    new CasePattern<LocationRecord>("LOCATION_RECORD_DELETE","LOCATION_RECORD_DELETE_MESSAGE"),
    new CasePattern<EmployeeRecord>("EMPLOYEE_RECORD_UPDATE","EMPLOYEE_RECORD_UPDATE_MESSAGE"),
    new CasePattern<EmployeeRecord>("EMPLOYEE_RECORD_DELETE","EMPLOYEE_RECORD_DELETE_MESSAGE"),
    new CasePattern("CLOSE","CLOSE_MESSAGE"),
];




//サーバーからのメッセージを受け取った際の処理
export function OnMessage(store:Store,socket:WebSocket){
    socket.onmessage = (target:MessageEvent<ServerActionType>)=>{
        const actionType = target.data as ServerActionType;
        const casePattern:CasePattern<AttendanceRecord |  TimeRecord |  LocationRecord | EmployeeRecord | null>|undefined = Cases.find(c=>c.type === actionType.Action);
        if (casePattern) {
            store.dispatch({type:casePattern.Action,payload:casePattern.parse(actionType.Payload)});
        }
    }
};

//サーバーへのメッセージを送信する際の処理
export function OnSend(socket:WebSocket,action:ClientActionType):boolean {   
    const casePattern:CasePattern<AttendanceRecord |  TimeRecord |  LocationRecord | EmployeeRecord | null>|undefined = Cases.find(c=>c.type === action.type);
    if (casePattern) {
        socket.send(JSON.stringify({Action:casePattern.type,Payload:casePattern.parse(action.payload)}));
        return true;
    }
    return false;   
};



export const wsMiddleware:Middleware = (store:Store)=>(next)=>(action:ClientActionType)=>{
    let socket:WebSocket|null = null;
    if (action.type === WEBSOCKET_CONNECT) {
        socket = new WebSocket("ws://localhost:8080/api/sync");
        OnMessage(store,socket);
    }
    if (socket) {
        OnSend(socket,action);
    }
    return next(action);

};
