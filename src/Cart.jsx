import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { accessToken, refreshAccessToken } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCartItems = async () => {
    setError("");
    setLoading(true);

    if (!accessToken) {
      setError("You need to log in to see your cart.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get("http://localhost:5175/api/v1/cart/GetCart", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const items = response.data.items?.$values || [];
      setCartItems(items);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        try {
          await refreshAccessToken();
          await fetchCartItems();
        } catch (refreshError) {
          setError("Error refreshing token. Please log in again.");
        }
      } else {
        setError("Error fetching cart items. Please try again.");
      }
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, [accessToken]);

  const handleRemoveItem = async (itemId) => {
    try {
      await axios.delete(`http://localhost:5175/api/v1/cart/${itemId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setCartItems((prevItems) => prevItems.filter(item => item.id !== itemId));
    } catch (error) {
      if (error.response && error.response.status === 401) {
        try {
          await refreshAccessToken();
          await handleRemoveItem(itemId);
        } catch (refreshError) {
          setError("Error refreshing token. Please log in again.");
        }
      } else {
        console.error("Error removing item:", error);
        setError("Error removing item. Please try again.");
      }
    }
  };

  const handleBuy = () => {
    navigate('/order');
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Your Cart</h1>
      
      {cartItems.length > 0 && (
        <button
          onClick={handleBuy}
          className="bg-black text-white py-1 px-2 rounded hover:bg-green-700 mb-6"
          style={{ width: "100px" }}
        >
          Buy
        </button>
      )}

      {loading ? (
        <p>Loading cart items...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : cartItems.length === 0 ? (
        <p className="text-center">Your cart is empty.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cartItems.map((item) => (
            <div key={item.id} className="border p-4 rounded shadow">
              <h2 className="text-xl font-semibold">{item.product.name}</h2>
              <p>Price: ${item.product.price}</p>
              <p>Quantity: {item.quantity}</p>
              <div className="flex justify-center items-center h-48">
                <img 
                  src={item.product.imageUrl} 
                  alt={item.product.name} 
                  className="max-w-full max-h-full object-contain h-full" 
                />
              </div>
              <button
                onClick={() => handleRemoveItem(item.id)}
                className="mt-4 w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Cart;