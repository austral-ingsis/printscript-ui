import {
  Box,
  Button,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  styled,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "@mui/material";
import {AddSnippetModal} from "./AddSnippetModal.tsx";
import {useRef, useState} from "react";
import {Add, Search} from "@mui/icons-material";
import {LoadingSnippetRow, SnippetRow} from "./SnippetRow.tsx";
import {CreateSnippet, SnippetDescriptor} from "../../utils/snippet.ts";
import {isValidFile} from "../../utils/validFiles.ts";

type SnippetTableProps = {
  handleClickSnippet: (id: string) => void;
  snippets?: SnippetDescriptor[];
  loading: boolean;
}

export const SnippetTable = (props: SnippetTableProps) => {
  const {snippets, handleClickSnippet, loading} = props;
  const [addModalOpened, setAddModalOpened] = useState(false);
  const [popoverMenuOpened, setPopoverMenuOpened] = useState(false)
  const [snippet, setSnippet] = useState<CreateSnippet | undefined>()
  const [loadingSnippet, setLoadingSnippet] = useState(true)

  const popoverRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleLoadSnippet = async (files?: FileList | null) => {
    if (!files || !files.length) return
    const file = files[0]
    const splitedName = file.name.split(".")
    if (!isValidFile(splitedName.at(-1))) {
      //TODO add some kind of snackbar
      return
    }
    setLoadingSnippet(true)
    file.text().then((text) => {
      setSnippet({
        name: splitedName[0],
        content: text
      })
    }).catch(e => {
      console.error(e)
    }).finally(() => {
      setLoadingSnippet(false)
      setAddModalOpened(true)
      // TODO there is a bug in wich if you add the same file twice inside an input, it doesn't trigger this function
    })
  }

  function handleClickMenu() {
    setPopoverMenuOpened(false)
  }

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
          <Button ref={popoverRef} variant="contained" disableRipple sx={{boxShadow: 0}}
                  onClick={() => setPopoverMenuOpened(true)}>
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
          <TableBody>{
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
                          <SnippetRow onClick={() => handleClickSnippet(snippet.id)} key={snippet.id} snippet={snippet}/>))
                  }
                </>
            )
          }
          </TableBody>
        </Table>
        <AddSnippetModal loading={loading || loadingSnippet} defaultSnippet={snippet} open={addModalOpened}
                         onClose={() => setAddModalOpened(false)}/>
        <Menu anchorEl={popoverRef.current} open={popoverMenuOpened} onClick={handleClickMenu}>
          <MenuItem onClick={() => setAddModalOpened(true)}>Create snippet</MenuItem>
          <MenuItem onClick={() => inputRef?.current?.click()}>Load snippet from file</MenuItem>
        </Menu>
        <input hidden  type={"file"} ref={inputRef} multiple={false}
               onChange={e => handleLoadSnippet(e?.target?.files)}/>
      </>
  )
}


export const StyledTableCell = styled(TableCell)`
    border: 0;
    align-items: center;
`
