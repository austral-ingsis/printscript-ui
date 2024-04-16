import React from 'react';
import App from './App.tsx'
import './index.css'
import {createRoot} from "react-dom/client";
import {PaginationProvider} from "./contexts/paginationProvider.tsx";

createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <PaginationProvider>
        <App/>
      </PaginationProvider>
    </React.StrictMode>,
)
