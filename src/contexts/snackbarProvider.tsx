import {ReactNode, useState} from "react";
import {Alert, AlertColor, Snackbar} from "@mui/material";
import {SnackbarContext, SnackBarType} from "./snackbarContext.tsx";

let snackbarIdCounter = 0;

export const SnackbarProvider = ({children}: { children: ReactNode }) => {
  const [snackbars, setSnackbars] = useState<SnackBarType[]>([])

  const handleAddSnackbar = (severity: AlertColor, text: string) => {
    const id = `${Date.now()}-${++snackbarIdCounter}`;
    setSnackbars(prevState => [...prevState, {
      id,
      severity,
      text
    }])
  }

  const handleDeleteSnackbar = (id?: string) => {
    setSnackbars(prevState => prevState.filter(x => x.id !== id))
  }


  return (
      <SnackbarContext.Provider value={{
        active: snackbars,
        createSnackbar: handleAddSnackbar
      }}>
        {children}
        <>
          {
            snackbars.map((snackbar, i) => (
                <Snackbar
                    key={snackbar.id}
                    open={true}
                    autoHideDuration={4000}
                    onClose={(_, reason) => {
                      if (reason === 'clickaway') return;
                      handleDeleteSnackbar(snackbar.id);
                    }}
                    sx={{
                      bottom: `${24 + i * 56}px !important`,
                      transition: 'bottom 0.2s ease-in-out'
                    }}
                >
                  <Alert
                      onClose={() => handleDeleteSnackbar(snackbar.id)}
                      severity={snackbar.severity}
                      variant="filled"
                      sx={{width: '100%', boxShadow: 3}}
                  >
                    {snackbar.text}
                  </Alert>
                </Snackbar>
            ))
          }
        </>
      </SnackbarContext.Provider>
  )
}
