import './App.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import HomeScreen from './screens/Home';
import RulesScreen from './screens/Rules';
import { LoginPage } from './LoginPage.tsx';
import PrivateRoute from './utils/PrivateRoute.tsx';
import NoPermissionsPage from './screens/NoPermissionsPage';
import CallbackPage from './screens/CallbackPage.tsx';
import { AuthenticationGuard } from './components/authenticationGuard/authenticationGuard.tsx';

const router = createBrowserRouter([
    {
        path: '/login',
        element: <LoginPage />
    },
    {
        path: '/',
        element: (
            <AuthenticationGuard component={HomeScreen}/>
        )
    },
    {
        path: '/rules',
        element: (
            <AuthenticationGuard component={RulesScreen}/>
        )
    },
    {
        path: '/no-permissions',
        element: <NoPermissionsPage />
    },
    {
        path:'callback',
        element: <CallbackPage/>
    }
]);

export const queryClient = new QueryClient();
const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
        </QueryClientProvider>
    );
}

export default App;
