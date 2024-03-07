import './App.css';
import {RouterProvider} from "react-router";
import {createBrowserRouter} from "react-router-dom";
import HomeScreen from "./screens/Home.tsx";


const router = createBrowserRouter([
    {
        path: "/",
        element: <HomeScreen/>
    },
]);


const App = () => {
    return (
        <RouterProvider router={router}/>
    );
}

export default App;
