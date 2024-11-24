import { useDispatch,useSelector } from "react-redux";
import { attendanceSlice } from "./redux/slices/attendanceSlice";
import { employeeSlice } from "./redux/slices/employeeSlice";
import { timeSlice } from "./redux/slices/timeSlice";
import { locationSlice } from "./redux/slices/locationSlice";

// -----------------------[AttendanceRecordのディスパッチとセレクターのフック]-----------------------------

export const useAttendanceDispatch = useDispatch.withTypes<typeof attendanceSlice.actions>();
export const useAttendanceSelector = useSelector.withTypes<typeof attendanceSlice.reducer>();

// -----------------------[EmployeeRecordのディスパッチとセレクターのフック]-----------------------------

export const useEmployeeDispatch = useDispatch.withTypes<typeof employeeSlice.actions>();
export const useEmployeeSelector = useSelector.withTypes<typeof employeeSlice.reducer>();

// -----------------------[TimeRecordのディスパッチとセレクターのフック]-----------------------------

export const useTimeDispatch = useDispatch.withTypes<typeof timeSlice.actions>();
export const useTimeSelector = useSelector.withTypes<typeof timeSlice.reducer>();


// -----------------------[LocationRecordのディスパッチとセレクターのフック]-----------------------------

export const useLocationDispatch = useDispatch.withTypes<typeof locationSlice.actions>();
export const useLocationSelector = useSelector.withTypes<typeof locationSlice.reducer>();

