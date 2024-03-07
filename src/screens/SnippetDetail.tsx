import {useEffect, useState} from "react";
import Editor from "react-simple-code-editor";
// @ts-expect-error - This is a hack to fix the issue with the import
import {highlight, languages} from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism.css";
import {Box, CircularProgress, Typography} from "@mui/material";
import {useGetSnippetById} from "../utils/queries.tsx";

type SnippetDetailProps = {
  id: string;
}

export const SnippetDetail = (props: SnippetDetailProps) => {
  const {id} = props;
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
      <Box p={4}>
        {
          isLoading ? (<>
            <Typography variant="h4">Loading...</Typography>
            <CircularProgress/>
          </>) : <>
            <Typography variant="h4">{snippet?.name}</Typography>
            <Editor
                value={code}
                padding={10}
                onValueChange={(code) => setCode(code)}
                highlight={(code) => highlight(code, languages.js)}
                style={{
                  fontFamily: "monospace",
                  fontSize: 17,
                  border: "1px solid black"
                }}
            />
          </>
        }
      </Box>
  );
}

