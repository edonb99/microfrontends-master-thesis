import React, { useEffect, useState } from "react";
import {
  getCart,
  addToCart,
  removeFromCart,
} from "../utils/cart";

const Cart = () => {
  const [cart, setCartState] = useState({});

  useEffect(() => {
    setCartState(getCart());
  }, []);

  const handleAdd = (product) => {
    addToCart(product);
    setCartState(getCart());
  };

  const handleRemove = (id) => {
    removeFromCart(id);
    setCartState(getCart());
  };

  // Filtrim për çdo rast
  const products = Object.values(cart).filter(Boolean);

  const total = products
    .reduce((sum, p) => sum + (p?.price || 0) * (p?.quantity || 0), 0)
    .toFixed(2);

  return (
    <div className="max-w-4xl p-6 mx-auto">
      <h2 className="mb-4 text-2xl font-bold">🛒 Checkout</h2>
      {products.length === 0 ? (
        <p>No items in cart.</p>
      ) : (
        <div className="space-y-6">
          {products.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between pb-4 border-b"
            >
              <div className="w-2/3">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-gray-500">
                  ${item.price} x {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleRemove(item.id)}
                  className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                >
                  −
                </button>
                <span className="font-semibold">{item.quantity}</span>
                <button
                  onClick={() => handleAdd(item)}
                  className="px-3 py-1 text-white bg-green-500 rounded hover:bg-green-600"
                >
                  +
                </button>
              </div>
            </div>
          ))}
          <div className="mt-6 text-xl font-bold text-right">
            Total: ${total}
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
