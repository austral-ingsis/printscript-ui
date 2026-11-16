import './App.css';
import {RouterProvider} from "react-router";
import {createBrowserRouter} from "react-router-dom";
import HomeScreen from "./screens/Home.tsx";
import {QueryClient, QueryClientProvider} from "react-query";
import RulesScreen from "./screens/Rules.tsx";
import {withAuthenticationRequired} from "@auth0/auth0-react";
import {Box, CircularProgress} from "@mui/material";
import axios from "axios";

const router = createBrowserRouter([
    {
        path: "/",
        element: <HomeScreen/>
    },
    {
        path: '/rules',
        element: <RulesScreen/>
    }
]);

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            staleTime: 30_000,
            retry: (failureCount, error) => {
                if (axios.isAxiosError(error) && error.response && error.response.status < 500) {
                    return false;
                }
                return failureCount < 1;
            },
        },
    },
})

const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router}/>
        </QueryClientProvider>
    );
}

// To enable Auth0 integration change the following line
// export default App;
// for this one:
export default withAuthenticationRequired(App, {
    onRedirecting: () => (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
            <CircularProgress/>
        </Box>
    ),
}); //envuelvo los componentes con el autenticado de auth0, es un HOC (higher order component)
