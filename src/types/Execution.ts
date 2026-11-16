// Protocolo del WebSocket de ejecución interactiva (snippet-service, ADR-003).
// La ejecución arranca al conectarse; después de "finished" o "error" el servidor cierra el socket.

export type ServerMessage =
    | { type: "output"; line: string }
    | { type: "input-request" }
    | { type: "finished"; errors: string[] }
    | { type: "error"; code: string; message?: string }

export type ClientMessage =
    | { type: "input"; value: string }
    | { type: "stop" }

export type ExecutionStatus =
    | "idle"           // todavía no se corrió
    | "connecting"     // pidiendo el token / abriendo el socket
    | "running"        // corriendo, mostrando outputs
    | "waiting-input"  // el programa llamó a readInput
    | "finished"       // terminó (con o sin errores del código)
    | "stopped"        // lo cortó el usuario
    | "failed"         // no se pudo correr o se cortó la conexión

// Lo que se ve en la consola: lo que imprimió el programa, lo que escribió el usuario y los errores.
export type ConsoleLine = {
  kind: "output" | "input" | "error";
  text: string;
}
