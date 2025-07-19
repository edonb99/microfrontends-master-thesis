import React, { useState, useEffect } from 'react';
import { getCart, removeFromCart, updateCartItemQuantity, clearCart, getCartTotal } from './utils/cart';

function Cart() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    // Load initial cart
    setCartItems(getCart());

    // Listen for cart updates from other microfrontends
    const handleCartUpdate = (event) => {
      setCartItems(event.detail);
    };

    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  const handleQuantityChange = (productId, newQuantity) => {
    updateCartItemQuantity(productId, parseInt(newQuantity));
  };

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    
    const total = getCartTotal();
    alert(`Thank you for your purchase! Total: $${total.toFixed(2)}`);
    clearCart();
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Your Cart (React Remote)
        </h2>
        <div className="bg-gray-100 rounded-lg p-8">
          <p className="text-xl text-gray-600 mb-4">Your cart is empty</p>
          <a
            href="/products"
            className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Continue Shopping
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">
          Your Cart (React Remote)
        </h2>
        <button
          onClick={handleClearCart}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
        >
          Clear Cart
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="grid grid-cols-1 gap-0">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center p-4 border-b border-gray-200 last:border-b-0">
              <img
                src={item.image || `https://via.placeholder.com/80x80?text=${item.name}`}
                alt={item.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1 ml-4">
                <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                <p className="text-blue-600 font-bold">${item.price}</p>
              </div>
              <div className="flex items-center space-x-2">
                <label htmlFor={`quantity-${item.id}`} className="text-sm text-gray-600">
                  Qty:
                </label>
                <input
                  id={`quantity-${item.id}`}
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                  className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                />
              </div>
              <div className="ml-4 text-right">
                <p className="text-lg font-bold text-gray-800">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="text-red-500 hover:text-red-700 text-sm mt-1"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 p-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xl font-bold text-gray-800">Total:</span>
            <span className="text-2xl font-bold text-blue-600">
              ${getCartTotal().toFixed(2)}
            </span>
          </div>
          <div className="flex space-x-4">
            <a
              href="/products"
              className="flex-1 bg-gray-500 text-white text-center py-3 px-4 rounded hover:bg-gray-600 transition-colors"
            >
              Continue Shopping
            </a>
            <button
              onClick={handleCheckout}
              className="flex-1 bg-green-500 text-white py-3 px-4 rounded hover:bg-green-600 transition-colors"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
