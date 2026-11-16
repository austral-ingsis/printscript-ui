import axios from "axios";
import {BACKEND_URL} from "../constants.ts";

// me pasan como parametro una funcion que no recibe nada de parametro y de alguna forma devuelve un promise con el token adentro
export function createApiClient(getToken:() => Promise<string>, baseURL: string = BACKEND_URL) {
    const api = axios.create({ baseURL }); // creo mi cliente http

    // léxico de axios, interceptors.request le dice a mi cliente (api) que antes de mandar una request, ejecute lo que esta en .use()
    api.interceptors.request.use( async (config) => {
            const token = await getToken();
            config.headers.Authorization = `Bearer ${token}`;
            return config;
        }
    )

    return api;
}