import React from "react";
import { Routes, Route } from "react-router-dom";
import MockRouter from "./MockRouter";
import ProductDetail from "./ProductDetail";

function App() {
  return (
    <div className="app">
      <MockRouter>
        <Routes>
          <Route path="/product/:id" element={<ProductDetail />} />
        </Routes>
      </MockRouter>
    </div>
  );
}

export default App;
