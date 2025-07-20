import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addToCart, getCart, getQuantity, removeFromCart } from "./utils/cart";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cart, setCartState] = useState({});
  const navigate = useNavigate();

  const updateCartState = () => {
    const updated = getCart();
    setCartState(updated);
    setCartCount(
      Object.values(updated)
        .filter(Boolean)
        .reduce((sum, p) => sum + (p?.quantity || 0), 0)
    );
  };

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => setProducts(data))
      .catch((error) => {
        console.error('Error fetching products:', error);
        // Set mock products for development
        const mockProducts = [
          {
            id: 1,
            title: "Mock Product 1",
            description: "This is a mock product for development",
            price: 29.99,
            image: "https://via.placeholder.com/300x300/ff6b6b/ffffff?text=Product+1"
          },
          {
            id: 2,
            title: "Mock Product 2", 
            description: "This is another mock product for development",
            price: 39.99,
            image: "https://via.placeholder.com/300x300/4ecdc4/ffffff?text=Product+2"
          }
        ];
        setProducts(mockProducts);
      });

    updateCartState();
  }, []);

  const handleAdd = (product) => {
    addToCart(product);
    updateCartState();
  };

  const handleRemove = (id) => {
    removeFromCart(id);
    updateCartState();
  };

  const handleNavigate = (id) => navigate(`/product/${id}`);
  const goToCart = () => navigate("/cart");

  return (
    <>
      <div className="fixed z-50 top-4 right-4">
        <button
          onClick={goToCart}
          className="relative p-3 text-white transition bg-blue-600 rounded-full shadow hover:bg-blue-700"
        >
          🛒
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-xs px-2 py-0.5 rounded-full">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 p-4 sm:grid-cols-2 md:grid-cols-3">
        {products.map((product) => {
          const quantity = getQuantity(product.id);
          return (
            <div
              key={product.id}
              className="relative flex flex-col items-center justify-between p-4 transition duration-200 bg-white shadow rounded-2xl hover:shadow-lg"
            >
              <div
                onClick={() => handleNavigate(product.id)}
                className="w-full cursor-pointer"
              >
                <img
                  src={product.image}
                  alt={product.title}
                  className="object-contain w-full h-40 mb-4"
                />
                <h2 className="text-lg font-semibold line-clamp-2">{product.title}</h2>
                <p className="text-sm text-gray-500">${product.price}</p>
              </div>

              <div className="flex items-center mt-4 space-x-2">
                {quantity > 0 ? (
                  <>
                    <button
                      onClick={() => handleRemove(product.id)}
                      className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                    >
                      −
                    </button>
                    <span className="font-semibold">{quantity}</span>
                    <button
                      onClick={() => handleAdd(product)}
                      className="px-3 py-1 text-white bg-green-500 rounded hover:bg-green-600"
                    >
                      +
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleAdd(product)}
                    className="px-4 py-2 text-white bg-blue-500 rounded-xl hover:bg-blue-700"
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ProductList;
