import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProductDetail from "./ProductDetail";

const App = () => (
  <BrowserRouter>
    <div className="p-4 mb-4 text-center text-white bg-purple-600">
      🧩 ProductDetail Microfrontend - Standalone Mode
    </div>
    <Routes>
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/" element={<ProductDetail />} />
    </Routes>
  </BrowserRouter>
);

export default App;
