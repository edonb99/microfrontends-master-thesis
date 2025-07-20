import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import './App.css';
import Home from './pages/Home';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart.jsx';
import { getCart } from './utils/cart';

// Navigation Component with cart count
const Navbar = () => {
  const [cartCount, setCartCount] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const updateCartCount = () => {
      const cart = getCart();
      const count = Object.values(cart)
        .filter(Boolean)
        .reduce((sum, p) => sum + (p?.quantity || 0), 0);
      setCartCount(count);
    };

    updateCartCount();
    
    // Listen for cart changes
    const interval = setInterval(updateCartCount, 100);
    return () => clearInterval(interval);
  }, []);

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-gray-900">Monolithic Prototype</span>
              <span className="text-xs text-gray-500 -mt-1">UP FIEK - Master Thesis Project</span>
            </div>
          </Link>
         
          <div className="flex items-center space-x-1">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive('/')
                  ? 'bg-blue-50 text-blue-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <span className="flex items-center space-x-1">
                <span>📦</span>
                <span>Products</span>
              </span>
            </Link>
            
            <Link
              to="/cart"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative ${
                isActive('/cart')
                  ? 'bg-blue-50 text-blue-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <span className="flex items-center space-x-1">
                <span>🛒</span>
                <span>Cart</span>
                {cartCount > 0 && (
                  <span className="ml-1 px-2 py-0.5 text-xs font-semibold text-white bg-blue-700 rounded-full min-w-[20px] text-center">
                    {cartCount}
                  </span>
                )}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="pt-16 flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </main>
        
        <footer className="bg-white border-t border-gray-100 py-6 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">UP</span>
                </div>
                <div className="text-sm">
                  <div className="font-semibold text-gray-900">Universiteti i Prishtinës "Hasan Prishtina"</div>
                  <div className="text-gray-600">University of Prishtina</div>
                  <div className="text-gray-600 mt-1">FIEK - Fakulteti i Inxhinierisë Elektrike dhe Kompjuterike</div>
                  <div className="text-gray-500 text-xs">Faculty of Electrical and Computer Engineering</div>
                </div>
              </div>
              <div className="text-sm text-gray-500 text-center md:text-right">
                <div>Master Thesis Project - 2025</div>
                <div>Microfrontend Architecture Analysis</div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
