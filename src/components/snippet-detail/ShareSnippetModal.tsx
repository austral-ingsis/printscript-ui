import {Autocomplete, Box, Button, Divider, TextField, Typography} from "@mui/material";
import {ModalWrapper} from "../common/ModalWrapper.tsx";
import {useGetUsers} from "../../utils/queries.tsx";
import {useEffect, useState} from "react";
import {User} from "../../utils/users.ts";

type ShareSnippetModalProps = {
  open: boolean
  onClose: () => void
  onShare: (userId: string) => void
  loading: boolean
}

const SEARCH_DELAY_MS = 300

export const ShareSnippetModal = (props: ShareSnippetModalProps) => {
  const {open, onClose, onShare, loading} = props
  const [name, setName] = useState("")
  const [debouncedName, setDebouncedName] = useState("")
  const {data, isLoading} = useGetUsers(debouncedName, 0, 5)
  const [selectedUser, setSelectedUser] = useState<User | undefined>()

  // Searches while the user types, once they pause for a moment.
  useEffect(() => {
    const searchLater = setTimeout(() => {
      setDebouncedName(name)
    }, SEARCH_DELAY_MS)
    return () => clearTimeout(searchLater)
  }, [name])

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
              filterOptions={(options) => options}
              getOptionLabel={(option) => option.name}
              loading={isLoading}
              value={selectedUser ?? null}
              onInputChange={(_: unknown, newValue: string) => setName(newValue)}
              onChange={(_: unknown, newValue: User | null) => setSelectedUser(newValue ?? undefined)}
          />
          <Box mt={4} display={"flex"} width={"100%"} justifyContent={"flex-end"}>
            <Button onClick={onClose} variant={"outlined"}>Cancel</Button>
            <Button disabled={!selectedUser || loading} onClick={() => selectedUser && onShare(selectedUser?.id)} sx={{marginLeft: 2}} variant={"contained"}>Share</Button>
          </Box>
        </Box>
      </ModalWrapper>
  )
}
