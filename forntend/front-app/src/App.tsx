import { useState } from 'react';
import Layout from './components/pages/layout.tsx'
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';

import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (

    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
            <Route index element={<div>index</div>}/>
            <Route path='employeeList' element={<div>employeeList</div>}/>
        </Route>
      </Routes>
    </ Router>
    
  )
}

export default App
