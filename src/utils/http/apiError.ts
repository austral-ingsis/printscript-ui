import {isAxiosError} from "axios";

/** Un error de validación del snippet: qué regla incumplió y dónde (línea y columna). */
export type ValidationError = {
  rule: string
  message: string
  line: number
  column: number
}

export type ApiErrorInfo = {
  message: string
  validationErrors: ValidationError[]
}

// Cuerpo de error de snippet-service: { error, message, errors: [{ rule, message, line, column }] }
type ErrorBody = {
  error?: string
  message?: string
  errors?: ValidationError[]
}

const UNAVAILABLE = "The service is not available right now. Try again in a moment."
const SESSION_EXPIRED = "Your session expired. Reload the page to log in again."

// Mensajes para el usuario según el código `error` del backend.
const FRIENDLY_MESSAGES: Record<string, string> = {
  UNAUTHENTICATED: SESSION_EXPIRED,
  ACCESS_DENIED: "You don't have permission to do this.",
  SNIPPET_NOT_FOUND: "This snippet doesn't exist or you don't have access to it.",
  USER_NOT_FOUND: "That user doesn't exist.",
  STORAGE_UNAVAILABLE: UNAVAILABLE,
  PERMISSIONS_UNAVAILABLE: UNAVAILABLE,
  USERS_UNAVAILABLE: UNAVAILABLE,
}

// Errores del SDK de Auth0 cuando no puede renovar el token.
const AUTH0_SESSION_ERRORS = ["login_required", "consent_required", "missing_refresh_token"]

export function describeError(error: unknown): ApiErrorInfo {
  if (isAxiosError<ErrorBody>(error)) {
    if (!error.response) {
      return {message: "Could not reach the server. Check your connection and try again.", validationErrors: []}
    }
    const {status, data} = error.response
    const code = data?.error
    const friendly = code ? FRIENDLY_MESSAGES[code] : undefined
    return {
      // INVALID_SNIPPET, INVALID_REQUEST e INVALID_SHARE traen un mensaje pensado para mostrarse.
      message: friendly ?? data?.message ?? `Something went wrong (${status}).`,
      validationErrors: data?.errors ?? [],
    }
  }
  const auth0Code = (error as { error?: unknown } | null)?.error
  if (typeof auth0Code === "string" && AUTH0_SESSION_ERRORS.includes(auth0Code)) {
    return {message: SESSION_EXPIRED, validationErrors: []}
  }
  return {message: "Something went wrong. Try again.", validationErrors: []}
}

/** Un 4xx no se arregla reintentando: el pedido mismo está mal o no está permitido. */
export const isClientError = (error: unknown): boolean => {
  const status = isAxiosError(error) ? error.response?.status : undefined
  return status !== undefined && status >= 400 && status < 500
}
