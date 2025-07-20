#!/bin/bash

echo "🚀 Starting Heterogeneous Microfrontends..."

# Function to check if port is in use
check_port() {
    if netstat -tuln 2>/dev/null | grep ":$1 " > /dev/null; then
        echo "⚠️  Port $1 is already in use"
        return 1
    else
        echo "✅ Port $1 is available"
        return 0
    fi
}

# Check all required ports
echo ""
echo "🔍 Checking ports..."
check_port 4000
check_port 4001
check_port 4002
check_port 4003

echo ""
echo "📦 Installing dependencies (if needed)..."

# Install dependencies if node_modules doesn't exist
for dir in mf-shell mf-product-list mf-product-detail mf-cart-svelte; do
    if [ ! -d "$dir/node_modules" ]; then
        echo "Installing dependencies for $dir..."
        (cd $dir && npm install)
    fi
done

echo ""
echo "🚀 Starting applications..."

echo "Starting Product List (React Remote) - Port 4001..."
(cd mf-product-list && npm start) &
PRODUCT_LIST_PID=$!

sleep 5

echo "Starting Product Detail (React Remote) - Port 4002..."
(cd mf-product-detail && npm start) &
PRODUCT_DETAIL_PID=$!

sleep 5

echo "Starting Cart (Svelte Remote) - Port 4003..."
echo "Starting Svelte cart in development mode..."
(cd mf-cart-svelte && npm run dev) &
CART_PID=$!

sleep 5

echo "Starting Shell (Host) - Port 4000..."
(cd mf-shell && npm start) &
SHELL_PID=$!

echo ""
echo "✅ All applications started!"
echo "📱 URLs:"
echo "   🏪 Shell:          http://localhost:4000"
echo "   📦 Product List:   http://localhost:4001"
echo "   📄 Product Detail: http://localhost:4002"
echo "   🛒 Cart (Svelte):  http://localhost:4003"
echo ""
echo "🧪 Test Module Federation: file://$(pwd)/test-cart-module.html"
echo ""
echo "💡 Tips:"
echo "   • Navigate to http://localhost:4000/cart to test Svelte integration"
echo "   • Check browser console for detailed Module Federation logs"
echo "   • The Shell integrates all remotes including the Svelte cart"
echo ""
echo "🛑 Press Ctrl+C to stop all applications"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping all applications..."
    kill $PRODUCT_LIST_PID $PRODUCT_DETAIL_PID $CART_PID $SHELL_PID 2>/dev/null
    echo "✅ All applications stopped"
    exit 0
}

# Set trap to cleanup on exit
trap cleanup SIGINT SIGTERM

# Wait for all background processes
wait
