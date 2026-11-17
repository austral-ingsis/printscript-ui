import {Autocomplete, Box, Button, Divider, MenuItem, TextField, Typography} from "@mui/material";
import {ModalWrapper} from "../common/ModalWrapper.tsx";
import {useGetUsers} from "../../utils/queries.tsx";
import {useEffect, useState} from "react";
import {User} from "../../utils/users.ts";
import {ShareRole} from "../../utils/snippet.ts";

type ShareSnippetModalProps = {
  open: boolean
  onClose: () => void
  onShare: (userId: string, role: ShareRole) => void
  loading: boolean
}
export const ShareSnippetModal = (props: ShareSnippetModalProps) => {
  const {open, onClose, onShare, loading} = props
  const [name, setName] = useState("")
  const [debouncedName, setDebouncedName] = useState("")
  const {data, isLoading} = useGetUsers(debouncedName, 0, 10, open)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [role, setRole] = useState<ShareRole>("VIEWER")

  useEffect(() => {
    const getData = setTimeout(() => {
      setDebouncedName(name)
    }, 300)
    return () => clearTimeout(getData)
  }, [name])

  useEffect(() => {
    if (!open) {
      setName("")
      setDebouncedName("")
      setSelectedUser(null)
      setRole("VIEWER")
    }
  }, [open])

  function handleSelectUser(newValue: User | null) {
    setSelectedUser(newValue)
  }

  return (
      <ModalWrapper open={open} onClose={onClose}>
        <Typography variant={"h5"}>Share your snippet</Typography>
        <Divider/>
        <Box mt={2}>
          <Autocomplete
              renderInput={(params) => <TextField {...params} label="Type the user's name"/>}
              options={data?.users ?? []}
              isOptionEqualToValue={(option, value) =>
                  option.id === value.id
              }
              getOptionLabel={(option) => option.name}
              loading={isLoading}
              value={selectedUser}
              inputValue={name}
              onInputChange={(_: unknown, newValue: string) => setName(newValue ?? "")}
              onChange={(_: unknown, newValue: User | null) => handleSelectUser(newValue)}
          />
          <TextField
              select
              label="Role"
              value={role}
              onChange={(e) => setRole(e.target.value as ShareRole)}
              sx={{mt: 2, minWidth: 160}}
          >
            <MenuItem value="VIEWER">Viewer</MenuItem>
            <MenuItem value="EDITOR">Editor</MenuItem>
          </TextField>
          <Box mt={4} display={"flex"} width={"100%"} justifyContent={"flex-end"}>
            <Button onClick={onClose} variant={"outlined"}>Cancel</Button>
            <Button disabled={!selectedUser || loading} onClick={() => selectedUser && onShare(selectedUser.id, role)} sx={{marginLeft: 2}} variant={"contained"}>Share</Button>
          </Box>
        </Box>
      </ModalWrapper>
  )
}
