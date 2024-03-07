import React from 'react';
import App from './App.tsx'
import './index.css'
import {createRoot} from "react-dom/client";

createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>,
)
