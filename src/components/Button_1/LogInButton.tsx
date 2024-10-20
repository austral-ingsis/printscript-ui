import React from "react";
import "./LogInButtonStyles.css";
import {useAuth0} from "@auth0/auth0-react";


const LogInButton: React.FC = () => {
    const {  loginWithRedirect } = useAuth0();
  return (
    <button className="duolingo-button" onClick={() => loginWithRedirect()}>
      Log in
    </button>
  );
};

export default LogInButton;
