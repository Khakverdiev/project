import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Footer from "./Footer";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";
import useAxiosInterceptors from "./useAxiosInterceptors ";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});
  const { accessToken } = useAuth();
  const { addItemToCart } = useCart();
  const navigate = useNavigate();

  const hasError = useAxiosInterceptors();

  const fetchProducts = useCallback(async () => {
    setError("");
    setLoading(true);

    try {
      const response = await axios.get("https://localhost:7131/api/product/GetProducts", {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
      });

      setProducts(response.data.$values || response.data);
    } catch (error) {
      setError("Error fetching products. Please try again.");
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleBuy = (productId) => {
    const quantity = quantities[productId] || 1;
    const product = products.find((prod) => prod.id === productId);

    if (quantity <= 0) {
      setError("Quantity must be greater than zero.");
      return;
    }

    if (product && quantity > product.quantity) {
      setError(`You can only buy up to ${product.quantity} of this product.`);
      return;
    }

    addItemToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity: quantity,
    });

    setError("");
  };

  const handleQuantityChange = (productId, newQuantity) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: newQuantity,
    }));
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow px-4 py-10">
        <h1 className="text-5xl font-bold text-center mb-6">Home</h1>
        {loading ? (
          <p className="text-center">Loading products...</p>
        ) : error || hasError ? (
          <p className="text-center text-red-500">
            {error || "There was an issue loading the products. Please try again later."}
          </p>
        ) : Array.isArray(products) && products.length > 0 ? (
          <div className="grid grid-cols-3 gap-8 px-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="border border-gray-200 rounded-lg shadow-md p-6 bg-white hover:shadow-lg transition-shadow duration-300"
              >
                <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                <p className="text-gray-700 mb-4">Price: ${product.price}</p>
                <p className="text-gray-700 mb-4">Available: {product.quantity}</p>
                <div
                  className="p-4 h-64 flex items-center justify-center cursor-pointer bg-gray-100 rounded mb-4 transition-transform duration-300 hover:scale-105"
                  onClick={() => handleProductClick(product.id)}
                >
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <input
                  type="number"
                  min="1"
                  defaultValue={1}
                  onChange={(e) => handleQuantityChange(product.id, Number(e.target.value))}
                  className="mt-2 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  onClick={() => handleBuy(product.id)}
                  className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition duration-300"
                >
                  Buy
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center">No products available.</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Home;