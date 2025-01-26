var _a;
import { createSlice } from "@reduxjs/toolkit";
var initialState = {
    State: "",
    IsConnection: false,
    error: null
};
var WebSocketSlice = createSlice({
    name: "WEBSOCKET",
    initialState: initialState,
    reducers: {
        ERROR: function (state, action) {
            state.IsConnection = false;
            state.State = action.payload;
            state.error = null;
        },
        OPENED: function (state, action) {
            state.IsConnection = true;
            state.State = action.payload;
            state.error = null;
        },
    }
});
export var ERROR = (_a = WebSocketSlice.actions, _a.ERROR), OPENED = _a.OPENED;
export default WebSocketSlice.reducer;
