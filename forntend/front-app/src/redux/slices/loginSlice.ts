import { createSlice,PayloadAction } from "@reduxjs/toolkit";


//
export interface LoginInfo {
    userName:string;
    isLogin:boolean;
}
//---------------------------[初期値]----------------------------
export const initialLoginState:LoginInfo = {
    userName:'' as string,
    isLogin:false as boolean,
};



export const LoginSlice = createSlice({
    name:"LOGIN",
    initialState:initialLoginState,
    reducers: {
        UPDATE:(state,action:PayloadAction<LoginInfo>)=>{
            state.userName = action.payload.userName;
            state.isLogin = action.payload.isLogin;
        }
    }
});



export const {UPDATE} = LoginSlice.actions;
export default LoginSlice.reducer;
