import React, { createContext, useContext, useState, useEffect, useMemo  } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [username, setUsername] = useState(localStorage.getItem('username') || null);
    const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken') || null);
    const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken') || null);
    const [refreshTokenExpireTime, setRefreshTokenExpireTime] = useState(localStorage.getItem('refreshTokenExpireTime') || null);
    const [userId, setUserId] = useState(localStorage.getItem('userId') || null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        const storedAccessToken = localStorage.getItem('accessToken');
        const storedRefreshToken = localStorage.getItem('refreshToken');
        const storedRefreshTokenExpireTime = localStorage.getItem('refreshTokenExpireTime');
        const storedUserId = localStorage.getItem('userId');

        if (storedUsername) setUsername(storedUsername);
        if (storedAccessToken) setAccessToken(storedAccessToken);
        if (storedRefreshToken) setRefreshToken(storedRefreshToken);
        if (storedRefreshTokenExpireTime) setRefreshTokenExpireTime(storedRefreshTokenExpireTime);
        if (storedUserId) setUserId(storedUserId);

        const setupAxiosInterceptors = () => {
            axios.interceptors.request.use(
                async (config) => {
                    const accessToken = localStorage.getItem('accessToken');
                    if (accessToken) {
                        config.headers['Authorization'] = `Bearer ${accessToken}`;
                    }
                    return config;
                },
                (error) => Promise.reject(error)
            );

            axios.interceptors.response.use(
                (response) => response,
                async (error) => {
                    const originalRequest = error.config;

                    if (error.response.status === 401 && !originalRequest._retry) {
                        originalRequest._retry = true;
                        const newAccessToken = await refreshAccessToken();
                        if (newAccessToken) {
                            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                            return axios(originalRequest);
                        }
                    }

                    return Promise.reject(error);
                }
            );
        };

        setupAxiosInterceptors();
    }, []);

    const handleLogin = (userId, username, access, refresh, refreshTokenExpireTime) => {
        setUserId(userId);
        setUsername(username);
        setAccessToken(access);
        setRefreshToken(refresh);
        setRefreshTokenExpireTime(refreshTokenExpireTime);

        localStorage.setItem('userId', userId);
        localStorage.setItem('username', username);
        localStorage.setItem('accessToken', access);
        localStorage.setItem('refreshToken', refresh);
        localStorage.setItem('refreshTokenExpireTime', refreshTokenExpireTime);
    };

    const handleLogout = () => {
        setUsername(null);
        setAccessToken(null);
        setRefreshToken(null);
        setUserId(null);
        setRefreshTokenExpireTime(null);

        localStorage.removeItem('username');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('refreshTokenExpireTime');
        localStorage.removeItem('userId');
    };

    const refreshAccessToken = async () => {
        if (!refreshToken) return;
        setIsLoading(true);
        try {
            const response = await axios.post('http://localhost:5175/api/v1/auth/refresh', { refreshToken });
            const newAccessToken = response.data.accessToken;
            const newRefreshToken = response.data.refreshToken;

            setAccessToken(newAccessToken);
            setRefreshToken(newRefreshToken);

            localStorage.setItem('accessToken', newAccessToken);
            localStorage.setItem('refreshToken', newRefreshToken);

            setIsLoading(false);
            return newAccessToken;
        } catch (error) {
            console.error('Error refreshing token:', error);
            setError('Error refreshing token');
            handleLogout();
            setIsLoading(false);
        }
    };

    const value = useMemo(() => ({
        username,
        accessToken,
        userId,
        handleLogin,
        handleLogout,
        refreshAccessToken,
        isLoading,
        error
    }), [username, accessToken, userId, isLoading, error]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);