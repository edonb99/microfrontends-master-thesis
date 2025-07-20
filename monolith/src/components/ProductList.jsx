import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getQuantity,
  addToCart,
  removeFromCart,
} from "../utils/cart";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [refreshCart, setRefreshCart] = useState(0); // Force re-render when cart changes
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  const handleAdd = (product) => {
    addToCart(product);
    setRefreshCart(prev => prev + 1); // Trigger re-render
  };

  const handleRemove = (id) => {
    removeFromCart(id);
    setRefreshCart(prev => prev + 1); // Trigger re-render
  };

  const handleNavigate = (id) => navigate(`/product/${id}`);

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => {
        const quantity = getQuantity(product.id) + refreshCart * 0; // Use refreshCart to trigger re-render
        return (
          <div
            key={product.id}
            className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-300 flex flex-col h-full"
          >
            {/* Product Image */}
            <div
              onClick={() => handleNavigate(product.id)}
              className="cursor-pointer mb-4 flex-1"
            >
              <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden mb-4 flex items-center justify-center">
                <img
                  src={product.image}
                  alt={product.title}
                  className="object-contain w-full h-full p-4 group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              {/* Product Info */}
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 leading-tight">
                  {product.title}
                </h3>
                <div className="flex items-center justify-between">
                  <p className="text-lg font-bold text-blue-700">
                    ${product.price}
                  </p>
                  {product.rating && (
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-400 text-sm">★</span>
                      <span className="text-xs text-gray-500">
                        {product.rating.rate}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Add to Cart Controls - Fixed at bottom */}
            <div className="mt-auto pt-4">
              {quantity > 0 ? (
                <div className="flex items-center justify-center space-x-3 bg-gray-50 rounded-full p-1">
                  <button
                    onClick={() => handleRemove(product.id)}
                    className="w-8 h-8 rounded-full bg-white shadow-sm border border-gray-200 flex items-center justify-center text-blue-700 hover:bg-blue-50 hover:border-blue-200 transition-all duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="font-semibold text-blue-700 min-w-[24px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleAdd(product)}
                    className="w-8 h-8 rounded-full bg-blue-700 shadow-sm flex items-center justify-center text-white hover:bg-blue-800 transition-all duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleAdd(product)}
                  className="w-full py-2 bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 group text-sm"
                >
                  <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 5H3m4 8v4a2 2 0 002 2h8a2 2 0 002-2v-4m-9 4h1m6 0h1" />
                  </svg>
                  <span>Add to Cart</span>
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductList;
