import React from "react";
import ProductList from "../components/ProductList";

const Home = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Our Products</h1>
        <p className="text-gray-600">Discover our curated collection of premium products</p>
      </div>
      <ProductList />
    </div>
  );
};

export default Home;
