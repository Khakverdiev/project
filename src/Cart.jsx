import React, { useState, useEffect } from "react";
import { useCart } from "./CartContext";
import { useAuth } from "./AuthContext";

const Cart = () => {
  const { cartItems, removeItemFromCart, clearCart } = useCart();
  const { accessToken } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5175/api/v1/product/GetProducts", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const productsData = await response.json();
      setProducts(productsData.$values || []);
    } catch (error) {
      setError("Error fetching products. Please try again.");
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchProducts();
    }
  }, [accessToken]);

  const handleBuy = () => {
    console.log("Proceeding to buy items in the cart");
    clearCart();
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

      {cartItems.length === 0 ? (
        <p className="text-center">Your cart is empty.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cartItems.map((item, index) => (
            <div key={item.productId || index} className="border p-4 rounded shadow">
              <h2 className="text-xl font-semibold">{item.name}</h2>
              <p>Price: ${item.price}</p>
              <p>Quantity: {item.quantity}</p>
              <div className="flex justify-center items-center h-48">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="max-w-full max-h-full object-contain h-full"
                />
              </div>
              <button
                onClick={() => removeItemFromCart(item.productId)}
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