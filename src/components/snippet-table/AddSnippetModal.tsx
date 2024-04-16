import {
  Box,
  Button,
  Input,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  SelectChangeEvent,
  Skeleton,
  Typography
} from "@mui/material";
import {highlight, languages} from "prismjs";
import {useEffect, useState} from "react";
import Editor from "react-simple-code-editor";

import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism-okaidia.css";
import {Save} from "@mui/icons-material";
import {CreateSnippet} from "../../utils/snippet.ts";

export const AddSnippetModal = ({open, onClose, defaultSnippet, loading}: {
  open: boolean,
  onClose: () => void,
  defaultSnippet?: CreateSnippet,
  loading?: boolean
}) => {
  const [language, setLanguage] = useState("printscript");
  const [code, setCode] = useState(defaultSnippet?.content ?? "");

  useEffect(() => {
    if(defaultSnippet?.content){
      setCode(defaultSnippet?.content)
    }
  }, [defaultSnippet?.content]);

    return (
      <Modal
          open={open}
          onClose={onClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}
      >
        <Box sx={{
          backgroundColor: 'white',
          padding: '32px',
          borderRadius: '8px',
          width: '50%',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {
            loading ? (
                <Skeleton width={"100%"} variant={"text"} height={32}/>
            ) : (
                <Box sx={{display: 'flex', flexDirection: "row", justifyContent: "space-between"}}>
                  <Typography id="modal-modal-title" variant="h5" component="h2">
                    Add Snippet
                  </Typography>
                  <Button variant="contained" disableRipple sx={{boxShadow: 0}} onClick={onClose}>
                    <Save/>
                    Save Snippet
                  </Button>
                </Box>
            )
          }
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <InputLabel htmlFor="name">Name</InputLabel>
            <Input defaultValue={defaultSnippet?.name} id="name" sx={{width: '50%'}}/>
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
              <MenuItem value={"printscript"}>Printscript</MenuItem>
              <MenuItem value={"python"}>Python</MenuItem>
              <MenuItem value={"java"}>Java</MenuItem>
            </Select>
          </Box>
          <Box width={"100%"} sx={{
            backgroundColor: 'black', color: 'white', borderRadius: "8px",
          }}>
            <Editor
                value={code}
                padding={10}
                onValueChange={(code) => setCode(code)}
                highlight={(code) => highlight(code, languages.js, 'javascript')}
                style={{
                  borderRadius: "8px",
                  minHeight: "300px",
                  width: "100%",
                  fontFamily: "monospace",
                  fontSize: 17,
                }}
            />
          </Box>
        </Box>
      </Modal>
  )
}
