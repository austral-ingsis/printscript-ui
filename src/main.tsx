import React from 'react';
import App from './App.tsx'
import './index.css'
import {createRoot} from "react-dom/client";
import {PaginationProvider} from "./contexts/paginationProvider.tsx";
import {SnackbarProvider} from "./contexts/snackbarProvider.tsx";
import {Auth0Provider} from "@auth0/auth0-react";

createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <PaginationProvider>
        <SnackbarProvider>
            <Auth0Provider
                domain="dev-n5rdb5xcsb4ya1cg.us.auth0.com"
                clientId="lCrzgtui3ckfodVyLn2ELx54bsSbIgs4"
                authorizationParams={{
                    redirect_uri: window.location.origin
                }}
            >
                <App/>
            </Auth0Provider>
        </SnackbarProvider>
      </PaginationProvider>
    </React.StrictMode>,
)
