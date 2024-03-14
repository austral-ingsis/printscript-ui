import {
  Box,
  Button,
  IconButton,
  InputBase,
  styled,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "@mui/material";
import {Add, Search} from "@mui/icons-material";
import {LoadingSnippetRow, SnippetRow} from "./SnippetRow.tsx";
import {SnippetDescriptor} from "../../utils/snippet.ts";

type SnippetTableProps = {
  handleClickSnippet: (id: string) => void;
  snippets?: SnippetDescriptor[];
  loading: boolean;
}

export const SnippetTable = (props: SnippetTableProps) => {
  const {snippets, handleClickSnippet, loading} = props;
  return (
      <>
        <Box display="flex" flexDirection="row" justifyContent="space-between">
          <Box sx={{background: 'white', width: '30%', display: 'flex'}}>
            <InputBase
                sx={{ml: 1, flex: 1}}
                placeholder="Search Snippet"
                inputProps={{'aria-label': 'search'}}
            />
            <IconButton type="button" sx={{p: '10px'}} aria-label="search">
              <Search/>
            </IconButton>
          </Box>
          <Button variant="contained" disableRipple sx={{boxShadow: 0}}>
            <Add/>
            Add Snippet
          </Button>
        </Box>
        <Table size="medium" sx={{borderSpacing: "0 10px", borderCollapse: "separate"}}>
          <TableHead>
            <TableRow sx={{fontWeight: 'bold'}}>
              <StyledTableCell sx={{fontWeight: "bold"}}>Name</StyledTableCell>
              <StyledTableCell sx={{fontWeight: "bold"}}>Language</StyledTableCell>
              <StyledTableCell sx={{fontWeight: "bold"}}>Author</StyledTableCell>
              <StyledTableCell sx={{fontWeight: "bold"}}>Conformance</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              loading ? (
                  <>
                    {Array.from({length: 10}).map((_, index) => (
                        <LoadingSnippetRow key={index}/>
                    ))}
                  </>
              ) : (
                  <>
                    {
                        snippets && snippets.map((snippet) => (
                            <SnippetRow onClick={() => handleClickSnippet(snippet.id)} key={snippet.id} snippet={snippet}/>
                        ))
                    }
                  </>
              )
            }
          </TableBody>
        </Table>
      </>
  )
}


export const StyledTableCell = styled(TableCell)`
    border: 0;
    align-items: center;
`
