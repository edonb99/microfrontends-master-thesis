import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const ProductList = React.lazy(() => import("product_list/ProductList"));
const ProductDetail = React.lazy(() => import("product_detail/ProductDetail"));
const Cart = React.lazy(() => import("cart/Cart"));

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Suspense fallback={<div className="p-4">Loading...</div>}>
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </div>
  );
}

export default App;
