import React from "react";
import "./LogInButtonStyles.css";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login'; // Importa el ícono de Login

const LogInButton: React.FC = () => {
    const { loginWithRedirect } = useAuth0();

    return (
        <Button
            variant="contained"
            onClick={() => loginWithRedirect()}
            sx={{
                backgroundColor: '#4CAF50', // Color verde
                color: 'white', // Color del texto
                '&:hover': {
                    backgroundColor: '#45a049', // Color verde oscuro al pasar el ratón
                },
                borderRadius: '8px', // Bordes redondeados
                padding: '10px 20px', // Espaciado interno
                fontSize: '16px', // Tamaño de fuente
                fontWeight: 'bold', // Fuente en negrita
            }}
            startIcon={<LoginIcon />} // Añade el ícono al inicio del botón
        >
            Log in
        </Button>
    );
};

export default LogInButton;
