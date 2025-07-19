import React, { Suspense } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';

// React remotes
const ProductList = React.lazy(() => import('mfproductlist/ProductList'));
const Cart = React.lazy(() => import('mfcart/Cart'));

// Svelte remote
const ProductDetail = React.lazy(() => import('mfproductdetail/ProductDetail'));

function App() {
  return (
    <div className="App">
      <nav className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Heterogeneous MF Store</h1>
          <div className="space-x-4">
            <Link to="/" className="hover:underline">Home</Link>
            <Link to="/products" className="hover:underline">Products</Link>
            <Link to="/cart" className="hover:underline">Cart</Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto p-4">
        <Suspense fallback={<div className="text-center p-8">Loading...</div>}>
          <Routes>
            <Route path="/" element={
              <div>
                <h2 className="text-2xl font-bold mb-4">Welcome to Heterogeneous Microfrontend Store</h2>
                <p className="mb-4">This demo showcases:</p>
                <ul className="list-disc list-inside mb-4">
                  <li>React Host Shell (this application)</li>
                  <li>React Product List Remote</li>
                  <li>Svelte Product Detail Remote</li>
                  <li>React Cart Remote</li>
                </ul>
                <Link to="/products" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  Start Shopping
                </Link>
              </div>
            } />
            <Route path="/products" element={<ProductList />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}

export default App;
