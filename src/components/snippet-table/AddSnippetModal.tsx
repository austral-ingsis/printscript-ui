import {
  Box,
  Button,
  capitalize,
  CircularProgress,
  Input,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography
} from "@mui/material";
import {highlight, languages} from "prismjs";
import {useEffect, useState} from "react";
import Editor from "react-simple-code-editor";

import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism-okaidia.css";
import {Save} from "@mui/icons-material";
import {CreateSnippet, CreateSnippetWithLang} from "../../utils/snippet.ts";
import {fileTypes} from "../../utils/fileTypes.ts";
import {ModalWrapper} from "../common/ModalWrapper.tsx";
import {useCreateSnippet} from "../../utils/queries.tsx";

export const AddSnippetModal = ({open, onClose, defaultSnippet}: {
  open: boolean,
  onClose: () => void,
  defaultSnippet?: CreateSnippetWithLang
}) => {
  const [language, setLanguage] = useState(defaultSnippet?.language ?? "printscript");
  const [code, setCode] = useState(defaultSnippet?.content ?? "");
  const [snippetName, setSnippetName] = useState(defaultSnippet?.name ?? "")
  const {mutate: createSnippet, isLoading: loadingSnippet} = useCreateSnippet()

  const handleCreateSnippet = () => {
    const newSnippet: CreateSnippet = {
      name: snippetName,
      content: code,
      language: language
    }
    createSnippet(newSnippet)
  }

  useEffect(() => {
    if (defaultSnippet) {
      setCode(defaultSnippet?.content)
      setLanguage(defaultSnippet?.language)
      setSnippetName(defaultSnippet?.name)
    }
  }, [defaultSnippet]);

  return (
      <ModalWrapper open={open} onClose={onClose}>
        {
          <Box sx={{display: 'flex', flexDirection: "row", justifyContent: "space-between"}}>
            <Typography id="modal-modal-title" variant="h5" component="h2"
                        sx={{display: 'flex', alignItems: 'center'}}>
              Add Snippet
            </Typography>
            <Button disabled={!snippetName || !code || !language || loadingSnippet} variant="contained" disableRipple
                    sx={{boxShadow: 0}} onClick={handleCreateSnippet}>
              <Box pr={1} display={"flex"} alignItems={"center"} justifyContent={"center"}>
                {loadingSnippet ? <CircularProgress size={24}/> : <Save/>}
              </Box>
              Save Snippet
            </Button>
          </Box>
        }
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <InputLabel htmlFor="name">Name</InputLabel>
          <Input onChange={e => setSnippetName(e.target.value)} value={snippetName} id="name" sx={{width: '50%'}}/>
        </Box>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <InputLabel htmlFor="name">Language</InputLabel>
          <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={language}
              label="Age"
              onChange={(e: SelectChangeEvent<string>) => setLanguage(e.target.value)}
              sx={{width: '50%'}}
          >
            {
              fileTypes.map(x => (
                  <MenuItem data-testid={`menu-option-${x.value}`} key={x.value}
                            value={x.value}>{capitalize((x.value))}</MenuItem>
              ))
            }
          </Select>
        </Box>
        <InputLabel>Code Snippet</InputLabel>
        <Box width={"100%"} sx={{
          backgroundColor: 'black', color: 'white', borderRadius: "8px",
        }}>
          <Editor
              value={code}
              padding={10}
              data-testid={"add-snippet-code-editor"}
              onValueChange={(code) => setCode(code)}
              highlight={(code) => highlight(code, languages.js, 'javascript')}
              style={{
                borderRadius: "8px",
                overflow: "auto",
                minHeight: "300px",
                maxHeight: "600px",
                width: "100%",
                fontFamily: "monospace",
                fontSize: 17,
              }}
          />
        </Box>
      </ModalWrapper>
  )
}

