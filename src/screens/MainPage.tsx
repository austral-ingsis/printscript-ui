
import React from 'react';
import { useNavigate } from 'react-router-dom';

const MainPage = () => {
    const navigate = useNavigate();

    const goToHomePage = () => {
        navigate('/');
    };

    return (
        <div>
            <h1>Welcome to the Main Page</h1>
            <p>This page does not require any special permissions.</p>
            <button onClick={goToHomePage}>Go to Home Page</button>
        </div>
    );
};

export default MainPage;
