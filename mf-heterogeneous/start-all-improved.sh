#!/bin/bash

echo "🚀 Starting Heterogeneous Microfrontend Applications"
echo "=================================================="

# Function to check if port is in use
check_port() {
    netstat -tuln | grep :$1 > /dev/null
    if [ $? -eq 0 ]; then
        echo "⚠️  Port $1 is already in use"
        return 1
    else
        echo "✅ Port $1 is available"
        return 0
    fi
}

# Check all required ports
echo "🔍 Checking ports..."
check_port 4000
check_port 4001  
check_port 4002
check_port 4003

echo ""
echo "📦 Installing dependencies (if needed)..."

# Install shell dependencies
cd mf-shell
if [ ! -d "node_modules" ]; then
    echo "Installing shell dependencies..."
    npm install
fi
cd ..

# Install product-list dependencies
cd mf-product-list
if [ ! -d "node_modules" ]; then
    echo "Installing product-list dependencies..."
    npm install
fi
cd ..

# Install product-detail dependencies
cd mf-product-detail
if [ ! -d "node_modules" ]; then
    echo "Installing product-detail dependencies..."
    npm install
fi
cd ..

# Install cart-svelte dependencies
cd mf-cart-svelte
if [ ! -d "node_modules" ]; then
    echo "Installing cart-svelte dependencies..."
    npm install
fi
cd ..

echo ""
echo "🚀 Starting applications..."

# Start all applications in background
echo "Starting Product List (port 4001)..."
cd mf-product-list && npm start &
PRODUCT_LIST_PID=$!

echo "Starting Product Detail (port 4002)..."
cd ../mf-product-detail && npm start &
PRODUCT_DETAIL_PID=$!

echo "Starting Cart Svelte (port 4003)..."
cd ../mf-cart-svelte && npm run dev &
CART_SVELTE_PID=$!

echo "Starting Shell (port 4000)..."
cd ../mf-shell && npm start &
SHELL_PID=$!

echo ""
echo "✅ All applications started!"
echo "📱 URLs:"
echo "   🏪 Shell:          http://localhost:4000"  
echo "   📦 Product List:   http://localhost:4001"
echo "   📄 Product Detail: http://localhost:4002"
echo "   🛒 Cart (Svelte):  http://localhost:4003"
echo ""
echo "🛑 Press Ctrl+C to stop all applications"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping all applications..."
    kill $PRODUCT_LIST_PID $PRODUCT_DETAIL_PID $CART_SVELTE_PID $SHELL_PID 2>/dev/null
    echo "✅ All applications stopped"
    exit 0
}

# Set trap to cleanup on exit
trap cleanup SIGINT SIGTERM

# Wait for all background processes
wait $PRODUCT_LIST_PID $PRODUCT_DETAIL_PID $CART_SVELTE_PID $SHELL_PID
