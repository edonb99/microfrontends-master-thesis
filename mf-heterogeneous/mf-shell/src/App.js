import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const ProductList = React.lazy(() => import("product_list/ProductList"));
const ProductDetail = React.lazy(() => import("product_detail/ProductDetail"));

// Simple React Cart component for now
const CartComponent = () => {
  const [cart, setCart] = React.useState({});
  const [products, setProducts] = React.useState([]);

  React.useEffect(() => {
    const updateCart = () => {
      const cartData = JSON.parse(localStorage.getItem("cart")) || {};
      setCart(cartData);
      setProducts(Object.values(cartData).filter(Boolean));
    };

    updateCart();
    
    // Listen for storage changes (cart updates from other components)
    const handleStorageChange = () => updateCart();
    window.addEventListener('storage', handleStorageChange);
    
    // Also check periodically for updates
    const interval = setInterval(updateCart, 1000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handleAdd = (product) => {
    const cartData = JSON.parse(localStorage.getItem("cart")) || {};
    if (cartData[product.id]) {
      cartData[product.id].quantity += 1;
    } else {
      cartData[product.id] = { ...product, quantity: 1 };
    }
    localStorage.setItem("cart", JSON.stringify(cartData));
    setCart(cartData);
    setProducts(Object.values(cartData).filter(Boolean));
  };

  const handleRemove = (id) => {
    const cartData = JSON.parse(localStorage.getItem("cart")) || {};
    if (cartData[id]) {
      cartData[id].quantity -= 1;
      if (cartData[id].quantity <= 0) delete cartData[id];
    }
    localStorage.setItem("cart", JSON.stringify(cartData));
    setCart(cartData);
    setProducts(Object.values(cartData).filter(Boolean));
  };

  const total = products.reduce((sum, p) => sum + (p?.price || 0) * (p?.quantity || 0), 0);

  return (
    <div className="max-w-4xl p-6 mx-auto">
      <h2 className="mb-4 text-2xl font-bold">🛒 Checkout</h2>
      {products.length === 0 ? (
        <p>No items in cart.</p>
      ) : (
        <div className="space-y-6">
          {products.map((item) => (
            <div key={item.id} className="flex items-center justify-between pb-4 border-b">
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
            Total: ${total.toFixed(2)}
          </div>
        </div>
      )}
    </div>
  );
};

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Suspense fallback={<div className="p-4">Loading...</div>}>
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<CartComponent />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </div>
  );
}

export default App;
