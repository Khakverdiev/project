import React from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Footer from "../Footer";
import { useAuth } from "../AuthContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { handleLogin } = useAuth();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5175/api/v1/auth/login", {
        username,
        password,
      });

      console.log("Response from server:", response.data);

      if (response.status === 200) {
        localStorage.setItem('accessToken', response.data.accessToken);
        console.log("Token saved:", localStorage.getItem('accessToken'));
        handleLogin(username);
        alert("Login successful!");
        navigate("/home");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
      <>
          <div className="flex items-center justify-center min-h-screen">
              <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-sm">
                  <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>
                  <form onSubmit={handleSubmit}>
                      <div className="mb-4">
                          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                              Username
                          </label>
                          <input
                              type="text"
                              id="username"
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              placeholder="Your Username"
                              required
                          />
                      </div>
                      <div className="mb-6">
                          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                              Password
                          </label>
                          <input
                              type="password"
                              id="password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              placeholder="********"
                              required
                          />
                      </div>
                      {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>} {/* Отображение ошибок */}
                      <div className="flex items-center justify-center">
                          <button
                              type="submit"
                              className="bg-black hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                          >
                              Login
                          </button>
                      </div>
                      <p className="mt-4 text-center text-gray-600 text-sm">
                          Don't have an account? <a href="/register" className="text-blue-500 hover:underline">Sign Up</a>
                      </p>
                  </form>
              </div>
          </div>
          <Footer />
      </>
  );
};

export default Login;