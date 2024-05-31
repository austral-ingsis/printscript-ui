import {AppBar, Box, Button, Container, Toolbar, Typography, styled} from "@mui/material";
import {Code, Rule} from "@mui/icons-material";
import {ReactNode} from "react";
import {useLocation} from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

type PageType = {
    title: string;
    path: string;
    icon: ReactNode;
}

const pages: PageType[] = [{
    title: 'Snippets',
    path: '/',
    icon: <Code/>
}, {
    title: 'Rules',
    path: '/rules',
    icon: <Rule/>
}];

const StyledButton = styled(Button)(({}) => ({
  backgroundColor: 'white',
  '&:hover': {
    backgroundColor: 'white',
  },
}));


export const Navbar = () => {
    const {logout} = useAuth0();
    const location = useLocation();
    return (
        <AppBar position="static" elevation={0}>
            <Container maxWidth="xl">
                <Toolbar disableGutters sx={{display: "flex", gap: "24px"}}>
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        sx={{
                            display: {xs: 'none', md: 'flex'},
                            fontWeight: 700,
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        Printscript
                    </Typography>
                    <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}, gap: '4px'}}>
                        {pages.map((page) => (
                            <Button
                                key={page.title}
                                href={page.path}
                                sx={{
                                    my: 2,
                                    color: 'white',
                                    display: 'flex',
                                    justifyContent: "center",
                                    gap: "4px",
                                    backgroundColor: location.pathname === page.path ? 'primary.light' : 'transparent',
                                    "&:hover": {
                                        backgroundColor: 'primary.dark'
                                    }
                                }}
                            >
                                {page.icon}
                                <Typography>{page.title}</Typography>
                            </Button>
                        ))}
                    </Box>
                    <StyledButton  onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
      Log Out
    </StyledButton>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
