import { useEffect } from 'react';
import Layout from './components/pages/layout.tsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { useRecoilState } from 'recoil';
import { LoginDialogOpen } from './state/openClose.tsx';
import DashBordLayout from './components/pages/dasbord/dashBordLayout.tsx';
import EmployeeTable from './components/pages/employeeList/EmployeeTable.tsx';
import ImportPage from './components/pages/components/inportCsv/importPage.tsx';
import RecordLogs from './components/pages/recordlog/recordLogs.tsx';
// import { useAttendanceDispatch } from './hooks.ts';
// import { INSERT_SETUP as INSERT_ATTENDANCE_MESSAGE } from './redux/slices/attendanceSlice';
// import { sampleAttendanceRecords } from './redux/slices/sampleRecords';
function App() {
    var _a = useRecoilState(LoginDialogOpen), isloign = _a[0], setLogin = _a[1];
    // const dispatch = useAttendanceDispatch();
    useEffect(function () {
        setLogin(!isloign);
        // dispatch(INSERT_ATTENDANCE_MESSAGE(sampleAttendanceRecords));
    }, []);
    return (React.createElement(Router, null,
        React.createElement(Routes, null,
            React.createElement(Route, { path: "/", element: React.createElement(Layout, null) },
                React.createElement(Route, { index: true, element: React.createElement("div", null, "index") }),
                React.createElement(Route, { path: 'employeeList', element: React.createElement(EmployeeTable, null) }),
                React.createElement(Route, { path: 'dashbord', element: React.createElement(DashBordLayout, null) }),
                React.createElement(Route, { path: 'inportCsv', element: React.createElement(ImportPage, null) }),
                React.createElement(Route, { path: 'recordLog', element: React.createElement(RecordLogs, null) }),
                React.createElement(Route, { path: '*', element: React.createElement("h1", null, "\u305D\u306E\u3088\u3046\u306A\u30DA\u30FC\u30B8\u306F\u5B58\u5728\u3057\u307E\u305B\u3093") })))));
}
export default App;
