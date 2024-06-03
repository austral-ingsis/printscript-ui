import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@mui/material";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <Button
      sx={{
        my: 2,
        display: "flex",
        justifyContent: "center",
        gap: "4px",
      }}
      onClick={() =>
        loginWithRedirect(
					{appState: {
            returnTo: "/cliente/perfil",
          }}
				)
      }
    >
      Log In
    </Button>
  );
};

export default LoginButton;
