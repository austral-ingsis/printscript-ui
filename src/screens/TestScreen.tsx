import { useAuth0 } from "@auth0/auth0-react";
import {
  Box,
  Button,
  Container,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import axios from "axios";
import { useRef, useState } from "react";
import { options } from "../utils/operations";

type Method = "get" | "post" | "put" | "patch" | "delete";
const contentHeader = {
  "Content-Type": "application/json",
};

function TestScreen() {
  const url = useRef<HTMLInputElement>();
  const body = useRef<HTMLInputElement>();
  const [method, setMethod] = useState<Method>("get");
  const { getAccessTokenSilently } = useAuth0();
  const [response, setResponse] = useState<string | null>();
  const [loading, setLoading] = useState<boolean>(false);

  async function onClick() {
    setLoading(true);
    const token = await getAccessTokenSilently(options);
    if (method === "get") {
      axios
        .get(url.current!.value, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => setResponse(JSON.stringify(response.data)))
        .catch((error) => setResponse(JSON.stringify(error)))
        .finally(() => setLoading(false));
    }
    if (method === "post") {
      axios
        .post(url.current!.value, body.current!.value, {
          headers: { ...contentHeader, Authorization: `Bearer ${token}` },
        })
        .then((response) => setResponse(JSON.stringify(response.data)))
        .catch((error) => setResponse(JSON.stringify(error)))
        .finally(() => setLoading(false));
    }
    if (method === "put") {
      axios
        .put(url.current!.value, body.current!.value, {
          headers: { ...contentHeader, Authorization: `Bearer ${token}` },
        })
        .then((response) => setResponse(JSON.stringify(response.data)))
        .catch((error) => setResponse(JSON.stringify(error)))
        .finally(() => setLoading(false));
    }
    if (method === "patch") {
      axios
        .patch(url.current!.value, body.current!.value, {
          headers: { ...contentHeader, Authorization: `Bearer ${token}` },
        })
        .then((response) => setResponse(JSON.stringify(response.data)))
        .catch((error) => setResponse(JSON.stringify(error)))
        .finally(() => setLoading(false));
    }
    if (method === "delete") {
      axios
        .delete(url.current!.value, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => setResponse(JSON.stringify(response.data)))
        .catch((error) => setResponse(JSON.stringify(error)))
        .finally(() => setLoading(false));
    }
  }

  function onChange(event: SelectChangeEvent<Method>) {
    setMethod(event.target.value as Method);
  }

  return (
    <Container
      maxWidth="sm"
      sx={{ minHeight: "100vh", alignContent: "center" }}
    >
      <Grid2 container flexDirection="column">
        <Typography variant="h4">Test a URL</Typography>
        <Box height={8}></Box>
        <Grid2 container gap={2} flexWrap="nowrap">
          <TextField
            fullWidth
            label="URL"
            placeholder="https://my-url.com"
            inputRef={url}
          ></TextField>
          <Select value={method} onChange={onChange}>
            <MenuItem value="get">GET</MenuItem>
            <MenuItem value="post">POST</MenuItem>
            <MenuItem value="put">PUT</MenuItem>
            <MenuItem value="patch">PATCH</MenuItem>
            <MenuItem value="delete">DELETE</MenuItem>
          </Select>
          <Button
            variant="contained"
            onClick={onClick}
            disabled={loading}
            sx={{ px: 4 }}
          >
            Send
          </Button>
        </Grid2>
        <Box height={16}></Box>
        {method !== "get" && (
          <>
            <TextField
              fullWidth
              label="Body"
              multiline
              rows={8}
              inputRef={body}
            ></TextField>
            <Box height={16}></Box>
          </>
        )}
        {response && (
          <>
            <Typography variant="h6">Response:</Typography>
            <Box height={8}></Box>
            <Typography>{response}</Typography>
          </>
        )}
      </Grid2>
    </Container>
  );
}

export default TestScreen;
