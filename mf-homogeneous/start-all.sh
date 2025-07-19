#!/bin/bash

echo "Starting all microfrontends..."

# Get the base directory
BASE_DIR="c:/Users/e.budakova/LocalFiles/microfrontends-master-thesis/mf-homogeneous"

# Start remote microfrontends first
echo "Starting Product List (port 3001)..."
cd "$BASE_DIR/mf-product-list" && npm start &
PRODUCT_LIST_PID=$!

echo "Starting Product Detail (port 3002)..."
cd "$BASE_DIR/mf-product-detail" && npm start &
PRODUCT_DETAIL_PID=$!

echo "Starting Cart (port 3003)..."
cd "$BASE_DIR/mf-cart" && npm start &
CART_PID=$!

echo "Waiting for remotes to start..."
sleep 15

echo "Starting Shell (port 3000)..."
cd "$BASE_DIR/mf-shell" && npm start &
SHELL_PID=$!

echo "All microfrontends started!"
echo ""
echo "URLs:"
echo "- Shell: http://localhost:3000"
echo "- Product List: http://localhost:3001"
echo "- Product Detail: http://localhost:3002"
echo "- Cart: http://localhost:3003"
echo ""
echo "Process IDs:"
echo "Product List PID: $PRODUCT_LIST_PID"
echo "Product Detail PID: $PRODUCT_DETAIL_PID"
echo "Cart PID: $CART_PID"
echo "Shell PID: $SHELL_PID"

wait
