import { Button } from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";

export default function LoginScreen() {
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  if (isAuthenticated) {
    window.location.replace("/");
  }
  return (
    <main>
      <h1>Login</h1>
      <Button
        onClick={() =>
          loginWithRedirect(
          {
            authorizationParams: {
              scope: "read:snippets write:snippets change:rules offline_access openid profile email",
            },
          })
        }
      >
        Log In
      </Button>
    </main>
  );
}
