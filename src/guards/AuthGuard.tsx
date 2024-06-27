import { useAuth0 } from "@auth0/auth0-react";
import { Navigate, Outlet } from "react-router-dom";
import Loader from "../components/loader/Loader";
import { useEffect } from "react";

const AuthGuard = () => {
  const { isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();

  useEffect(()=>{
    if(isAuthenticated){
      (async () =>{
        const token = await getAccessTokenSilently()
        document.cookie = `session=${token}`
        localStorage.setItem('authAccessToken', token)
      })()

    }
  },[isAuthenticated])

  if (isLoading) {
    return <Loader />;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default AuthGuard;
