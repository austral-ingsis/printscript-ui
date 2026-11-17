import {Box, Button, Typography} from "@mui/material";
import {ModalWrapper} from "../common/ModalWrapper.tsx";
import {useDeleteSnippet} from "../../utils/queries.tsx";
import {queryClient} from "../../App.tsx";
import {useSnackbarContext} from "../../contexts/snackbarContext.tsx";
import {getApiErrorMessage} from "../../utils/errorMessage.ts";

type DeleteConfirmationModalProps = {
  open: boolean
  onClose: () => void
  id: string;
  setCloseDetails: () => void;
}
export const DeleteConfirmationModal = (props: DeleteConfirmationModalProps) => {
  const {open, onClose, id, setCloseDetails} = props;
  const {createSnackbar} = useSnackbarContext();

  const {mutate: deleteSnippet, isLoading} = useDeleteSnippet({
    onSuccess: async () => {
      onClose();
      setCloseDetails();
      await queryClient.invalidateQueries('listSnippets')
      createSnackbar('success', 'Snippet deleted');
    },
    onError: (error) => {
      onClose();
      createSnackbar('error', getApiErrorMessage(error, 'Failed to delete snippet'));
    },
  })

  return (
      <ModalWrapper open={open} onClose={onClose}>
        <Typography variant={"h6"}>Are you sure you want to delete this snippet?</Typography>
          <Box display={"flex"} justifyContent={"center"} mt={2}>
            <Button disabled={isLoading} onClick={onClose} variant={"outlined"}>Cancel</Button>
            <Button disabled={isLoading} onClick={() => deleteSnippet(id)} sx={{marginLeft: 2}} variant={"contained"} color={"error"}>Delete</Button>
          </Box>
      </ModalWrapper>
  )
}
