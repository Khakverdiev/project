import React, { useState, useEffect } from "react";
import axios from "axios";
import Footer from "./Footer";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";


const Home = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});

  const { accessToken } = useAuth();
  const navigate = useNavigate();

  const fetchProducts = async () => {
    setError("");
    if (!accessToken) {
      setError("You need to log in to see the products.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get("http://localhost:5175/api/v1/product/GetProducts", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setProducts(response.data.$values);
    } catch (error) {
      setError("Error fetching products. Please try again.");
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [accessToken]);

  const handleBuy = async (productId) => {
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

    try {
      const response = await axios.post(
        `http://localhost:5175/api/v1/cart/${productId}`,
        quantity,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log("Product added to cart:", response.data);
      setError("");
    } catch (error) {
      console.error("Error adding product to cart:", error.response.data);
      setError("Error adding product to cart. Please try again.");
    }
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
      <br></br>
      <br></br>
    <div className="flex-grow">
      <br />
      <br />
      <h1 className="text-5xl font-bold text-center mb-6">
        Home
      </h1>
      <br />
      {loading ? (
        <p className="text-center">Loading products...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : Array.isArray(products) && products.length > 0 ? (
        <div className="grid grid-cols-3 gap-4 px-4">
          {products.map((product) => (
            <div key={product.id} className="border p-2 rounded shadow bg-gray-400">
              <h2 className="text-2xl font-semibold">{product.name}</h2>
              <p className="mt-2">Price: ${product.price}</p>
              <p className="mt-2">Available: {product.quantity}</p>
              <div
                className="p-4 h-64 flex items-center justify-center cursor-pointer bg-gray-300"
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
                className="mt-2 w-full p-2 border border-gray-300 rounded"
              />
              <button
                onClick={() => handleBuy(product.id)}
                className="mt-4 w-full bg-black text-white py-2 px-4 rounded hover:bg-green-700 transition duration-300"
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