import './App.css';
import {RouterProvider} from "react-router";
import {createBrowserRouter} from "react-router-dom";
import HomeScreen from "./screens/Home.tsx";
import {QueryClient, QueryClientProvider} from "react-query";


const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeScreen/>
  },
]);

const queryClient = new QueryClient()
const App = () => {
  return (
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router}/>
      </QueryClientProvider>
  );
}

export default App;
