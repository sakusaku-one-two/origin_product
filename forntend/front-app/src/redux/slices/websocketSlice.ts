import {createSlice} from "@reduxjs/toolkit";



export type WebSocketInfo = {
    State :string 
    IsConnection:boolean
    error :Error | null
};


const initialState:WebSocketInfo = {
    State:"",
    IsConnection:false,
    error:null
};


const WebSocketSlice = createSlice({
    name:"WEBSOCKET",
    initialState:initialState,
    reducers:{
        ERROR:(state,action) =>{
            state.IsConnection = false;
            state.State = action.payload;
            state.error = null;
        },
        OPENED:(state,action) => {
            state.IsConnection = true;
            state.State = action.payload;
            state.error = null;
        },
    }
});



export const {ERROR,OPENED} = WebSocketSlice.actions;
export default WebSocketSlice.reducer;
