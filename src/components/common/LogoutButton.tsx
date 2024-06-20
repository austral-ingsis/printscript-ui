import { useAuth0 } from "@auth0/auth0-react";
import {Button} from "@mui/material";

const LogoutButton = () => {
    const { logout } = useAuth0();

    return (
        <Button
            onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
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
            Log Out
        </Button>
    );
};

export default LogoutButton;