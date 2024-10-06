import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const UpdateProfile = ({ setView }) => {
  const { accessToken, userId } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    try {
      await axios.put(
        `http://localhost:5175/api/v1/users/${userId}`,
        {
          firstName,
          lastName,
          email,
          address,
          zipCode,
          phoneNumber,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setSuccessMessage("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Update Profile</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}

      <form onSubmit={handleUpdateProfile}>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-3 rounded-lg font-semibold hover:bg-blue-600 transition duration-300"
        >
          Save Changes
        </button>
        <button
          onClick={() => setView("info")}
          className="w-full bg-gray-500 text-white p-3 rounded-lg font-semibold mt-2"
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default UpdateProfile;