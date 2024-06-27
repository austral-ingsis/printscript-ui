import {Autocomplete, Box, Button, Divider, TextField, Typography} from "@mui/material";
import {ModalWrapper} from "../common/ModalWrapper.tsx";
import {useGetUsers} from "../../utils/queries.tsx";
import {useEffect, useState} from "react";
import {User} from "../../utils/users.ts";

type ShareSnippetModalProps = {
  open: boolean
  onClose: () => void
  onShare: (userId: string, userName: string) => void
  loading: boolean
  id: string
  userName: string
}

export const ShareSnippetModal = (props: ShareSnippetModalProps) => {
  const {open, onClose, onShare, loading, userName: currentUserName} = props;
  const [name, setName] = useState("");
  const [debouncedName, setDebouncedName] = useState("");
  const {data, isLoading} = useGetUsers(props.id, debouncedName, 1, 5);
  const [selectedUser, setSelectedUser] = useState<User | undefined>();

  useEffect(() => {
    const getData = setTimeout(() => {
      setDebouncedName(name);
    }, 300);
    return () => clearTimeout(getData);
  }, [name]);

  function handleSelectUser(newValue: User | null) {
    newValue && setSelectedUser(newValue);
  }

  // Filter the users to exclude duplicates and the current user
  const seenUserIds = new Set();
  const filteredUsers = (data?.users ?? []).filter(user => {
    if (user.userName === currentUserName || seenUserIds.has(user.userId)) {
      return false;
    }
    seenUserIds.add(user.userId);
    return true;
  });

  return (
    <ModalWrapper open={open} onClose={onClose}>
      <Typography variant={"h5"}>Share your snippet</Typography>
      <Divider />
      <Box mt={2}>
        <Autocomplete
          renderInput={(params) => <TextField {...params} label="Type the user's name" />}
          options={filteredUsers}
          isOptionEqualToValue={(option, value) => option.userId === value.userId}
          getOptionLabel={(option) => option.userName}
          loading={isLoading}
          value={selectedUser}
          onInputChange={(_: unknown, newValue: string | null) => newValue && setName(newValue)}
          onChange={(_: unknown, newValue: User | null) => handleSelectUser(newValue)}
        />
        <Box mt={4} display={"flex"} width={"100%"} justifyContent={"flex-end"}>
          <Button onClick={onClose} variant={"outlined"}>Cancel</Button>
          <Button
            disabled={!selectedUser || loading}
            onClick={() => selectedUser && onShare(selectedUser.userId, selectedUser.userName)}
            sx={{marginLeft: 2}}
            variant={"contained"}
          >
            Share
          </Button>
        </Box>
      </Box>
    </ModalWrapper>
  );
};
