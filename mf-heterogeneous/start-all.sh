#!/bin/bash

echo "Starting Heterogeneous Microfrontends..."

echo ""
echo "Starting Product List (React Remote) - Port 4001..."
(cd mf-product-list && npm start) &

sleep 5

echo "Starting Product Detail (React Remote) - Port 4002..."
(cd mf-product-detail && npm start) &

sleep 5

echo "Starting Cart (Svelte Remote) - Port 4003..."
(cd mf-cart-svelte && npm run dev) &

sleep 5

echo "Starting Shell (Host) - Port 4000..."
(cd mf-shell && npm start) &

echo ""
echo "All applications started!"
echo "Shell: http://localhost:4000"
echo "Product List: http://localhost:4001"
echo "Product Detail: http://localhost:4002"
echo "Cart: http://localhost:4003"
echo ""
echo "Press Ctrl+C to stop all applications"

wait
