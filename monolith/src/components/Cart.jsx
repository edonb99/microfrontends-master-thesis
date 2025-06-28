import React, { useEffect, useState } from "react";

const Cart = () => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(saved);
  }, []);

  const removeItem = (id) => {
    const updated = cart.filter((item) => item.id !== id);
    localStorage.setItem("cart", JSON.stringify(updated));
    setCart(updated);
  };

  const total = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0).toFixed(2);

  return (
    <div className="max-w-4xl p-6 mx-auto">
      <h2 className="mb-4 text-2xl font-bold">🛒 Checkout</h2>
      {cart.length === 0 ? (
        <p>No items in cart.</p>
      ) : (
        <div className="space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="flex items-center justify-between pb-2 border-b">
              <span>{item.title}</span>
              <div className="flex items-center space-x-4">
                <span>${item.price}</span>
                <button
                  className="text-red-600 hover:underline"
                  onClick={() => removeItem(item.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div className="mt-4 font-semibold text-right">Total: ${total}</div>
        </div>
      )}
    </div>
  );
};

export default Cart;
