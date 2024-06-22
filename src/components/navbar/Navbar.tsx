import React from "react";
import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
} from "@mui/material";
import { Code, Rule } from "@mui/icons-material";
import { useLocation } from "react-router-dom";
import LogoutButton from "../logout-button/LogOutButton";

type PageType = {
  title: string;
  path: string;
  icon: React.ReactNode;
};

const pages: PageType[] = [
  {
    title: "Snippets",
    path: "/",
    icon: <Code />,
  },
  {
    title: "Rules",
    path: "/rules",
    icon: <Rule />,
  },
];

export const Navbar = () => {
  const location = useLocation();

  return (
    <AppBar position="static" elevation={0}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ display: "flex", gap: "24px" }}>
          <Typography
            variant="h6"
            noWrap
            component="a"
            sx={{
              display: { xs: "none", md: "flex" },
              fontWeight: 700,
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Printscript
          </Typography>
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              gap: "4px",
            }}
          >
            {pages.map((page) => (
              <Button
                key={page.title}
                href={page.path}
                sx={{
                  my: 2,
                  color: "white",
                  display: "flex",
                  justifyContent: "center",
                  gap: "4px",
                  backgroundColor:
                    location.pathname === page.path
                      ? "primary.light"
                      : "transparent",
                  "&:hover": {
                    backgroundColor: "primary.dark",
                  },
                }}
              >
                {page.icon}
                <Typography>{page.title}</Typography>
              </Button>
            ))}
          </Box>
          <LogoutButton />
        </Toolbar>
      </Container>
    </AppBar>
  );
};
