import {Alert, Box, Button} from "@mui/material";
import {describeError} from "../../utils/http/apiError.ts";

type ApiErrorAlertProps = {
  error: unknown
  onRetry?: () => void
}

/** Muestra un error del backend. Si el snippet es inválido, lista cada regla con su línea y columna. */
export const ApiErrorAlert = ({error, onRetry}: ApiErrorAlertProps) => {
  const {message, validationErrors} = describeError(error)

  return (
      <Alert severity="error" role="alert" data-testid="api-error"
             action={onRetry && <Button color="inherit" size="small" onClick={onRetry}>Retry</Button>}>
        {message}
        {validationErrors.length > 0 && (
            <Box component="ul" sx={{m: 0, mt: 1, pl: 2}}>
              {validationErrors.map((e, i) => (
                  <li key={i}>
                    <strong>{e.rule}</strong>: {e.message} (line {e.line}, column {e.column})
                  </li>
              ))}
            </Box>
        )}
      </Alert>
  )
}
