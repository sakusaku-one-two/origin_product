import { configureStore} from "@reduxjs/toolkit";
import attendanceReducer from "./slices/attendanceSlice";
import employeeReducer from "./slices/employeeSlice"; 
import timeReducer from "./slices/timeSlice";
import locationReducer from "./slices/locationSlice"; 
import  WebSocketMiddleware  from "./websocketMiddleware";
import postReducer from "./slices/postSlice";
import websocketSlice from "./slices/websocketSlice";
import selectedRecordsSlice from "./slices/selectedRecordsSlice";
import loginReducer from "./slices/loginSlice";

const RecordStore = configureStore({
  reducer: {
      ATTENDANCE_RECORDS:attendanceReducer,
      EMPLOYEE_RECORDS:employeeReducer,
      TIME_RECORDS:timeReducer,
      LOCATION_RECORDS:locationReducer,
      POST_RECORDS:postReducer,
      WEBSOCKET:websocketSlice,
      SELECTED_RECORDS:selectedRecordsSlice,
      LOGIN:loginReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(WebSocketMiddleware),
  devTools: true,
});

export type RootState = ReturnType<typeof RecordStore.getState>;
export type AppDispatch = typeof RecordStore.dispatch;

export default RecordStore;

/*
`configureStore`は、Redux ToolkitでReduxストアを簡単に設定するための関数です。
この関数は、複数の設定オプションを受け取ることができ、それぞれのオプションがストアの動作を制御します。
以下に、`configureStore`の主な引数について詳しく説明します。

*/