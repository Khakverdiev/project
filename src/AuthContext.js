import React, { createContext, useContext, useState, useEffect, useMemo  } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    username: Cookies.get('Username') || null,
    accessToken: Cookies.get('AccessToken') || null,
    refreshToken: Cookies.get('RefreshToken') || null,
    refreshTokenExpireTime: Cookies.get('RefreshTokenExpireTime') || null,
    userId: Cookies.get('UserId') || null,
    isLoading: false,
    error: null
  });

  useEffect(() => {
    console.log("Загрузка токенов из куки...");
    const accessToken = Cookies.get('AccessToken');
    const refreshToken = Cookies.get('RefreshToken');
    const username = Cookies.get('Username');
    const userId = Cookies.get('UserId');
    const refreshTokenExpireTime = Cookies.get('RefreshTokenExpireTime');
    
    console.log("AccessToken из куки: ", accessToken);
    console.log("RefreshToken из куки: ", refreshToken);
    
    setAuthState((prevState) => ({
      ...prevState,
      accessToken,
      refreshToken,
      username,
      userId,
      refreshTokenExpireTime
    }));
  }, []);

  useEffect(() => {
    const setupAxiosInterceptors = () => {
      axios.interceptors.request.use(
        (config) => {
          const accessToken = Cookies.get('AccessToken');
          console.log("AccessToken при отправке запроса: ", accessToken);
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
              console.log("Новый accessToken: ", newAccessToken);
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
    console.log("Данные при логине:", { userId, username, accessToken, refreshToken, refreshTokenExpireTime });
    setAuthState({
      userId,
      username,
      accessToken,
      refreshToken,
      refreshTokenExpireTime,
      isLoading: false,
      error: null
    });

    Cookies.set('UserId', userId, { expires: 30 });
    Cookies.set('Username', username, { expires: 30 });
    Cookies.set('AccessToken', accessToken, { expires: 1 / 144 }); // accessToken истекает через 10 минут
    Cookies.set('RefreshToken', refreshToken, { expires: 30 }); // refreshToken истекает через 30 дней
    Cookies.set('RefreshTokenExpireTime', refreshTokenExpireTime, { expires: 30 });
  };

  const handleLogout = () => {
    console.log("Выполняется выход из системы");
    setAuthState({
      username: null,
      accessToken: null,
      refreshToken: null,
      refreshTokenExpireTime: null,
      userId: null,
      isLoading: false,
      error: null
    });

    Cookies.remove('Username');
    Cookies.remove('AccessToken');
    Cookies.remove('RefreshToken');
    Cookies.remove('RefreshTokenExpireTime');
    Cookies.remove('UserId');
  };

  const refreshAccessToken = async () => {
    const refreshToken = Cookies.get('RefreshToken');
    const accessToken = Cookies.get('AccessToken');
  
    console.log("Текущий RefreshToken: ", refreshToken);
    console.log("Текущий AccessToken: ", accessToken);
  
    if (!refreshToken || !accessToken) {
      return null;
    }
  
    setAuthState((prevState) => ({ ...prevState, isLoading: true }));
  
    try {
      const response = await axios.post('https://localhost:7131/api/auth/refresh', {
        accessToken: accessToken,
        refreshToken: refreshToken,
        role: "appadmin"
      });
  
      const newAccessToken = response.data.accessToken;
      const newRefreshToken = response.data.refreshToken;
  
      console.log("Новые токены после обновления:", { newAccessToken, newRefreshToken });
  
      setAuthState((prevState) => ({
        ...prevState,
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        isLoading: false
      }));
  
      Cookies.set('AccessToken', newAccessToken, { expires: 1 / 144, sameSite: 'None', secure: true });
      Cookies.set('RefreshToken', newRefreshToken, { expires: 30, sameSite: 'None', secure: true });
  
      return newAccessToken;
    } catch (error) {
      console.error("Ошибка при обновлении токена:", error);
      setAuthState((prevState) => ({
        ...prevState,
        error: 'Ошибка обновления токена',
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