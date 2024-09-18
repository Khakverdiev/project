import { IoMagnet } from "react-icons/io5";
import "./App.css";
import { Link, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";

import Navbar from "./Navbar";

import { Outlet } from "react-router-dom";


function App() {

  const [authState, setAuthState] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      setAuthState(true);
    }
  }, [authState]);

  
  return (
    <div className="App">
      <header>
        <Navbar authState={authState} />
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default App;