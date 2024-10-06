import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const Navbar = () => {
  const { username, handleLogout } = useAuth();
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    handleLogout();
    navigate("/login");
  };

  return (
    <nav className="w-full p-4 fixed top-0 left-0 z-50 bg-black text-white">
      <div className="flex items-center justify-between">
        <div className="absolute left-4">
          <img
            src={process.env.PUBLIC_URL + "/cloth.png"}
            alt="Cloth Icon"
            className="h-8 w-8"
          />
        </div>

        <div className="w-full flex justify-center">
          <ul className="flex space-x-8">
            <li><Link to="/home" className="text-lg font-semibold hover:underline">Home</Link></li>
            <li><Link to="/about-us" className="text-lg font-semibold hover:underline">About Us</Link></li>
            <li><Link to="/contacts" className="text-lg font-semibold hover:underline">Contacts</Link></li>
            <li><Link to="/delivery" className="text-lg font-semibold hover:underline">Delivery and Payment</Link></li>
          </ul>
        </div>

        <div className="absolute right-4 flex items-center">
          <Link to="/cart" className="text-lg font-semibold hover:underline mr-4">
            <img src={process.env.PUBLIC_URL + "/k.png"} alt="Cart Icon" className="h-8 w-8 object-contain inline-block" />
          </Link>
          {username ? (
            <>
              <Link to="/profile" className="text-lg font-semibold hover:underline">{username}</Link>
              <button onClick={handleLogoutClick} className="ml-4">Logout</button>
            </>
          ) : (
            <Link to="/login" className="text-lg font-semibold hover:underline">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
