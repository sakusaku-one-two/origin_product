import { createSlice } from "@reduxjs/toolkit";
//---------------------------[初期値]----------------------------
export var initialLoginState = {
    userName: '',
    isLogin: false,
};
export var LoginSlice = createSlice({
    name: "LOGIN",
    initialState: initialLoginState,
    reducers: {
        UPDATE: function (state, action) {
            state.userName = action.payload.userName;
            state.isLogin = action.payload.isLogin;
        }
    }
});
export var UPDATE = LoginSlice.actions.UPDATE;
export default LoginSlice.reducer;
