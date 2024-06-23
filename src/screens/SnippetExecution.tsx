import {OutlinedInput} from "@mui/material";
import {highlight, languages} from "prismjs";
import Editor from "react-simple-code-editor";
import {Bòx} from "../components/snippet-table/SnippetBox.tsx";
import {useState} from "react";

export const SnippetExecution = () => {
  // Here you should provide all the logic to connect to your sockets.
  const [input, setInput] = useState<string>("")
  const [output, setOutput] = useState<string[]>([]);

  //TODO: get the output from the server
  const code = output.join("\n")

  const handleEnter = (event: { key: string }) => {
    if (event.key === 'Enter') {
      //TODO: logic to send inputs to server
      setOutput([...output, input])
      setInput("")
    }
  };

    return (
      <>
        <Bòx flex={1} overflow={"none"} minHeight={200} bgcolor={'black'} color={'white'} code={code}>
            <Editor
              value={code}
              padding={10}
              onValueChange={(code) => setInput(code)}
              highlight={(code) => highlight(code, languages.js, 'javascript')}
              maxLength={1000}
              style={{
                  fontFamily: "monospace",
                  fontSize: 17,
              }}
            />
        </Bòx>
        <OutlinedInput onKeyDown={handleEnter} value={input} onChange={e => setInput(e.target.value)} placeholder="Type here" fullWidth/>
      </>
    )
}