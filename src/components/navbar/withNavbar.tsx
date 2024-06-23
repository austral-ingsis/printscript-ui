import { ComponentType } from "react";
import { Navbar } from "./Navbar.tsx";
import { Box } from "@mui/material";
// import { withAuthenticationRequired } from "@auth0/auth0-react";

export const withNavbar = (WrappedComponent: ComponentType<unknown>) => {
  // const AuthComponent = withAuthenticationRequired(WrappedComponent, {
  //   onRedirecting: () => <div>Redirecting you to the login page...</div>,
  //   loginOptions: {
  //     authorizationParams: {
  //       scope: "read:snippets write:snippets change:rules offline_access",
  //     },
  //   },
  //   returnTo: "/login",
  // });
  return () => (
    <>
      <Navbar />
      <Box padding={"16px 128px"}>
        <WrappedComponent />
      </Box>
    </>
  );
};
