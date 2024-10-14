import React, { createContext, useContext, useState, useEffect, useMemo } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem("cart");
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cartItems));
    }, [cartItems]);

    const addItemToCart = (product) => {
        setCartItems((prevCartItems) => {
            const existingItem = prevCartItems.find(item => item.productId === product.id);
            if (existingItem) {
                return prevCartItems.map(item =>
                    item.productId === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prevCartItems, { productId: product.id, price: product.price, quantity: 1 }];
        });
    };

    const removeItemFromCart = (productId) => {
        setCartItems((prevCartItems) => prevCartItems.filter(item => item.productId !== productId));
    };

    const updateItemQuantity = (productId, quantity) => {
        setCartItems((prevCartItems) => {
            return prevCartItems.map(item =>
                item.productId === productId
                    ? { ...item, quantity }
                    : item
            );
        });
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const value = useMemo(() => ({
        cartItems,
        addItemToCart,
        removeItemFromCart,
        updateItemQuantity,
        clearCart,
    }), [cartItems]);

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);