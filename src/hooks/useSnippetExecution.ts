import {useCallback, useEffect, useRef, useState} from "react";
import {useAuth0} from "@auth0/auth0-react";
import {BACKEND_URL} from "../utils/constants.ts";
import {ClientMessage, ConsoleLine, ExecutionStatus, ServerMessage} from "../types/Execution.ts";

// Mensajes para los códigos de error de snippet-service.
const ERROR_MESSAGES: Record<string, string> = {
  NOT_FOUND: "The snippet does not exist or you cannot access it.",
  FORBIDDEN: "You cannot run this snippet.",
  ENGINE_UNAVAILABLE: "The snippet could not be run right now. Try again later.",
  STORAGE_UNAVAILABLE: "The snippet code could not be loaded. Try again later.",
  PERMISSIONS_UNAVAILABLE: "Permissions could not be checked. Try again later.",
  CANCELLED: "This run was stopped because you started another one.",
  INVALID_MESSAGE: "The server did not understand a message.",
}

/**
 * URL del WebSocket de ejecución. BACKEND_URL es relativa ("/api"), así que se arma sobre el host actual y con
 * ws/wss según la página. El token va en la query porque el browser no deja mandar headers en un WebSocket.
 */
export const executionSocketUrl = (snippetId: string, token: string): string => {
  const url = new URL(`${BACKEND_URL}/snippets/${encodeURIComponent(snippetId)}/execution`, window.location.href)
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:"
  url.searchParams.set("access_token", token)
  return url.toString()
}

/**
 * Ejecuta un snippet de forma interactiva: los outputs aparecen a medida que se imprimen y, cuando el programa
 * pide un input, [status] pasa a "waiting-input" hasta que se llama a [sendInput].
 * Una ejecución a la vez: volver a correr corta la anterior (el servidor también lo garantiza por usuario).
 */
export const useSnippetExecution = (snippetId: string) => {
  const {getAccessTokenSilently} = useAuth0()
  const [lines, setLines] = useState<ConsoleLine[]>([])
  const [status, setStatus] = useState<ExecutionStatus>("idle")
  const socketRef = useRef<WebSocket | null>(null)

  const append = (line: ConsoleLine) => setLines(previous => [...previous, line])

  // Suelta el socket actual sin que sus eventos sigan tocando el estado.
  const detach = () => {
    const socket = socketRef.current
    socketRef.current = null
    if (socket && socket.readyState <= WebSocket.OPEN) socket.close()
  }

  const run = useCallback(async () => {
    detach()
    setLines([])
    setStatus("connecting")

    let token: string
    try {
      token = await getAccessTokenSilently()
    } catch {
      append({kind: "error", text: "Your session expired. Log in again to run the snippet."})
      setStatus("failed")
      return
    }

    const socket = new WebSocket(executionSocketUrl(snippetId, token))
    socketRef.current = socket
    // Solo el socket actual actualiza el estado: uno viejo puede seguir mandando eventos un momento.
    const current = () => socketRef.current === socket
    let ended = false

    socket.onopen = () => {
      if (current()) setStatus("running")
    }

    socket.onmessage = (event: MessageEvent<string>) => {
      if (!current()) return
      const message = JSON.parse(event.data) as ServerMessage
      switch (message.type) {
        case "output":
          append({kind: "output", text: message.line})
          break
        case "input-request":
          setStatus("waiting-input")
          break
        case "finished":
          ended = true
          message.errors.forEach(text => append({kind: "error", text}))
          setStatus("finished")
          break
        case "error":
          ended = true
          append({kind: "error", text: ERROR_MESSAGES[message.code] ?? message.message ?? "The run failed."})
          setStatus("failed")
          break
      }
    }

    socket.onclose = () => {
      if (!current()) return
      socketRef.current = null
      if (!ended) {
        append({kind: "error", text: "The connection with the server was lost."})
        setStatus("failed")
      }
    }
  }, [getAccessTokenSilently, snippetId])

  const send = (message: ClientMessage) => {
    const socket = socketRef.current
    if (socket?.readyState === WebSocket.OPEN) socket.send(JSON.stringify(message))
  }

  const sendInput = useCallback((value: string) => {
    send({type: "input", value})
    append({kind: "input", text: value})
    setStatus("running")
  }, [])

  const stop = useCallback(() => {
    send({type: "stop"})
    detach()
    setStatus("stopped")
  }, [])

  // Al cerrar el detalle (o cambiar de snippet) se corta la ejecución.
  useEffect(() => detach, [snippetId])

  const isRunning = status === "connecting" || status === "running" || status === "waiting-input"

  return {lines, status, isRunning, run, sendInput, stop}
}
