import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const Cart = () => {
  const { accessToken } = useAuth();
  const [cart, setCart] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCart = async () => {
    setLoading(true);
    setError("");

    if (!accessToken) {
      setError("You need to log in to view the cart.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get("http://localhost:5175/api/v1/cart/GetCart", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setCart(response.data);
      // Fetch products when cart is loaded
      const productsResponse = await axios.get("http://localhost:5175/api/v1/product/GetProducts", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setProducts(productsResponse.data.$values);
    } catch (error) {
      setError("Error fetching cart. Please try again.");
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [accessToken]);

  const handleRemoveFromCart = async (productId) => {
    try {
      await axios.delete(`http://localhost:5175/api/v1/cart/remove/${productId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      fetchCart();
    } catch (error) {
      setError("Error removing item from cart. Please try again.");
      console.error("Error removing item from cart:", error);
    }
  };

  const handleBuy = () => {
    console.log("Proceeding to buy items in the cart");
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Your Cart</h1>

      {cart && cart.items.$values.length > 0 && (
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
      ) : cart && cart.items.$values.length === 0 ? (
        <p className="text-center">Your cart is empty.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cart.items.$values.map((item) => {
            // Find product details from the products array
            const product = products.find((prod) => prod.id === item.productId);

            return (
              <div key={item.productId} className="border p-4 rounded shadow">
                <h2 className="text-xl font-semibold">{product ? product.name : "Product not found"}</h2>
                <p>Price: ${item.price}</p>
                <p>Quantity: {item.quantity}</p>
                <div className="flex justify-center items-center h-48">
                  {product ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="max-w-full max-h-full object-contain h-full"
                    />
                  ) : (
                    <p className="text-red-500">Image not available</p>
                  )}
                </div>
                <button
                  onClick={() => handleRemoveFromCart(item.productId)}
                  className="mt-4 w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700"
                >
                  Remove
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Cart;