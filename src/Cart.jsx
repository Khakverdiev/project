import React from "react";
import Footer from "./Footer";

const Cart = () => {
    const cartItems = [
        {
            id: 1,
            name: "Stylish T-Shirt",
            price: 29.99,
            quantity: 2,
            image: "/images/tshirt.png", // Update with your image path
        },
        {
            id: 2,
            name: "Classic Jeans",
            price: 49.99,
            quantity: 1,
            image: "/images/jeans.png", // Update with your image path
        },
    ];

    const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);

    return (
        <>
        <br></br>
        <br></br>
        <div className="flex flex-col items-center p-6">
            <h1 className="text-4xl font-bold mb-6">Your Cart</h1>

            <div className="w-full max-w-3xl bg-white rounded-lg shadow-md p-6">
                {cartItems.length === 0 ? (
                    <p className="text-lg text-center">Your cart is empty.</p>
                ) : (
                    cartItems.map(item => (
                        <div key={item.id} className="flex items-center border-b py-4">
                            <img src={process.env.PUBLIC_URL + item.image} alt={item.name} className="h-16 w-16 mr-4" />
                            <div className="flex-grow">
                                <h2 className="text-xl font-semibold">{item.name}</h2>
                                <p className="text-gray-600">Price: ${item.price.toFixed(2)}</p>
                                <p className="text-gray-600">Quantity: {item.quantity}</p>
                            </div>
                            <div className="text-lg font-semibold">
                                ${(item.price * item.quantity).toFixed(2)}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {cartItems.length > 0 && (
                <div className="mt-6 w-full max-w-3xl bg-white rounded-lg shadow-md p-4">
                    <h2 className="text-2xl font-semibold">Total Amount: ${totalAmount}</h2>
                    <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        Proceed to Checkout
                    </button>
                </div>
            )}
        </div>
        </>
    );
};

export default Cart;