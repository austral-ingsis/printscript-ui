import {withNavbar} from "../components/navbar/withNavbar.tsx";
import {SnippetTable} from "../components/snippet-table/SnippetTable.tsx";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {SnippetDetail} from "./SnippetDetail.tsx";
import {Drawer} from "@mui/material";
import {useGetSnippets} from "../utils/queries.tsx";
import {usePaginationContext} from "../contexts/paginationContext.tsx";

const HomeScreen = () => {
  const {id: paramsId} = useParams<{ id: string }>();
  const [snippetId, setSnippetId] = useState<string | null>(null)
  const {page, page_size, count, handleChangeCount} = usePaginationContext()
  const {data, isLoading} = useGetSnippets(page, page_size)

  useEffect(() => {
    if (data?.count && data.count != count) {
      handleChangeCount(data.count)
    }
  }, [data?.count]);


  useEffect(() => {
    if (paramsId) {
      setSnippetId(paramsId);
    }
  }, [paramsId]);

  const handleCloseModal = () => setSnippetId(null)


  return (
      <>
        <SnippetTable loading={isLoading} handleClickSnippet={setSnippetId} snippets={data?.snippets}/>
        <Drawer open={!!snippetId} anchor={"right"} onClose={handleCloseModal}>
          {snippetId && <SnippetDetail handleCloseModal={handleCloseModal} id={snippetId}/>}
        </Drawer>
      </>
  )
}

export default withNavbar(HomeScreen);

