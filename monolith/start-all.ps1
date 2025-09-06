# Starting Monolithic Application...
Write-Host "Starting Monolithic Application..." -ForegroundColor Green

Write-Host "`nStarting Monolithic React App - Port 5000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PWD'; `$env:PORT='5000'; npm start"

Write-Host "`nMonolithic application started!" -ForegroundColor Green
Write-Host "Application: http://localhost:5000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Note: This is a single React application with all features integrated" -ForegroundColor Gray

Write-Host "`nPress any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
