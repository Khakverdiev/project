import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-black w-full p-4 relative">
      <div className="flex items-center justify-between">
        <div className="absolute left-4">
        <img src={process.env.PUBLIC_URL + "/cloth.png"} alt="Cloth Icon" className="h-8 w-8" />
        </div>

        <div className="w-full flex justify-center">
          <ul className="flex space-x-8">
            <li>
              <Link to="/home" className="text-white text-lg font-semibold hover:underline">
                Home
              </Link>
            </li>
            <li>
              <Link to="/" className="text-white text-lg font-semibold hover:underline">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/" className="text-white text-lg font-semibold hover:underline">
                Contacts
              </Link>
            </li>
            <li>
              <Link to="/" className="text-white text-lg font-semibold hover:underline">
                Delivery and Payment
              </Link>
            </li>
          </ul>
        </div>

        <div className="absolute right-4">
          <Link to="/login" className="text-white text-lg font-semibold hover:underline">
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
