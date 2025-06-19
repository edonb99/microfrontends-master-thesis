import React from "react";
import ProductList from "../components/ProductList";

const Home = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold my-6 text-center">Monolitic prototype</h1>
      <ProductList />
    </div>
  );
};

export default Home;
