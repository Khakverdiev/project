import React, { createContext, useContext, useState, useEffect, useMemo  } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    username: localStorage.getItem('username') || null,
    accessToken: Cookies.get('AccessToken') || null,
    refreshToken: Cookies.get('RefreshToken') || null,
    userId: localStorage.getItem('userId') || null,
    isLoading: false,
    error: null,
  });

  const startTokenExpirationTimer = () => {
    if (!authState.accessToken) return;

    const tokenData = JSON.parse(atob(authState.accessToken.split('.')[1]));
    const expirationTime = tokenData.exp * 1000 - Date.now();

    if (expirationTime > 0) {
      setTimeout(async () => {
        await refreshAccessToken();
      }, expirationTime - 60000);
    }
  };

  useEffect(() => {
    startTokenExpirationTimer();
  }, [authState.accessToken]);

  const refreshAccessToken = async () => {
    const refreshToken = Cookies.get('RefreshToken');
    if (!refreshToken) {
      handleLogout();
      return null;
    }

    try {
      setAuthState((prevState) => ({ ...prevState, isLoading: true }));
      
      const response = await axios.post("https://localhost:7131/api/auth/refresh", {
        refreshToken: refreshToken,
      });

      const newAccessToken = response.data.accessToken;

      Cookies.set("AccessToken", newAccessToken, {
        secure: true,
        sameSite: "None",
        expires: 10 / 1440,
      });

      setAuthState((prevState) => ({
        ...prevState,
        accessToken: newAccessToken,
        isLoading: false,
      }));

      startTokenExpirationTimer();

      return newAccessToken;
    } catch (error) {
      console.error("Ошибка при обновлении токена:", error);
      handleLogout();
      return null;
    }
  };

  const handleLogin = (userId, username, accessToken, refreshToken) => {
    setAuthState({
      userId,
      username,
      accessToken,
      refreshToken,
      isLoading: false,
      error: null,
    });

    localStorage.setItem('userId', userId);
    localStorage.setItem('username', username);

    Cookies.set('AccessToken', accessToken, { secure: true, sameSite: 'Strict', expires: 10 / 1440 });
    Cookies.set('RefreshToken', refreshToken, { secure: true, sameSite: 'Strict', expires: 30 }); // 30 дней

    startTokenExpirationTimer();
  };

  const handleLogout = () => {
    setAuthState({
      username: null,
      accessToken: null,
      refreshToken: null,
      userId: null,
      isLoading: false,
      error: null,
    });

    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    Cookies.remove('AccessToken');
    Cookies.remove('RefreshToken');
  };

  const value = useMemo(() => ({
    ...authState,
    handleLogin,
    handleLogout,
    refreshAccessToken,
  }), [authState]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);