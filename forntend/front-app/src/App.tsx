import { useEffect } from 'react';
import Layout from './components/pages/layout.tsx'
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';

import './App.css'
import { useRecoilState } from 'recoil';
import { LoginDialogOpen } from './state/openClose.tsx';
import DashBord from './components/pages/dasbord/dashBord.tsx';


function App() {
  const [isloign,setLogin] = useRecoilState(LoginDialogOpen);
  useEffect(()=>{
    setLogin(!isloign);
  },[])

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
            <Route index element={<div>index</div>}/>
            <Route path='employeeList' element={<div>employeeList</div>}/>
            <Route path='dashbord' element={<DashBord/>} />
            <Route path='*' element={<h1>そのようなページは存在しません</h1>}/>
        </Route>
      </Routes>
    </ Router>
    
  )
}

export default App
