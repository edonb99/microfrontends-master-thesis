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

// Svelte Cart Component wrapper for React
const SvelteCartComponent = () => {
  const containerRef = React.useRef(null);
  const componentRef = React.useRef(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const loadSvelteCart = async () => {
      try {
        console.log('🔄 Starting Svelte Cart loading...');
        setLoading(true);
        setError(null);
        
        // Wait for container to be available
        let attempts = 0;
        while (!containerRef.current && attempts < 10) {
          console.log(`⏳ Waiting for container... attempt ${attempts + 1}`);
          await new Promise(resolve => setTimeout(resolve, 100));
          attempts++;
        }
        
        const container = containerRef.current;
        if (!container) {
          throw new Error('Container element not found after 10 attempts');
        }
        
        console.log('📍 Container found:', container);
        
        // Clear any previous content
        container.innerHTML = '';
        
        console.log('🔄 Importing cart module from cart/Cart...');
        
        // Import the cart module
        const SvelteCartModule = await import("cart/Cart");
        console.log('✅ Cart module imported:', SvelteCartModule);
        console.log('✅ Available exports:', Object.keys(SvelteCartModule));
        
        let SvelteCart;
        
        // Handle different export patterns
        if (SvelteCartModule.default) {
          SvelteCart = SvelteCartModule.default;
          console.log('🎯 Using default export');
        } else if (typeof SvelteCartModule === 'function') {
          SvelteCart = SvelteCartModule;
          console.log('🎯 Using direct export');
        } else {
          throw new Error(`No valid Svelte component found. Available: ${Object.keys(SvelteCartModule).join(', ')}`);
        }
        
        console.log('🎯 Component constructor:', typeof SvelteCart);
        
        if (componentRef.current) {
          console.log('🧹 Destroying existing component...');
          componentRef.current.$destroy();
          componentRef.current = null;
        }
        
        // Create new Svelte component instance
        console.log('🚀 Creating new Svelte component...');
        componentRef.current = new SvelteCart({
          target: container,
        });
        
        console.log('✅ Svelte Cart created successfully!');
        setLoading(false);
        
      } catch (error) {
        console.error('❌ Error loading Svelte Cart:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    // Start loading after a brief delay
    const timeout = setTimeout(loadSvelteCart, 50);
    
    return () => {
      clearTimeout(timeout);
      if (componentRef.current) {
        console.log('🧹 Cleanup: destroying component...');
        try {
          componentRef.current.$destroy();
        } catch (e) {
          console.warn('Warning during cleanup:', e);
        }
        componentRef.current = null;
      }
    };
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div style={{ 
          display: 'inline-block',
          width: '2rem', 
          height: '2rem', 
          border: '2px solid #e5e7eb',
          borderTop: '2px solid #3b82f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '1rem'
        }}></div>
        <p style={{ fontSize: '1.125rem', fontWeight: '600' }}>Loading Svelte cart...</p>
        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
          Check browser console for detailed logs
        </p>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div style={{ 
          maxWidth: '28rem', 
          margin: '0 auto', 
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '0.5rem',
          padding: '1.5rem'
        }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#991b1b' }}>
            ❌ Failed to load Svelte cart
          </h2>
          <div style={{ 
            fontSize: '0.875rem',
            backgroundColor: 'white',
            padding: '0.75rem',
            borderRadius: '0.25rem',
            border: '1px solid #e5e7eb',
            textAlign: 'left',
            marginBottom: '1rem'
          }}>
            <code style={{ fontSize: '0.75rem', color: '#dc2626' }}>{error}</code>
          </div>
          <button 
            onClick={() => window.location.reload()}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              borderRadius: '0.25rem',
              border: 'none',
              fontSize: '0.875rem',
              cursor: 'pointer'
            }}
          >
            🔄 Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%' }}>
      <div style={{
        marginBottom: '1rem',
        padding: '0.75rem',
        backgroundColor: '#f0fdf4',
        border: '1px solid #bbf7d0',
        borderRadius: '0.25rem'
      }}>
        <p style={{ fontSize: '0.875rem', color: '#15803d' }}>
          ✅ Svelte cart loaded! Component appears below:
        </p>
      </div>
      <div 
        ref={containerRef}
        style={{
          width: '100%',
          minHeight: '400px',
          border: '2px dashed #d1d5db',
          borderRadius: '0.5rem',
          padding: '1rem',
          backgroundColor: 'white'
        }}
      >
        {/* Svelte component mounts here */}
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <BrowserRouter>
        <Navigation />
        {/* Test TailwindCSS */}
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mx-4 mt-2 text-sm">
          <strong>TailwindCSS Test:</strong> If you see green styling here, TailwindCSS is working! 
          If not, TailwindCSS is not processing correctly.
        </div>
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
              <Route path="/cart" element={<SvelteCartComponent />} />
            </Routes>
          </Suspense>
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App;
        
        // Wait for container to be available
        let attempts = 0;
        while (!containerRef.current && attempts < 10) {
          console.log(`⏳ Waiting for container... attempt ${attempts + 1}`);
          await new Promise(resolve => setTimeout(resolve, 100));
          attempts++;
        }
        
        const container = containerRef.current;
        if (!container) {
          throw new Error('Container element not found after 10 attempts');
        }
        
        console.log('📍 Container found:', container);
        
        // Clear any previous content
        container.innerHTML = '';
        
        console.log('🔄 Importing cart module from cart/Cart...');
        
        // Import the cart module
        const SvelteCartModule = await import("cart/Cart");
        console.log('✅ Cart module imported:', SvelteCartModule);
        console.log('✅ Available exports:', Object.keys(SvelteCartModule));
        
        let SvelteCart;
        
        // Handle different export patterns
        if (SvelteCartModule.default) {
          SvelteCart = SvelteCartModule.default;
          console.log('🎯 Using default export');
        } else if (typeof SvelteCartModule === 'function') {
          SvelteCart = SvelteCartModule;
          console.log('🎯 Using direct export');
        } else {
          throw new Error(`No valid Svelte component found. Available: ${Object.keys(SvelteCartModule).join(', ')}`);
        }
        
        console.log('🎯 Component constructor:', typeof SvelteCart);
        
        if (componentRef.current) {
          console.log('🧹 Destroying existing component...');
          componentRef.current.$destroy();
          componentRef.current = null;
        }
        
        // Create new Svelte component instance
        console.log('🚀 Creating new Svelte component...');
        componentRef.current = new SvelteCart({
          target: container,
        });
        
        console.log('✅ Svelte Cart created successfully!');
        setLoading(false);
        
      } catch (error) {
        console.error('❌ Error loading Svelte Cart:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    // Start loading after a brief delay
    const timeout = setTimeout(loadSvelteCart, 50);
    
    return () => {
      clearTimeout(timeout);
      if (componentRef.current) {
        console.log('🧹 Cleanup: destroying component...');
        try {
          componentRef.current.$destroy();
        } catch (e) {
          console.warn('Warning during cleanup:', e);
        }
        componentRef.current = null;
      }
    };
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div style={{ 
          display: 'inline-block',
          width: '2rem', 
          height: '2rem', 
          border: '2px solid #e5e7eb',
          borderTop: '2px solid #3b82f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '1rem'
        }}></div>
        <p style={{ fontSize: '1.125rem', fontWeight: '600' }}>Loading Svelte cart...</p>
        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
          Check browser console for detailed logs
        </p>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div style={{ 
          maxWidth: '28rem', 
          margin: '0 auto', 
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '0.5rem',
          padding: '1.5rem'
        }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#991b1b' }}>
            ❌ Failed to load Svelte cart
          </h2>
          <div style={{ 
            fontSize: '0.875rem',
            backgroundColor: 'white',
            padding: '0.75rem',
            borderRadius: '0.25rem',
            border: '1px solid #e5e7eb',
            textAlign: 'left',
            marginBottom: '1rem'
          }}>
            <code style={{ fontSize: '0.75rem', color: '#dc2626' }}>{error}</code>
          </div>
          <button 
            onClick={() => window.location.reload()}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              borderRadius: '0.25rem',
              border: 'none',
              fontSize: '0.875rem',
              cursor: 'pointer'
            }}
          >
            🔄 Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%' }}>
      <div style={{
        marginBottom: '1rem',
        padding: '0.75rem',
        backgroundColor: '#f0fdf4',
        border: '1px solid #bbf7d0',
        borderRadius: '0.25rem'
      }}>
        <p style={{ fontSize: '0.875rem', color: '#15803d' }}>
          ✅ Svelte cart loaded! Component appears below:
        </p>
      </div>
      <div 
        ref={containerRef}
        style={{
          width: '100%',
          minHeight: '400px',
          border: '2px dashed #d1d5db',
          borderRadius: '0.5rem',
          padding: '1rem',
          backgroundColor: 'white'
        }}
      >
        {/* Svelte component mounts here */}
      </div>
    </div>
  );
};
  const componentRef = React.useRef(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  // Callback ref to ensure we get the DOM element when it's created
  const containerRefCallback = React.useCallback((element) => {
    if (element) {
      console.log('📍 Container element set:', element);
      setContainerElement(element);
    }
  }, []);

  React.useEffect(() => {
    if (!containerElement) {
      console.log('⏳ Waiting for container element...');
      return;
    }

    const loadSvelteCart = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔄 Container available, loading Svelte Cart...');
        
        // Clear any previous content
        containerElement.innerHTML = '';
        
        console.log('🔄 Attempting to load Svelte Cart from cart/Cart...');
        
        // Try to import the cart module
        const SvelteCartModule = await import("cart/Cart");
        console.log('✅ Svelte Cart module loaded:', SvelteCartModule);
        
        let SvelteCart;
        
        // Handle different export patterns
        if (SvelteCartModule.default) {
          SvelteCart = SvelteCartModule.default;
        } else if (typeof SvelteCartModule === 'function') {
          SvelteCart = SvelteCartModule;
        } else {
          console.error('❌ Module structure:', Object.keys(SvelteCartModule));
          throw new Error('Unable to find Svelte component constructor in module');
        }
        
        console.log('🎯 Using Svelte Cart constructor:', typeof SvelteCart);
        
        if (SvelteCart && !componentRef.current) {
          // Create Svelte 3 component instance
          console.log('🚀 Creating Svelte component instance...');
          componentRef.current = new SvelteCart({
            target: containerElement,
          });
          
          console.log('✅ Svelte Cart component instantiated successfully');
          setLoading(false);
        } else {
          throw new Error(`Missing requirements: SvelteCart=${!!SvelteCart}, alreadyMounted=${!!componentRef.current}`);
        }
      } catch (error) {
        console.error("❌ Failed to load Svelte Cart:", error);
        console.error("Error stack:", error.stack);
        setError(`${error.message}`);
        setLoading(false);
      }
    };

    loadSvelteCart();

    return () => {
      if (componentRef.current) {
        try {
          console.log('🧹 Cleaning up Svelte component...');
          componentRef.current.$destroy();
          componentRef.current = null;
        } catch (e) {
          console.warn('⚠️ Error destroying Svelte component:', e);
        }
      }
    };
  }, [containerElement]);

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-lg font-semibold">Loading Svelte cart...</p>
        <p className="text-sm text-gray-500 mt-2">
          {!containerElement ? 'Setting up container...' : 'Loading cart module...'}
        </p>
        <p className="text-xs text-gray-400 mt-1">Check browser console for detailed logs</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="max-w-md mx-auto bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4 text-red-800">❌ Failed to load Svelte cart</h2>
          <div className="text-sm bg-white p-3 rounded border text-left mb-4">
            <p className="font-mono text-xs text-red-600">{error}</p>
          </div>
          <div className="text-sm text-gray-700">
            <p className="font-semibold mb-2">Troubleshooting:</p>
            <ul className="text-left list-disc list-inside space-y-1 text-xs">
              <li>✅ Svelte cart is running on port 4003</li>
              <li>Check that <code className="bg-gray-200 px-1 rounded">http://localhost:4003/remoteEntry.js</code> is accessible</li>
              <li>Open browser console for detailed error logs</li>
              <li>Verify CORS headers are set correctly</li>
            </ul>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
          >
            🔄 Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
        <p className="text-sm text-green-700">
          ✅ Svelte cart container is ready and component should be loaded below:
        </p>
      </div>
      <div 
        ref={containerRefCallback} 
        className="w-full min-h-[400px] border-2 border-dashed border-gray-300 rounded-lg p-4 bg-white"
        style={{ minHeight: '400px' }}
      />
    </div>
  );
};

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <BrowserRouter>
        <Navigation />
        {/* Test TailwindCSS */}
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mx-4 mt-2 text-sm">
          <strong>TailwindCSS Test:</strong> If you see green styling here, TailwindCSS is working! 
          If not, TailwindCSS is not processing correctly.
        </div>
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
              <Route path="/cart" element={<SvelteCartComponent />} />
            </Routes>
          </Suspense>
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App;
