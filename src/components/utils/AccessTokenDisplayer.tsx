import {useAuth0} from "@auth0/auth0-react";
import React, {useEffect, useState} from "react";
import {Box} from "@mui/material";

export const AccessTokenDisplayer: React.FC = () => {
    const { getAccessTokenSilently } = useAuth0();
    const [accessToken, setAccessToken] = useState<string | null>(null);

    useEffect(() => {
        const getAccessToken = async () => {
            try {
                const token = await getAccessTokenSilently();
                setAccessToken(token);
            } catch (e) {
                console.error(e);
            }
        };

        getAccessToken();
    }, [getAccessTokenSilently]);

    return (
        <Box
            sx={{
                position: "fixed",
                bottom: 0,
                right: 0,
                zIndex: 1000,
                padding: "8px",
                backgroundColor: "black",
                color: "white",
            }}
        >
            {accessToken}
        </Box>
    );
}