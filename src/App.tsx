import './App.css';
import {RouterProvider} from "react-router";
import {createBrowserRouter} from "react-router-dom";
import HomeScreen from "./screens/Home.tsx";
import {QueryClient, QueryClientProvider} from "react-query";
import RulesScreen from "./screens/Rules.tsx";
import {Auth0Provider} from "@auth0/auth0-react";



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

export const queryClient = new QueryClient();


const App = () => {
    const domain = import.meta.env.VITE_AUTH0_DOMAIN as string;
    const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID as string;

   if (domain && clientId) {
       return (
           <Auth0Provider clientId={clientId} domain={domain}
                          authorizationParams={{
                              redirect_uri: window.location.origin,
                          }}>
               <QueryClientProvider client={queryClient}>
                   <RouterProvider router={router} />
               </QueryClientProvider>
           </Auth0Provider>

       );
   }else return null;

};
export default App;
