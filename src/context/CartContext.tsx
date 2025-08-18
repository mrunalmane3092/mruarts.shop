import React, { createContext, useContext, useState, ReactNode } from "react";

type CartItem = {
    id: string;
    name: string;
    price: number;
    quantity: number;
    totalPrice: number;
    images?: string[];
};

interface CartContextType {
    cartProducts: Record<string, CartItem>;
    addToCart: (item: CartItem) => void;
    decrementFromCart: (id: string) => void;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cartProducts, setCartProducts] = useState<Record<string, CartItem>>({});

    const addToCart = (item: CartItem) => {
        setCartProducts((prev) => {
            const updated = { ...prev };

            if (updated[item.id]) {
                const newQty = updated[item.id].quantity + 1;
                updated[item.id].quantity = newQty;
                updated[item.id].totalPrice = newQty * updated[item.id].price;
            } else {
                updated[item.id] = { ...item, quantity: 1, totalPrice: item.price };
            }

            return updated;
        });
    };

    const decrementFromCart = (id: string) => {
        setCartProducts((prev) => {
            const updated = { ...prev };

            if (updated[id]) {
                if (updated[id].quantity > 1) {
                    const newQty = updated[id].quantity - 1;
                    updated[id].quantity = newQty;
                    updated[id].totalPrice = newQty * updated[id].price;
                } else {
                    delete updated[id];
                }
            }
            return updated;
        });
    };

    const clearCart = () => setCartProducts({});

    return (
        <CartContext.Provider value={{ cartProducts, addToCart, decrementFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used inside CartProvider");
    return ctx;
};
