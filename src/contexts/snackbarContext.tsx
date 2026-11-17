import {createContext, useContext} from 'react'
import {AlertColor} from "@mui/material";

export type SnackBarType = {
  id?: string,
  severity: AlertColor,
  text: string
}

export type SnackbarContextType = {
  active: SnackBarType[],
  createSnackbar: (severity: AlertColor, text: string) => void
}


// @ts-expect-error - initial context value is null before provider initialization
export const SnackbarContext = createContext<SnackbarContextType>(null)

export const useSnackbarContext = (): SnackbarContextType => useContext(SnackbarContext)
