import {Snippet} from "../../types/Snippet.ts";
import {styled, TableRow} from "@mui/material";
import {StyledTableCell} from "./SnippetTable.tsx";

const StyledTableRow = styled(TableRow)(({theme}) => ({
    backgroundColor: 'white',
    border: 0,
    height: '75px',
    '& td:first-of-type': {
        borderTopLeftRadius: theme.shape.borderRadius,
        borderBottomLeftRadius: theme.shape.borderRadius,
    },
    '& td:last-of-type': {
        borderTopRightRadius: theme.shape.borderRadius,
        borderBottomRightRadius: theme.shape.borderRadius,
    },
}));


export const SnippetRow = ({snippet}: { snippet: Snippet }) => {
    return (
        <StyledTableRow sx={{backgroundColor: 'white', border: 0, height: '75px'}}>
            <StyledTableCell>{snippet.name}</StyledTableCell>
            <StyledTableCell>{snippet.language}</StyledTableCell>
            <StyledTableCell>{snippet.author}</StyledTableCell>
            <StyledTableCell>{snippet.status}</StyledTableCell>
        </StyledTableRow>
    )
}