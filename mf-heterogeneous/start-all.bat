@echo off
echo Starting Heterogeneous Microfrontends...

echo.
echo Starting Shell (Host) - Port 4000...
start "Shell" cmd /k "cd mf-shell && npm run build && npm run preview"

timeout /t 3

echo Starting Product List (React Remote) - Port 4001...
start "Product List" cmd /k "cd mf-product-list && npm run build && npm run preview"

timeout /t 3

echo Starting Product Detail (React Remote) - Port 4002...
start "Product Detail" cmd /k "cd mf-product-detail && npm run build && npm run preview"

timeout /t 3

echo Starting Cart (Svelte Remote) - Port 4003...
start "Cart Svelte" cmd /k "cd mf-cart-svelte && npm run build && npm run preview"

echo.
echo All applications started!
echo Shell: http://localhost:4000
echo Product List: http://localhost:4001
echo Product Detail: http://localhost:4002
echo Cart (Svelte): http://localhost:4003
echo.
echo Note: Cart is integrated into the Shell at /cart route
pause
