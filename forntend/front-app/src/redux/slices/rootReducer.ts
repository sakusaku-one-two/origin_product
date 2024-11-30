import { combineReducers } from "@reduxjs/toolkit";
import attendanceSlice from "./attendanceSlice";
import employeeSlice from "./employeeSlice";
import timeSlice from "./timeSlice";
import locationSlice from "./locationSlice";
import postSlice from "./postSlice";

const RecordReducer = combineReducers({
    attendance:attendanceSlice,
    employee:employeeSlice,
    time:timeSlice,
    location:locationSlice,
    post:postSlice,
}); 

export default RecordReducer;
