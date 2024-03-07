import {withNavbar} from "../components/navbar/withNavbar.tsx";
import {SnippetTable} from "../components/snippet-table/SnippetTable.tsx";
import {Snippet} from "../types/Snippet.ts";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {SnippetDetail} from "./SnippetDetail.tsx";
import {Drawer} from "@mui/material";

const snippet: Snippet = {
  id: "1",
  name: "Chongas",
  language: "printscript",
  status: "accepted",
  author: "Chona Gil",
  content: "let a: Number = 1;"
}

const HomeScreen = () => {
  const {id: paramsId} = useParams<{ id: string }>();
  const [snippetId, setSnippetId] = useState<string | null>(null)

  useEffect(() => {
    if (paramsId) {
      setSnippetId(paramsId);
    }
  }, [paramsId]);

  return (
      <>
        <SnippetTable handleClickSnippet={setSnippetId} snippets={Array(10).fill(snippet)}/>
        {
            snippetId && (
                <Drawer open={!!snippetId} anchor={"right"} onClose={() => setSnippetId(null)}>
                  <SnippetDetail id={snippetId}/>
                </Drawer>
            )
        }
      </>
  )
}

export default withNavbar(HomeScreen);

