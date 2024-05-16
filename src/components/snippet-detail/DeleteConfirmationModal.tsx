import {Box, Button, Typography} from "@mui/material";
import {ModalWrapper} from "../common/ModalWrapper.tsx";
import {useDeleteSnippet} from "../../utils/queries.tsx";
import {queryClient} from "../../App.tsx";

type DeleteConfirmationModalProps = {
  open: boolean
  onClose: () => void
  id: string;
  setCloseDetails: () => void;
}
export const DeleteConfirmationModal = (props: DeleteConfirmationModalProps) => {
  const {open, onClose, id, setCloseDetails} = props;

  const {mutate: deleteSnippet} = useDeleteSnippet({
    onSuccess: async () => {
      onClose();
      setCloseDetails();
      await queryClient.invalidateQueries('listSnippets')
    },
  })

  return (
      <ModalWrapper open={open} onClose={onClose}>
        <Typography variant={"h6"}>Are you sure you want to delete this snippet?</Typography>
          <Box display={"flex"} justifyContent={"center"}>
            <Button onClick={onClose} variant={"outlined"}>Cancel</Button>
            <Button onClick={() => deleteSnippet(id)} sx={{marginLeft: 2}} variant={"contained"} color={"error"}>Delete</Button>
          </Box>
      </ModalWrapper>
  )
}
