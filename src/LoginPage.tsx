import { Button, Container, Typography } from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { useNavigate } from "react-router-dom";

export const LoginPage = () => {
    const { loginWithRedirect, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
    const navigate=useNavigate();


    React.useEffect(() => {
        if (isAuthenticated) {
            navigate('/')
        }
    }, [isAuthenticated, history]);

    const handleLogin = async () => {
        try {
            await loginWithRedirect();

            const accessToken = await getAccessTokenSilently();
            
            localStorage.setItem('accessToken', accessToken);

            navigate('/')
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <Container sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh'}}>
            <Typography variant="h4" gutterBottom>
                Welcome to Printscript
            </Typography>
            <Button variant="contained" onClick={handleLogin}>
                Login
            </Button>
        </Container>
    );
}
