import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import Stores from './Stores.tsx'
import './index.css'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <Stores>
        <App />
      </Stores>
  </StrictMode>,
)
