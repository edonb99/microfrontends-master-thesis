# Starting Heterogeneous Microfrontends...
Write-Host "Starting Heterogeneous Microfrontends..." -ForegroundColor Green

Write-Host "`nStarting Product List (React Remote) - Port 4001..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd mf-product-list; npm start"

Start-Sleep -Seconds 3

Write-Host "Starting Product Detail (React Remote) - Port 4002..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd mf-product-detail; npm start"

Start-Sleep -Seconds 3

Write-Host "Starting Cart (Svelte Remote) - Port 4003..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd mf-cart-svelte; npm run dev"

Start-Sleep -Seconds 5

Write-Host "Starting Shell (Host) - Port 4000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd mf-shell; npm start"

Write-Host "`nAll applications started!" -ForegroundColor Green
Write-Host "Shell: http://localhost:4000" -ForegroundColor Cyan
Write-Host "Product List: http://localhost:4001" -ForegroundColor Cyan
Write-Host "Product Detail: http://localhost:4002" -ForegroundColor Cyan
Write-Host "Cart (Svelte): http://localhost:4003" -ForegroundColor Cyan
Write-Host ""
Write-Host "Note: Cart is integrated into the Shell at /cart route" -ForegroundColor Gray

Write-Host "`nPress any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
