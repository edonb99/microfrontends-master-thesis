import React, { Suspense, useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";

const ProductList = React.lazy(() => import("product_list/ProductList"));
const ProductDetail = React.lazy(() => import("product_detail/ProductDetail"));

// Navigation Component with cart count and University branding
const Navigation = () => {
  const [cartCount, setCartCount] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '{}');
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
              <span className="text-white font-bold text-sm">H</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-gray-900">Heterogeneous Microfrontends</span>
              <span className="text-xs text-gray-500 -mt-1">UP FIEK - Master Thesis Project</span>
            </div>
          </Link>

          {/* Navigation Links */}
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

// Svelte Cart Component wrapper - this is where React meets Svelte
const SvelteCartWrapper = () => {
  const containerRef = React.useRef(null);
  const svelteInstance = React.useRef(null);

  React.useEffect(() => {
    const loadSvelteCart = async () => {
      try {
        console.log('🔄 Loading Svelte cart...');
        const { default: SvelteCart } = await import("cart/Cart");
        console.log('✅ Svelte cart loaded:', SvelteCart);
        
        if (containerRef.current && !svelteInstance.current) {
          console.log('🎯 Mounting Svelte cart to container');
          svelteInstance.current = new SvelteCart({
            target: containerRef.current,
          });
          console.log('✅ Svelte cart mounted successfully');
        }
      } catch (error) {
        console.error('❌ Failed to load Svelte cart:', error);
      }
    };

    loadSvelteCart();

    // Cleanup function
    return () => {
      if (svelteInstance.current) {
        console.log('🧹 Destroying Svelte cart instance');
        svelteInstance.current.$destroy();
        svelteInstance.current = null;
      }
    };
  }, []);

  return React.createElement('div', { 
    ref: containerRef,
    className: 'svelte-cart-container'
  });
};

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navigation />
        <main className="pt-16 flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Suspense fallback={
              <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
                <span className="ml-3 text-gray-600">Loading microfrontend...</span>
              </div>
            }>
              <Routes>
                <Route path="/" element={
                  <div>
                    <div className="mb-8">
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">Our Products</h1>
                      <p className="text-gray-600">Discover our curated collection via React microfrontend</p>
                    </div>
                    <ProductList />
                  </div>
                } />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<SvelteCartWrapper />} />
              </Routes>
            </Suspense>
          </div>
        </main>
        
        {/* University Footer */}
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
                <div>Heterogeneous Microfrontend Architecture</div>
                <div className="text-xs mt-1">React Shell + React Remotes + Svelte Cart</div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
