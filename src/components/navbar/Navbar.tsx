import {AppBar, Box, Button, Container, Toolbar, Typography} from "@mui/material";
import {Code, Rule} from "@mui/icons-material";
import {ReactNode} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import LoginButton from "../common/LoginButton";
import {useAuth0} from "@auth0/auth0-react";
import LogoutButton from "../common/LogoutButton.tsx";

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

export const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { user, isAuthenticated, isLoading } = useAuth0();
    if (isLoading) {
        return <div>Loading ...</div>;

    }
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
                                onClick={() => navigate(`${page.path}`)}
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
                        {isAuthenticated ?
                            <div
                                style={{
                                    display: 'flex',
                                    gap: '40px',
                                    alignItems: 'center',
                                    color: 'white',
                                    marginLeft: 'auto'
                                }}
                            >
                                <img
                                    src={user?.picture}
                                    alt={user?.name}
                                    style={{
                                        width: '45px',
                                        height: '45px',
                                        borderRadius: '50%'
                                    }}
                                />
                                <h2
                                    style={{
                                        fontSize: '1.2rem',
                                        fontWeight: 300
                                    }}
                                >{user?.name}</h2>
                                <LogoutButton/>
                            </div>
                            :
                            <div
                                style={{
                                    display: 'flex',
                                    gap: '40px',
                                    alignItems: 'center',
                                    color: 'white',
                                    marginLeft: 'auto'
                                }}
                            >
                                <LoginButton/>
                            </div>
                        }
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
