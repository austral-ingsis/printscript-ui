import './App.css';
import {RouterProvider} from "react-router";
import {createBrowserRouter} from "react-router-dom";
import HomeScreen from "./screens/Home.tsx";
import {QueryClient, QueryClientProvider} from "react-query";
import RulesScreen from "./screens/Rules.tsx";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import { CircularProgress } from "@mui/material";
import TestScreen from './screens/TestScreen.tsx';

const router = createBrowserRouter([
    {
        path: "/",
        element: <HomeScreen/>
    },
    {
        path: '/rules',
        element: <RulesScreen/>
  },
  {
    path: '/test',
    element: <TestScreen />
    }
]);

export const queryClient = new QueryClient()
const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router}/>
        </QueryClientProvider>
    );
}

export default withAuthenticationRequired(App, {
  onRedirecting: () => (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress />
    </div>
  ),
});
