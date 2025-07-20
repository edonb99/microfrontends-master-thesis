# Starting Heterogeneous Microfrontends...
Write-Host "Starting Heterogeneous Microfrontends..." -ForegroundColor Green

Write-Host "`nStarting Shell (Host) - Port 4000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd mf-shell; npm start"

Start-Sleep -Seconds 3

Write-Host "Starting Product List (React Remote) - Port 4001..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd mf-product-list; npm start"

Start-Sleep -Seconds 3

Write-Host "Starting Product Detail (React Remote) - Port 4002..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd mf-product-detail; npm start"

Start-Sleep -Seconds 3

Write-Host "Starting Cart (Svelte Remote) - Port 4003..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd mf-cart-svelte; npm run dev"

Write-Host "`nAll applications started!" -ForegroundColor Green
Write-Host "Shell: http://localhost:4000" -ForegroundColor Cyan
Write-Host "Product List: http://localhost:4001" -ForegroundColor Cyan
Write-Host "Product Detail: http://localhost:4002" -ForegroundColor Cyan
Write-Host "Cart: http://localhost:4003" -ForegroundColor Cyan

Write-Host "`nPress any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
