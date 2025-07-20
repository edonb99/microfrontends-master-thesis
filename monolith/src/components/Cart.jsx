import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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

  // Filter products
  const products = Object.values(cart).filter(Boolean);

  const total = products
    .reduce((sum, p) => sum + (p?.price || 0) * (p?.quantity || 0), 0)
    .toFixed(2);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600 mt-1">
            {products.length === 0 ? "Your cart is empty" : `${products.length} ${products.length === 1 ? 'item' : 'items'} in your cart`}
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
        >
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Continue Shopping
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 5H3m4 8v4a2 2 0 002 2h8a2 2 0 002-2v-4" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
          <p className="text-gray-500 mb-6">Add some products to get started</p>
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-blue-700 text-white font-medium rounded-xl hover:bg-blue-800 transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 5H3m4 8v4a2 2 0 002 2h8a2 2 0 002-2v-4" />
            </svg>
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Cart Items */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {products.map((item, index) => (
              <div
                key={item.id}
                className={`p-6 flex items-start space-x-4 ${
                  index !== products.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                {/* Product Image */}
                <div className="w-20 h-20 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-contain p-2"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2 mb-2">
                    {item.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-bold text-blue-700">
                      ${item.price}
                    </div>
                    <div className="text-sm text-gray-500">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center space-x-3 bg-gray-50 rounded-full p-1 flex-shrink-0">
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="w-8 h-8 rounded-full bg-white shadow-sm border border-gray-200 flex items-center justify-center text-blue-700 hover:bg-blue-50 hover:border-blue-200 transition-all duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="font-semibold text-blue-700 min-w-[24px] text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => handleAdd(item)}
                    className="w-8 h-8 rounded-full bg-blue-700 shadow-sm flex items-center justify-center text-white hover:bg-blue-800 transition-all duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-blue-700">${total}</span>
            </div>
            
            {/* Action Buttons - Minimalist and Small */}
            <div className="flex space-x-3">
              <button 
                onClick={() => {
                  localStorage.setItem('cart', JSON.stringify({}));
                  setCartState({});
                }}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
              >
                Clear Cart
              </button>
              <button className="flex-1 bg-blue-700 hover:bg-blue-800 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 text-sm group">
                <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Proceed to Checkout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
