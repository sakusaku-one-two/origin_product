import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import Stores from './Stores.tsx';
import './index.css';
createRoot(document.getElementById('root')).render(React.createElement(StrictMode, null,
    React.createElement(Stores, null,
        React.createElement(App, null))));
