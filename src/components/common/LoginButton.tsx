import { useAuth0 } from "@auth0/auth0-react";
import {Button} from "@mui/material";

const LoginButton = () => {
    const { loginWithRedirect } = useAuth0();

    return <Button
        onClick={() => loginWithRedirect()}
        sx={{
            my: 2,
            paddingLeft: 2,
            paddingRight: 2,
            color: 'primary',
            display: 'flex',
            justifyContent: "center",
            backgroundColor: 'white',
            gap: "4px",
            "&:hover": {
                backgroundColor: 'white'
            }
        }}
    >
        Log In
    </Button>;
};

export default LoginButton;