import React from "react";
import MockRouter from "./MockRouter";
import ProductList from "./ProductList";

function App() {
  return (
    <div className="app">
      <MockRouter>
        <ProductList />
      </MockRouter>
    </div>
  );
}

export default App;
