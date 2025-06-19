import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartCount(cart.length);
  }, []);

  const handleAddToCart = (product) => {
    const existing = JSON.parse(localStorage.getItem("cart")) || [];
    const updated = [...existing, { ...product, quantity: 1 }];
    localStorage.setItem("cart", JSON.stringify(updated));
    setCartCount(updated.length);
  };

  const handleNavigate = (id) => {
    navigate(`/product/${id}`);
  };

  const goToCart = () => navigate("/cart");

  return (
    <>
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={goToCart}
          className="relative bg-blue-600 text-white p-3 rounded-full shadow hover:bg-blue-700 transition"
        >
          🛒
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-xs px-2 py-0.5 rounded-full">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex flex-col justify-between items-center bg-white rounded-2xl shadow p-4 hover:shadow-lg transition duration-200 relative"
          >
            <div
              onClick={() => handleNavigate(product.id)}
              className="cursor-pointer"
            >
              <img
                src={product.image}
                alt={product.title}
                className="h-40 w-full object-contain mb-4"
              />
              <h2 className="text-lg font-semibold line-clamp-2">{product.title}</h2>
              <p className="text-sm text-gray-500">${product.price}</p>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => handleAddToCart(product)}
                className="mt-4 px-4 bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-700 transition-all  "
              >
                Add to cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ProductList;
