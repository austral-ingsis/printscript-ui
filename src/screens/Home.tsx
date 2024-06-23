import { withNavbar } from "../components/navbar/withNavbar.tsx";
import { SnippetTable } from "../components/snippet-table/SnippetTable.tsx";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { SnippetDetail } from "./SnippetDetail.tsx";
import { Drawer } from "@mui/material";
import { usePaginationContext } from "../contexts/paginationContext.tsx";
import useDebounce from "../hooks/useDebounce.ts";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

const HomeScreen = () => {
  const { id: paramsId } = useParams<{ id: string }>();
  const [searchTerm, setSearchTerm] = useState("");
  const [snippetName, setSnippetName] = useState("");
  const [snippetId, setSnippetId] = useState<string | null>(null);
  const { page, page_size, count, handleChangeCount } = usePaginationContext();
  const { getAccessTokenSilently } = useAuth0();
  const [data, setData] = useState<{ snippets: any[]; count: number } | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSnippets = async () => {
      setIsLoading(true);
      try {
        const token = await getAccessTokenSilently();
        const response = await axios.get(`http://localhost:8081/snippet`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setData({ snippets: response.data, count: response.data.length });
      } catch (error) {
        console.error("Error fetching snippets", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSnippets();
  }, [page, page_size, snippetName, getAccessTokenSilently]);

  useEffect(() => {
    if (data?.count && data.count !== count) {
      handleChangeCount(data.count);
    }
  }, [data?.count, count, handleChangeCount]);

  useEffect(() => {
    if (paramsId) {
      setSnippetId(paramsId);
    }
  }, [paramsId]);

  const handleCloseModal = () => setSnippetId(null);

  useDebounce(
    () => {
      setSnippetName(searchTerm);
    },
    [searchTerm],
    800
  );

  const handleSearchSnippet = (snippetName: string) => {
    setSearchTerm(snippetName);
  };

  return (
    <>
      <SnippetTable
        loading={isLoading}
        handleClickSnippet={setSnippetId}
        snippets={data?.snippets}
        handleSearchSnippet={handleSearchSnippet}
      />
      <Drawer open={!!snippetId} anchor={"right"} onClose={handleCloseModal}>
        {snippetId && (
          <SnippetDetail handleCloseModal={handleCloseModal} id={snippetId} />
        )}
      </Drawer>
    </>
  );
};

export default withNavbar(HomeScreen);
