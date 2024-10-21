import axios, { AxiosRequestConfig } from "axios";
import { useAuth0 } from "@auth0/auth0-react";

// Clase o función API
const useApi = () => {
    const { getAccessTokenSilently } = useAuth0();

    // Función para obtener el token de autenticación
    const getAuthToken = async (): Promise<string | null> => {
        try {
            const token = await getAccessTokenSilently({
                authorizationParams: {
                    audience: import.meta.env.VITE_AUTH0_AUDIENCE,
                },
            });
            return token;
        } catch (error) {
            console.error("Error obteniendo el token", error);
            return null;
        }
    };

    // Configura la petición `POST`
    const post = async (endpoint: string, data: any) => {
        const token = await getAuthToken();
        if (!token) {
            throw new Error("No se pudo obtener el token de autenticación.");
        }

        const config: AxiosRequestConfig = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_SERVER_URL}${endpoint}`, data, config);
            return response.data;
        } catch (error) {
            console.error("Error en la petición POST", error);
            throw error;
        }
    };

    // Configura la petición `GET`
    const get = async (endpoint: string) => {
        const token = await getAuthToken();
        if (!token) {
            throw new Error("No se pudo obtener el token de autenticación.");
        }

        const config: AxiosRequestConfig = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        try {
            const response = await axios.get(`${import.meta.env.VITE_API_SERVER_URL}${endpoint}`, config);
            return response.data;
        } catch (error) {
            console.error("Error en la petición GET", error);
            throw error;
        }
    };

    return { post, get };
};

export default useApi;
