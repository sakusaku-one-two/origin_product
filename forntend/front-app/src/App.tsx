import { useEffect } from 'react';
import Layout from './components/pages/layout.tsx'
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';

import './App.css'
import { useRecoilState } from 'recoil';
import { LoginDialogOpen } from './state/openClose.tsx';
import DashBordLayout from './components/pages/dasbord/dashBordLayout.tsx';
import EmployeeTable from './components/pages/employeeList/EmployeeTable.tsx';
import ImportPage from './components/pages/components/inportCsv/importPage.tsx';
import LogRecord from './components/pages/logRecrod/logReocrd.tsx';
// import { useAttendanceDispatch } from './hooks.ts';
// import { INSERT_SETUP as INSERT_ATTENDANCE_MESSAGE } from './redux/slices/attendanceSlice';

// import { sampleAttendanceRecords } from './redux/slices/sampleRecords';

function App() {
  const [isloign,setLogin] = useRecoilState(LoginDialogOpen);
  // const dispatch = useAttendanceDispatch();
  useEffect(()=>{
    setLogin(!isloign);
    // dispatch(INSERT_ATTENDANCE_MESSAGE(sampleAttendanceRecords));
  },[])




  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
            <Route index element={<div>index</div>}/>
            <Route path='employeeList' element={<EmployeeTable/>}/>
            <Route path='dashbord' element={<DashBordLayout/>} />
            <Route path='inportCsv' element={<ImportPage/>} />
            <Route path='logRecord' element={<LogRecord/>} />
            <Route path='*' element={<h1>そのようなページは存在しません</h1>}/>
        </Route>
      </Routes>
    </ Router>
    
  )
}

export default App
