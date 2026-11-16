import axios, {AxiosInstance} from "axios";

// Cliente compartido que adjunta el token de Auth0 a cada llamada de snippet-service
export const createAuthenticatedHttpClient = (getToken: () => Promise<string>, baseUrl: string): AxiosInstance => {
  const http = axios.create({baseURL: baseUrl})
  http.interceptors.request.use(async config => {
    config.headers.set("Authorization", `Bearer ${await getToken()}`)
    return config
  })
  return http
}
