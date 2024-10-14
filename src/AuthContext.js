import React, { createContext, useContext, useState, useEffect, useMemo  } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState({
        username: localStorage.getItem('username') || null,
        accessToken: localStorage.getItem('accessToken') || null,
        refreshToken: localStorage.getItem('refreshToken') || null,
        refreshTokenExpireTime: localStorage.getItem('refreshTokenExpireTime') || null,
        userId: localStorage.getItem('userId') || null,
        isLoading: false,
        error: null
    });

    useEffect(() => {
        const setupAxiosInterceptors = () => {
            axios.interceptors.request.use(
                (config) => {
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

                    if (error.response?.status === 401 && !originalRequest._retry) {
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

    const handleLogin = (userId, username, accessToken, refreshToken, refreshTokenExpireTime) => {
        setAuthState({
            userId,
            username,
            accessToken,
            refreshToken,
            refreshTokenExpireTime,
            isLoading: false,
            error: null
        });

        localStorage.setItem('userId', userId);
        localStorage.setItem('username', username);
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('refreshTokenExpireTime', refreshTokenExpireTime);
    };

    const handleLogout = () => {
        setAuthState({
            username: null,
            accessToken: null,
            refreshToken: null,
            refreshTokenExpireTime: null,
            userId: null,
            isLoading: false,
            error: null
        });

        localStorage.removeItem('username');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('refreshTokenExpireTime');
        localStorage.removeItem('userId');
    };

    const refreshAccessToken = async () => {
        if (!authState.refreshToken) return null;

        setAuthState((prevState) => ({ ...prevState, isLoading: true }));

        try {
            const response = await axios.post('http://localhost:5175/api/v1/auth/refresh', {
                refreshToken: authState.refreshToken
            });
            const newAccessToken = response.data.accessToken;
            const newRefreshToken = response.data.refreshToken;

            setAuthState((prevState) => ({
                ...prevState,
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
                isLoading: false
            }));

            localStorage.setItem('accessToken', newAccessToken);
            localStorage.setItem('refreshToken', newRefreshToken);

            return newAccessToken;
        } catch (error) {
            console.error('Error refreshing token:', error);
            setAuthState((prevState) => ({
                ...prevState,
                error: 'Error refreshing token',
                isLoading: false
            }));
            handleLogout();
            return null;
        }
    };

    const value = useMemo(() => ({
        ...authState,
        handleLogin,
        handleLogout,
        refreshAccessToken
    }), [authState]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);