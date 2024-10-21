import './App.css';
import { RouterProvider, createBrowserRouter, Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import HomeScreen from "./screens/Home";
import RulesScreen from "./screens/Rules";
import CallbackPage from "./screens/CallbackPage";
import { Auth0ProviderWithNavigate } from "./screens/Auth0ProviderWithNavigate";


// Componente que envuelve las rutas con Auth0ProviderWithNavigate
const MainLayout = () => {
    return (
        <Auth0ProviderWithNavigate>
            <>
                <Outlet />
            </>
        </Auth0ProviderWithNavigate>
    );
};
// Configura las rutas de la aplicación
const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />, // Esta ruta envuelve a todas las demás
        children: [
            { path: "/", element: <HomeScreen /> },
            { path: "/rules", element: <RulesScreen /> },
            { path: "/callback", element: <CallbackPage /> }
        ]
    }
]);

export const queryClient = new QueryClient();



const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
        </QueryClientProvider>
    );
};

export default App;
