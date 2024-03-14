import {withNavbar} from "../components/navbar/withNavbar.tsx";
import {SnippetTable} from "../components/snippet-table/SnippetTable.tsx";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {SnippetDetail} from "./SnippetDetail.tsx";
import {Drawer} from "@mui/material";
import {useGetSnippets} from "../utils/queries.tsx";

const HomeScreen = () => {
  const {id: paramsId} = useParams<{ id: string }>();
  const [snippetId, setSnippetId] = useState<string | null>(null)
  const {data: snippets, isLoading} = useGetSnippets();

  useEffect(() => {
    if (paramsId) {
      setSnippetId(paramsId);
    }
  }, [paramsId]);

  const handleCloseModal = () => setSnippetId(null)


  return (
      <>
        {
          snippets || isLoading ?
              (<SnippetTable loading={isLoading} handleClickSnippet={setSnippetId} snippets={snippets}/>)
              :
              "Loading..."
        }
        <Drawer open={!!snippetId} anchor={"right"} onClose={handleCloseModal}>
          {snippetId && <SnippetDetail handleCloseModal={handleCloseModal} id={snippetId}/>}
        </Drawer>
      </>
  )
}

export default withNavbar(HomeScreen);

