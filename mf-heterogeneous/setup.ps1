# Heterogeneous Microfrontend Startup Script
# Run this script to install dependencies for all microfrontends

Write-Host "🚀 Setting up Heterogeneous Microfrontend Architecture..." -ForegroundColor Green
Write-Host ""

# Function to run npm install in a directory
function Install-Dependencies {
    param($Directory, $Description)
    
    Write-Host "📦 Installing dependencies for $Description..." -ForegroundColor Yellow
    Push-Location $Directory
    try {
        npm install
        Write-Host "✅ $Description dependencies installed successfully!" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to install $Description dependencies!" -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
    }
    Pop-Location
    Write-Host ""
}

# Install dependencies for all microfrontends
Install-Dependencies "mf-shell-react" "React Shell (Host)"
Install-Dependencies "mf-product-list-react" "React Product List Remote"
Install-Dependencies "mf-product-detail-svelte" "Svelte Product Detail Remote"
Install-Dependencies "mf-cart-react" "React Cart Remote"

Write-Host "🎉 All dependencies installed!" -ForegroundColor Green
Write-Host ""
Write-Host "To start the development servers, run these commands in separate terminals:" -ForegroundColor Cyan
Write-Host ""
Write-Host "Terminal 1 - React Shell (Host):" -ForegroundColor White
Write-Host "cd mf-shell-react && npm start" -ForegroundColor Gray
Write-Host ""
Write-Host "Terminal 2 - React Product List:" -ForegroundColor White  
Write-Host "cd mf-product-list-react && npm start" -ForegroundColor Gray
Write-Host ""
Write-Host "Terminal 3 - Svelte Product Detail:" -ForegroundColor White
Write-Host "cd mf-product-detail-svelte && npm start" -ForegroundColor Gray
Write-Host ""
Write-Host "Terminal 4 - React Cart:" -ForegroundColor White
Write-Host "cd mf-cart-react && npm start" -ForegroundColor Gray
Write-Host ""
Write-Host "Then open http://localhost:4000 in your browser!" -ForegroundColor Green
