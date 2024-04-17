import {useEffect, useState} from "react";
import Editor from "react-simple-code-editor";
import {highlight, languages} from "prismjs";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism-okaidia.css";
import {Box, Button, CircularProgress, Typography} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import {useGetSnippetById, useShareSnippet} from "../utils/queries.tsx";
import {Bòx} from "../components/snippet-table/SnippetBox.tsx";
import {Share} from "@mui/icons-material";
import {ShareSnippetModal} from "../components/snippet-detail/ShareSnippetModal.tsx";

type SnippetDetailProps = {
  id: string;
  handleCloseModal: () => void;
}

export const SnippetDetail = (props: SnippetDetailProps) => {
  const {id, handleCloseModal} = props;
  const [code, setCode] = useState(
      ""
  );
  const [shareModalOppened, setShareModalOppened] = useState(false)

  const {data: snippet, isLoading} = useGetSnippetById(id);
  const {mutate: shareSnippet, isLoading: loadingShare} = useShareSnippet()

  useEffect(() => {
    if (snippet) {
      setCode(snippet.content);
    }
  }, [snippet]);

  async function handleShareSnippet(userId: string) {
    shareSnippet({snippetId: id, userId})
  }

  return (
      <Box p={4} minWidth={'60vw'}>
        <Box width={'100%'} p={2} display={'flex'} justifyContent={'flex-end'}>
          <CloseIcon style={{cursor: "pointer"}} onClick={handleCloseModal}/>
        </Box>
        {
          isLoading ? (<>
            <Typography fontWeight={"bold"} mb={2} variant="h4">Loading...</Typography>
            <CircularProgress/>
          </>) : <>
            <Typography variant="h4" fontWeight={"bold"}>{snippet?.name ?? "Snippet"}</Typography>
            <Bòx mt={4} width={"650px"} minHeight={"650px"} bgcolor={'black'} color={'white'} code={code}>
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
            </Bòx>
            <Button onClick={() => setShareModalOppened(true)} sx={{
              marginTop: 2
            }} variant={"contained"} startIcon={<Share/>}>Share snippet</Button>
          </>
        }
        <ShareSnippetModal loading={loadingShare || isLoading} open={shareModalOppened} onClose={() => setShareModalOppened(false)}
                           onShare={handleShareSnippet}/>
      </Box>
  );
}

