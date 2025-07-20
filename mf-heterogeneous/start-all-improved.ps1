# PowerShell script to start all microfrontend applications

Write-Host "🚀 Starting Heterogeneous Microfrontend Applications" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green

# Function to check if port is in use
function Test-Port {
    param([int]$Port)
    try {
        $null = Test-NetConnection -ComputerName localhost -Port $Port -InformationLevel Quiet -WarningAction SilentlyContinue
        if ($?) {
            Write-Host "⚠️  Port $Port is already in use" -ForegroundColor Yellow
            return $false
        } else {
            Write-Host "✅ Port $Port is available" -ForegroundColor Green
            return $true
        }
    } catch {
        Write-Host "✅ Port $Port is available" -ForegroundColor Green
        return $true
    }
}

# Check all required ports
Write-Host ""
Write-Host "🔍 Checking ports..." -ForegroundColor Blue
Test-Port -Port 4000
Test-Port -Port 4001
Test-Port -Port 4002
Test-Port -Port 4003

Write-Host ""
Write-Host "📦 Installing dependencies (if needed)..." -ForegroundColor Blue

# Install dependencies for each application
$applications = @(
    @{Path="mf-shell"; Name="Shell"},
    @{Path="mf-product-list"; Name="Product List"},
    @{Path="mf-product-detail"; Name="Product Detail"},
    @{Path="mf-cart-svelte"; Name="Cart Svelte"}
)

foreach ($app in $applications) {
    Set-Location $app.Path
    if (!(Test-Path "node_modules")) {
        Write-Host "Installing $($app.Name) dependencies..." -ForegroundColor Yellow
        npm install
    }
    Set-Location ..
}

Write-Host ""
Write-Host "🚀 Starting applications..." -ForegroundColor Green

# Start applications
Write-Host "Starting Product List (port 4001)..." -ForegroundColor Blue
Set-Location "mf-product-list"
$productList = Start-Process "npm" -ArgumentList "start" -PassThru -WindowStyle Hidden
Set-Location ".."

Start-Sleep -Seconds 2

Write-Host "Starting Product Detail (port 4002)..." -ForegroundColor Blue  
Set-Location "mf-product-detail"
$productDetail = Start-Process "npm" -ArgumentList "start" -PassThru -WindowStyle Hidden
Set-Location ".."

Start-Sleep -Seconds 2

Write-Host "Starting Cart Svelte (port 4003)..." -ForegroundColor Blue
Set-Location "mf-cart-svelte"  
$cartSvelte = Start-Process "npm" -ArgumentList "run", "dev" -PassThru -WindowStyle Hidden
Set-Location ".."

Start-Sleep -Seconds 2

Write-Host "Starting Shell (port 4000)..." -ForegroundColor Blue
Set-Location "mf-shell"
$shell = Start-Process "npm" -ArgumentList "start" -PassThru -WindowStyle Hidden
Set-Location ".."

Write-Host ""
Write-Host "✅ All applications started!" -ForegroundColor Green
Write-Host "📱 URLs:" -ForegroundColor Cyan
Write-Host "   🏪 Shell:          http://localhost:4000" -ForegroundColor White
Write-Host "   📦 Product List:   http://localhost:4001" -ForegroundColor White
Write-Host "   📄 Product Detail: http://localhost:4002" -ForegroundColor White
Write-Host "   🛒 Cart (Svelte):  http://localhost:4003" -ForegroundColor White
Write-Host ""
Write-Host "🔧 Test Module Federation: file:///$PWD/test-cart-module.html" -ForegroundColor Magenta
Write-Host ""
Write-Host "⏱️  Waiting 10 seconds for all services to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host ""
Write-Host "🌐 Opening browser tabs..." -ForegroundColor Blue
Start-Process "http://localhost:4000"
Start-Process "http://localhost:4003"

Write-Host ""
Write-Host "🛑 Press Ctrl+C to stop all applications" -ForegroundColor Red

# Wait and cleanup on exit
try {
    while ($true) {
        Start-Sleep -Seconds 1
    }
} finally {
    Write-Host ""
    Write-Host "🛑 Stopping all applications..." -ForegroundColor Red
    
    $processes = @($productList, $productDetail, $cartSvelte, $shell)
    foreach ($proc in $processes) {
        if ($proc -and !$proc.HasExited) {
            try {
                $proc.Kill()
                $proc.WaitForExit(5000)
            } catch {
                Write-Host "Warning: Could not stop process $($proc.Id)" -ForegroundColor Yellow
            }
        }
    }
    
    Write-Host "✅ All applications stopped" -ForegroundColor Green
}
