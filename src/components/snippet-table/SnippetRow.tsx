import {alpha, Chip, Skeleton, styled, TableRow, TableRowProps} from "@mui/material";
import {StyledTableCell} from "./SnippetTable.tsx";
import {ComplianceEnum, Snippet} from "../../utils/snippet.ts";

export const COMPLIANCE_CHIP: Record<ComplianceEnum, {label: string, color: "success" | "warning" | "error" | "default"}> = {
  compliant: {label: "Valid", color: "success"},
  "not-compliant": {label: "Not valid", color: "warning"},
  failed: {label: "Could not check", color: "error"},
  pending: {label: "Pending", color: "default"},
}

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


export const SnippetRow = ({snippet, onClick, ...props}: { snippet: Snippet, onClick: () => void } & TableRowProps) => {
  return (
      <StyledTableRow onClick={onClick} sx={{backgroundColor: 'white', border: 0, height: '75px'}} {...props}>
        <StyledTableCell>{snippet.name}</StyledTableCell>
        <StyledTableCell>{snippet.language}</StyledTableCell>
        <StyledTableCell>{snippet.author}</StyledTableCell>
        <StyledTableCell>
          <Chip size="small" label={COMPLIANCE_CHIP[snippet.compliance].label}
                color={COMPLIANCE_CHIP[snippet.compliance].color}/>
        </StyledTableCell>
      </StyledTableRow>
  )
}

export const LoadingSnippetRow = () => {
  return (
      <TableRow sx={{height: '75px', padding: 0}}>
        <StyledTableCell colSpan={4} sx={{
          padding: 0
        }}>
          <Skeleton height={"75px"} width={"100%"} variant={"rectangular"}/>
        </StyledTableCell>
      </TableRow>
  )
}

