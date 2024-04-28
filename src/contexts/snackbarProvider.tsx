import {ReactNode, useState} from "react";
import {Alert, AlertColor, Snackbar} from "@mui/material";
import {SnackbarContext, SnackBarType} from "./snackbarContext.tsx";

export const SnackbarProvider = ({children}: { children: ReactNode }) => {
  const [snackbars, setSnackbars] = useState<SnackBarType[]>([])

  const handleAddSnackbar = (severity: AlertColor, text: string) => {
    setSnackbars(prevState => [...prevState, {
      severity, text
    }])
  }

  const handleDeleteSnackbar = (snackbar: SnackBarType) => {
    setSnackbars(prevState => prevState.filter(x => x != snackbar))
  }


  return (
      <SnackbarContext.Provider value={{
        active: snackbars,
        createSnackbar: handleAddSnackbar
      }}>
        {children}
        <>
          {
            snackbars.map((snackbar,i) => (
                <Snackbar key={i} open={snackbars.includes(snackbar)} autoHideDuration={6000}>
                  <Alert
                      onClose={() => handleDeleteSnackbar(snackbar)}
                      severity={snackbar.severity}
                      variant="filled"
                      sx={{width: '100%'}}
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
