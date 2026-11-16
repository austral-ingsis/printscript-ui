import {useEffect, useRef, useState} from "react";
import {Alert, Box, Button, Chip, OutlinedInput, Typography} from "@mui/material";
import {PlayArrow, StopRounded} from "@mui/icons-material";
import {useSnippetExecution} from "../hooks/useSnippetExecution.ts";
import {ConsoleLine, ExecutionStatus} from "../types/Execution.ts";

type SnippetExecutionProps = {
  snippetId: string;
  // El servidor corre el código guardado: si hay cambios sin guardar, se avisa.
  hasUnsavedChanges: boolean;
}

const STATUS_LABEL: Record<ExecutionStatus, string> = {
  "idle": "Not run yet",
  "connecting": "Starting...",
  "running": "Running",
  "waiting-input": "Waiting for input",
  "finished": "Finished",
  "stopped": "Stopped",
  "failed": "Failed",
}

const STATUS_COLOR: Record<ExecutionStatus, "default" | "info" | "warning" | "success" | "error"> = {
  "idle": "default",
  "connecting": "info",
  "running": "info",
  "waiting-input": "warning",
  "finished": "success",
  "stopped": "default",
  "failed": "error",
}

const LINE_COLOR: Record<ConsoleLine["kind"], string> = {
  output: "white",
  input: "#7dd3fc",
  error: "#f87171",
}

export const SnippetExecution = ({snippetId, hasUnsavedChanges}: SnippetExecutionProps) => {
  const {lines, status, isRunning, run, sendInput, stop} = useSnippetExecution(snippetId)
  const [input, setInput] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const consoleRef = useRef<HTMLDivElement>(null)
  const waitingInput = status === "waiting-input"

  // El foco va al input cuando el programa lo pide, y la consola sigue a la última línea.
  useEffect(() => {
    if (waitingInput) inputRef.current?.focus()
  }, [waitingInput])
  useEffect(() => {
    consoleRef.current?.scrollTo({top: consoleRef.current.scrollHeight})
  }, [lines])

  const handleEnter = (event: { key: string }) => {
    if (event.key === 'Enter' && waitingInput) {
      sendInput(input)
      setInput("")
    }
  }

  return (
      <Box display="flex" flexDirection="column" gap={1}>
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="h6">Output</Typography>
          <Chip size="small" label={STATUS_LABEL[status]} color={STATUS_COLOR[status]}/>
          <Box flex={1}/>
          {isRunning ? (
              <Button variant="outlined" color="error" startIcon={<StopRounded/>} onClick={stop}>
                Stop
              </Button>
          ) : (
              <Button variant="contained" startIcon={<PlayArrow/>} onClick={run}>
                Run
              </Button>
          )}
        </Box>
        {hasUnsavedChanges && (
            <Alert severity="warning">You have unsaved changes: the saved version of the snippet is the one that runs.</Alert>
        )}
        <Box ref={consoleRef} data-testid="execution-console" minHeight={200} maxHeight={400} overflow="auto"
             bgcolor="black" p={1.5} fontFamily="monospace" fontSize={17} whiteSpace="pre-wrap">
          {lines.length === 0 ? (
              <span style={{color: "#9ca3af"}}>
                {status === "idle" ? "Press Run to execute the saved snippet." : ""}
              </span>
          ) : lines.map((line, index) => (
              <div key={index} style={{color: LINE_COLOR[line.kind]}}>
                {line.kind === "input" ? `> ${line.text}` : line.text}
              </div>
          ))}
        </Box>
        <OutlinedInput
            inputRef={inputRef}
            onKeyDown={handleEnter}
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={!waitingInput}
            placeholder={waitingInput ? "The program is waiting for input: type and press Enter" : "Input is enabled when the program asks for it"}
            fullWidth
        />
      </Box>
  )
}
