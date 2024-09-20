import React from "react";
import { useState } from "react";
import Footer from "../Footer";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    const handleSubmit = (e) => {
        e.preventDefault();
        // Здесь можно добавить логику для обработки входа
        console.log("Email:", email);
        console.log("Password:", password);
    };

    return (
        <>
        <div className="flex items-center justify-center min-h-screen">
            <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-sm">
                <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="you@example.com"
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
        <Footer></Footer>
        </>
    );
};

export default Login;