import {Snippet} from "../../types/Snippet.ts";
import {alpha, styled, TableRow} from "@mui/material";
import {StyledTableCell} from "./SnippetTable.tsx";

const StyledTableRow = styled(TableRow)(({theme}) => ({
    backgroundColor: 'white',
    border: 0,
    height: '75px',
    cursor: 'pointer',
    '& td': {
        borderTop: '2px solid transparent',
        borderBottom: '2px solid transparent',
    },
    '& td:first-of-type': {
        borderLeft: '2px solid transparent',
        borderTopLeftRadius: theme.shape.borderRadius,
        borderBottomLeftRadius: theme.shape.borderRadius,
    },
    '& td:last-of-type': {
        borderRight: '2px solid transparent',
        borderTopRightRadius: theme.shape.borderRadius,
        borderBottomRightRadius: theme.shape.borderRadius,
    },
    '&:hover > td': {
        borderTop: `2px ${theme.palette.primary.light} solid`,
        borderBottom: `2px ${theme.palette.primary.light} solid`,
        backgroundColor: alpha(theme.palette.primary.light, 0.2)
    },
    '&:hover > td:first-of-type': {
        borderLeft: `2px ${theme.palette.primary.light} solid`,
    },
    '&:hover > td:last-of-type': {
        borderRight: `2px ${theme.palette.primary.light} solid`
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