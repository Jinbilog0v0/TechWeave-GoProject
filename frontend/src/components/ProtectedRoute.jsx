import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import { REFRESH_TOKEN, ACCESS_TOKEN } from '../constants';
import api from '../api';

function ProtectedRoute({ children }) {
    const [isAuthorized, setIsAuthorized] = useState(null);

    useEffect(() => {
        console.log("Checking authorization/authentication...");
        auth().catch(() => setIsAuthorized(false));
    }, []);

    const refreshToken = async () => {
        console.log(" ProtectedRoute: Refreshing token...");
        const refreshTokenValue = localStorage.getItem(REFRESH_TOKEN);

        if (!refreshTokenValue) {
            console.log(" No refresh token found.");
            setIsAuthorized(false);
            return;
        }

        try {
            const res = await api.post('/api/token/refresh/', { 
                refresh: refreshTokenValue 
            });


            if (res.status === 200) {
                console.log(" Token refreshed successfully.");
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                setIsAuthorized(true);
            } else {
                console.log(" Failed to refresh token.");
                setIsAuthorized(false);
            }
        } catch (error) {
            console.error("Error refreshing token:", error);
            setIsAuthorized(false);
        }
    };

    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN);

        if (!token) {
            console.log(" No access token found.");
            setIsAuthorized(false);
            return;
        }

        try {

            const decoded = jwtDecode(token);
            const tokenExpiration = decoded.exp;
            const now = Date.now() / 1000;

            if (tokenExpiration < now) {
                console.log(" Access token expired.");
                await refreshToken();
            } else {
                console.log(" Access token valid.");
                setIsAuthorized(true);
            }
        } catch (error) {
            console.error("Error decoding token:", error);
            setIsAuthorized(false);
        }
    };

    if (isAuthorized === null) {
        console.log(" Authorization status pending...");
        return <div>Loading...</div>;
    } 

    if (isAuthorized){
        console.log(" User is authorized.");
        return children;
    } else {
        console.log(" User is not authorized. Redirecting to login.");
        return  <Navigate to="/login" replace />;
    }
}

export default ProtectedRoute;