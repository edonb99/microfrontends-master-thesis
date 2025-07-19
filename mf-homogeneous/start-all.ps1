Write-Host "Starting all microfrontends..."

# Start remote microfrontends first
Write-Host "Starting Product List (port 3001)..."
Start-Process -FilePath "powershell" -ArgumentList "-Command", "cd 'c:\Users\e.budakova\LocalFiles\microfrontends-master-thesis\mf-homogeneous\mf-product-list'; npm start"

Write-Host "Starting Product Detail (port 3002)..."
Start-Process -FilePath "powershell" -ArgumentList "-Command", "cd 'c:\Users\e.budakova\LocalFiles\microfrontends-master-thesis\mf-homogeneous\mf-product-detail'; npm start"

Write-Host "Starting Cart (port 3003)..."
Start-Process -FilePath "powershell" -ArgumentList "-Command", "cd 'c:\Users\e.budakova\LocalFiles\microfrontends-master-thesis\mf-homogeneous\mf-cart'; npm start"

Write-Host "Waiting for remotes to start..."
Start-Sleep -Seconds 15

Write-Host "Starting Shell (port 3000)..."
Start-Process -FilePath "powershell" -ArgumentList "-Command", "cd 'c:\Users\e.budakova\LocalFiles\microfrontends-master-thesis\mf-homogeneous\mf-shell'; npm start"

Write-Host "All microfrontends started!"
Write-Host "Check the following URLs:"
Write-Host "- Shell: http://localhost:3000"
Write-Host "- Product List: http://localhost:3001"
Write-Host "- Product Detail: http://localhost:3002"
Write-Host "- Cart: http://localhost:3003"
