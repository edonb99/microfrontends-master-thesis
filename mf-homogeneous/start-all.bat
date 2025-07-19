@echo off
echo Starting all microfrontends...

echo Starting Product List (port 3001)...
start "Product List" cmd /k "cd /d c:\Users\e.budakova\LocalFiles\microfrontends-master-thesis\mf-homogeneous\mf-product-list && npm start"

echo Starting Product Detail (port 3002)...
start "Product Detail" cmd /k "cd /d c:\Users\e.budakova\LocalFiles\microfrontends-master-thesis\mf-homogeneous\mf-product-detail && npm start"

echo Starting Cart (port 3003)...
start "Cart" cmd /k "cd /d c:\Users\e.budakova\LocalFiles\microfrontends-master-thesis\mf-homogeneous\mf-cart && npm start"

echo Waiting 15 seconds for remotes to start...
timeout /t 15 /nobreak >nul

echo Starting Shell (port 3000)...
start "Shell" cmd /k "cd /d c:\Users\e.budakova\LocalFiles\microfrontends-master-thesis\mf-homogeneous\mf-shell && npm start"

echo.
echo All microfrontends started in separate windows!
echo.
echo URLs:
echo - Shell: http://localhost:3000
echo - Product List: http://localhost:3001
echo - Product Detail: http://localhost:3002
echo - Cart: http://localhost:3003
echo.
pause
