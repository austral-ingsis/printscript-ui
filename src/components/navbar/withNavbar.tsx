import { ComponentType } from "react";
import { Navbar } from "./Navbar.tsx";
import { Box } from "@mui/material";
import { withAuthenticationRequired } from "@auth0/auth0-react";

export const withNavbar = (WrappedComponent: ComponentType<unknown>) => {
  const AuthComponent = withAuthenticationRequired(WrappedComponent);
  return () => (
    <>
      <Navbar />
      <Box padding={"16px 128px"}>
        <AuthComponent />
      </Box>
    </>
  );
};
