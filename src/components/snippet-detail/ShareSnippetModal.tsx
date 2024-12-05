import { Autocomplete, Box, Button, Divider, TextField, Typography } from "@mui/material";
import { ModalWrapper } from "../common/ModalWrapper.tsx";
import { useGetUsers } from "../../utils/queries.tsx";
import { useEffect, useState } from "react";
import { User } from "../../utils/users.ts";

type ShareSnippetModalProps = {
  open: boolean;
  onClose: () => void;
  onShare: (userId: string) => void;
  loading: boolean;
};

export const ShareSnippetModal = (props: ShareSnippetModalProps) => {
  const { open, onClose, onShare, loading } = props;
  const [name, setName] = useState<string>(""); // Input del usuario
  const [debouncedName, setDebouncedName] = useState<string>(""); // Entrada retrasada para la API
  const [selectedUser, setSelectedUser] = useState<User | null>(null); // Usuario seleccionado

  // Obtener usuarios desde la API
  const { data, isLoading } = useGetUsers(debouncedName, 0, 10);

  // Actualizar `debouncedName` con un retraso
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      setDebouncedName(name.trim());
    }, 300); // Ajuste de 300ms
    return () => clearTimeout(debounceTimeout);
  }, [name]);

  // Manejo de selección de usuario
  const handleSelectUser = (user: User | null) => {
    setSelectedUser(user);
  };

  return (
    <ModalWrapper open={open} onClose={onClose}>
      <Typography variant="h5">Share your snippet</Typography>
      <Divider />
      <Box mt={2}>
        <Autocomplete
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search users"
              value={name}
              onChange={(e) => setName(e.target.value)} // Actualizar valor de entrada
            />
          )}
          options={data || []} // Opciones dinámicas desde la API
          getOptionLabel={(option) => option.nickname || ""} // Mostrar `nickname`
          isOptionEqualToValue={(option, value) => option.user_id === value.user_id}
          loading={isLoading} // Mostrar estado de carga
          onChange={(_, newValue) => handleSelectUser(newValue)} // Guardar usuario seleccionado
        />
        <Box mt={4} display="flex" justifyContent="flex-end">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>
          <Button
            disabled={!selectedUser || loading} // Deshabilitar si no hay usuario seleccionado
            onClick={() => selectedUser && onShare(selectedUser.user_id)} // Compartir snippet
            sx={{ ml: 2 }}
            variant="contained"
          >
            Share
          </Button>
        </Box>
      </Box>
    </ModalWrapper>
  );
};
