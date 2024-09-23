import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [username, setUsername] = useState(null);

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    const handleLogin = (user) => {
        setUsername(user);
        localStorage.setItem('username', user);
    };

    const handleLogout = () => {
        setUsername(null);
        localStorage.removeItem('username');
    };

    return (
        <AuthContext.Provider value={{ username, handleLogin, handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);