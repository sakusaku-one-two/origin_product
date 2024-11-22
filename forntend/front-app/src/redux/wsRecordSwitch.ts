import { ActivityIcon } from "lucide-react";
import { AttendanceRecord,EmployeeRecord,LocationRecord,TimeRecord } from "./taskSlice";
import { Store } from "@reduxjs/toolkit";
export type WsRecordSwitch = {
    AttendanceRecord:AttendanceRecord,
    EmployeeRecord:EmployeeRecord,
    LocationRecord:LocationRecord,
    TimeRecord:TimeRecord
}

//ウェブソケットの受信メッセージの処理
export const OnMessageSwitch = (store:Store):((target:MessageEvent<{Action:string,Payload:unknown}>)=>void) => {
    return (target:MessageEvent<{Action:string,Payload:unknown}>)=>{
        switch (target.data.Action) {
            case "ATTENDANCE_RECORD_UPDATE":
                store.dispatch({type:'ATTENDANCE_RECORD_UPDATE_MESSAGE',payload:<AttendanceRecord>target.data.Payload});
            break;
        case "ATTENDANCE_RECORD_DELETE":
            store.dispatch({type:'ATTENDANCE_RECORD_DELETE_MESSAGE',payload:<AttendanceRecord>target.data.Payload});
            break;
        case "TIME_RECORD_UPDATE":
            store.dispatch({type:'TIME_RECORD_UPDATE_MESSAGE',payload:<TimeRecord>target.data.Payload});
            break;
        case "TIME_RECORD_DELETE":
            store.dispatch({type:'TIME_RECORD_DELETE_MESSAGE',payload:<TimeRecord>target.data.Payload});
            break;
        case "EMPLOYEE_RECORD_UPDATE":
                store.dispatch({type:'EMPLOYEE_RECORD_UPDATE_MESSAGE',payload:<EmployeeRecord>target.data.Payload});
                break;
        case "EMPLOYEE_RECORD_DELETE":
            store.dispatch({type:'EMPLOYEE_RECORD_DELETE_MESSAGE',payload:<EmployeeRecord>target.data.Payload});
            break;
        case "LOCATION_RECORD_UPDATE":
            store.dispatch({type:'LOCATION_RECORD_UPDATE_MESSAGE',payload:<LocationRecord>target.data.Payload});
            break;
        case "LOCATION_RECORD_DELETE":
            store.dispatch({type:'LOCATION_RECORD_DELETE_MESSAGE',payload:<LocationRecord>target.data.Payload});
            break;
        default:
            break;
        }   
    };  
};

const ActionTypes = ["ATTENDANCE_RECORD_UPDATE","ATTENDANCE_RECORD_DELETE","TIME_RECORD_UPDATE","TIME_RECORD_DELETE","EMPLOYEE_RECORD_UPDATE","EMPLOYEE_RECORD_DELETE","LOCATION_RECORD_UPDATE","LOCATION_RECORD_DELETE","WEBSOCKET_CLOSE"];
//ウェブソケットの送信メッセージの処理
export const OnSendMessageSwitch = (socket:WebSocket):(action:ActionType<type:string,payload:unknown>) => {
    return (action:ActionType<type:string,payload:unknown>)=>{  
        if (ActionTypes.includes(action.type)) {
            socket.onmessage(JSON.stringify({Action:action.type,Payload:action.payload}));
}

};