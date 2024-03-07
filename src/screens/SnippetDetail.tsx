import {useEffect, useState} from "react";
import Editor from "react-simple-code-editor";
import {highlight, languages} from "prismjs";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism-okaidia.css";
import {Box, CircularProgress, Typography} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import {useGetSnippetById} from "../utils/queries.tsx";

type SnippetDetailProps = {
  id: string;
  handleCloseModal: () => void;
}

export const SnippetDetail = (props: SnippetDetailProps) => {
  const {id, handleCloseModal} = props;
  const [code, setCode] = useState(
      ""
  );

  const {data: snippet, isLoading} = useGetSnippetById(id);

  useEffect(() => {
    if (snippet) {
      setCode(snippet.content);
    }
  }, [snippet]);

  return (
      <Box p={4} minWidth={'60vw'}>
        <Box width={'100%'} p={2} display={'flex'} justifyContent={'flex-end'}>
          <CloseIcon style={{cursor: "pointer"}} onClick={handleCloseModal}/>
        </Box>
        {
          isLoading ? (<>
            <Typography variant="h4">Loading...</Typography>
            <CircularProgress/>
          </>) : <>
            <Typography variant="h4" fontWeight={"bold"}>{snippet?.name ?? "Snippet"}</Typography>
            <Box mt={4} width={"650px"}  backgroundColor={'black'} color={'white'}>
              <Editor
                  value={code}
                  padding={10}
                  onValueChange={(code) => setCode(code)}
                  highlight={(code) => highlight(code, languages.js, 'javascript')}
                  style={{
                    minHeight: "650px",
                    maxWidth: "650px",
                    fontFamily: "monospace",
                    fontSize: 17,
                  }}
              />
            </Box>
          </>
        }
      </Box>
  );
}

