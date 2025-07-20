import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";

const ProductList = React.lazy(() => import("product_list/ProductList"));
const ProductDetail = React.lazy(() => import("product_detail/ProductDetail"));

// Navigation Component
const Navigation = () => {
  const location = useLocation();
  
  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };
  
  return (
    <nav className="bg-blue-600 text-white p-4 shadow-lg">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <h1 className="text-xl font-bold">🏪 Microfrontend Store</h1>
        <div className="flex space-x-4">
          <Link 
            to="/" 
            className={`px-3 py-2 rounded transition-colors ${
              isActive('/') 
                ? 'bg-blue-800 text-white' 
                : 'hover:bg-blue-700'
            }`}
          >
            📦 Products
          </Link>
          <Link 
            to="/cart" 
            className={`px-3 py-2 rounded transition-colors ${
              isActive('/cart') 
                ? 'bg-blue-800 text-white' 
                : 'hover:bg-blue-700'
            }`}
          >
            🛒 Cart
          </Link>
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
    <div className="min-h-screen bg-gray-50">
      <BrowserRouter>
        <Navigation />
        <main className="container mx-auto px-4 py-6">
          <Suspense fallback={
            <div className="flex items-center justify-center p-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-2 text-gray-600">Loading...</span>
            </div>
          }>
            <Routes>
              <Route path="/" element={<ProductList />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<SvelteCartWrapper />} />
            </Routes>
          </Suspense>
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App;
