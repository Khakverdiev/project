import React, { useState, useEffect } from "react";
import axios from "axios";
import Footer from "./Footer";


const Home = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setError("");
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setError("You need to log in to see the products.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get("http://localhost:5175/api/v1/product/GetProducts", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log("Fetched products:", response.data);
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
  }, []);

  const handleBuy = (productId) => {
    alert(`Product with ID: ${productId} added to cart.`);
  };

  return (
    <>
      <br />
      <br />
      <h1 className="text-5xl font-bold text-center mb-6 text-gray-800">
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
              <p className="text-gray-600 mt-2">Price: ${product.price}</p>
              <p className="text-gray-600 mt-2">Quantity: {product.quantity}</p>
              <div className="bg-gray-400 p-4 h-64 flex items-center justify-center">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
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
      <Footer />
    </>
  );
};
  
export default Home;