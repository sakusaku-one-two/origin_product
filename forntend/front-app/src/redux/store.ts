import { configureStore,Middleware } from "@reduxjs/toolkit";
import attendanceReducer from "./slices/attendanceSlice";
import employeeReducer from "./slices/employeeSlice"; 
import timeReducer from "./slices/timeSlice";
import locationReducer from "./slices/locationSlice"; 
import { createWebSocketMiddleware } from "./wsRecordMidlleware";

const WsMiddleware:Middleware = createWebSocketMiddleware();

const RecordStore = configureStore({
  reducer: {
      ATTENDANCE_RECORDS:attendanceReducer,
      EMPLOYEE_RECORDS:employeeReducer,
      TIME_RECORDS:timeReducer,
      LOCATION_RECORDS:locationReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(WsMiddleware),
  devTools:process.env.NODE_ENV !== "production",
});

export default RecordStore;

/*
`configureStore`は、Redux ToolkitでReduxストアを簡単に設定するための関数です。
この関数は、複数の設定オプションを受け取ることができ、それぞれのオプションがストアの動作を制御します。
以下に、`configureStore`の主な引数について詳しく説明します。

*/