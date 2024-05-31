import React from 'react';
import App from './App.tsx'
import './index.css'
import {createRoot} from "react-dom/client";
import {PaginationProvider} from "./contexts/paginationProvider.tsx";
import {SnackbarProvider} from "./contexts/snackbarProvider.tsx";
import { Auth0ProviderWithNavigate } from './utils/Auth0ProviderWithNavigation.tsx';
import { BrowserRouter } from 'react-router-dom';


createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <PaginationProvider>
        <SnackbarProvider>
          <BrowserRouter>
          <Auth0ProviderWithNavigate>
          <App/>
          </Auth0ProviderWithNavigate>
          </BrowserRouter>
        </SnackbarProvider>
      </PaginationProvider>
    </React.StrictMode>
)
