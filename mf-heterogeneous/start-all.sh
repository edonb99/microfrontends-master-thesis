#!/bin/bash

echo "Starting Heterogeneous Microfrontends Architecture..."
echo "React Host + React Remotes + Svelte Remote"

# Get the base directory
BASE_DIR="c:/Users/e.budakova/LocalFiles/microfrontends-master-thesis/mf-heterogeneous"

# Start React remotes first
echo "Starting Product List React (port 4001)..."
cd "$BASE_DIR/mf-product-list-react" && npm start &
PRODUCT_LIST_PID=$!

echo "Starting Cart React (port 4003)..."
cd "$BASE_DIR/mf-cart-react" && npm start &
CART_PID=$!

echo "Starting Product Detail Svelte (port 4002)..."
cd "$BASE_DIR/mf-product-detail-svelte" && npm run dev &
PRODUCT_DETAIL_PID=$!

echo "Waiting for remotes to start..."
sleep 15

echo "Starting Shell React (port 4000)..."
cd "$BASE_DIR/mf-shell-react" && npm start &
SHELL_PID=$!

echo "All microfrontends started!"
echo ""
echo "🏗️ Heterogeneous Architecture URLs:"
echo "- 🏠 Shell (React): http://localhost:4000"
echo "- 📦 Product List (React): http://localhost:4001"
echo "- 🎨 Product Detail (Svelte): http://localhost:4002"
echo "- 🛒 Cart (React): http://localhost:4003"
echo ""
echo "Process IDs:"
echo "Product List PID: $PRODUCT_LIST_PID"
echo "Product Detail PID: $PRODUCT_DETAIL_PID"
echo "Cart PID: $CART_PID"
echo "Shell PID: $SHELL_PID"

wait
