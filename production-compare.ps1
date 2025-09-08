# Production Performance Analysis Script
# Script për krahasimin e performancës së build-ave të produksionit

param(
  [switch]$BuildAll,
  [switch]$TestPerformance,
  [switch]$StartServers,
  [switch]$StopServers,
  [int]$Runs = 3
)

# === Helpers ===
try { Add-Type -AssemblyName 'System.IO.Compression' } catch {}

function Get-GzipSizeMB {
  param([Parameter(Mandatory)][string]$FilePath)
  $in   = [System.IO.File]::OpenRead($FilePath)
  $out  = New-Object System.IO.MemoryStream
  $gzip = New-Object System.IO.Compression.GzipStream($out,[System.IO.Compression.CompressionMode]::Compress)
  $in.CopyTo($gzip)
  $gzip.Dispose(); $in.Dispose()
  return [math]::Round(($out.Length/1MB),3)
}

function Wait-UntilHealthy {
  param([Parameter(Mandatory)][string]$Url,[int]$Retries=20,[int]$DelayMs=1000)
  Write-Host "   🔍 Checking health of $Url..." -ForegroundColor Gray
  for($i=1; $i -le $Retries; $i++){
    try {
      $r = Invoke-WebRequest -Uri $Url -TimeoutSec 5
      if ($r.StatusCode -in 200,204,301,302) { 
        Write-Host "   ✅ $Url is healthy" -ForegroundColor Green
        return $true 
      }
    } catch {
      Write-Host "   ⏳ Attempt $i/$Retries - waiting..." -ForegroundColor Yellow
    }
    Start-Sleep -Milliseconds $DelayMs
  }
  Write-Host "   ❌ $Url failed to respond after $Retries attempts" -ForegroundColor Red
  return $false
}

function Get-Median([double[]]$arr) {
  $sorted = $arr | Sort-Object
  $n = $sorted.Count
  if ($n -eq 0) { return $null }
  if ($n % 2 -eq 1) { return [double]$sorted[[math]::Floor($n/2)] }
  else { return ([double]($sorted[$n/2-1] + $sorted[$n/2]) / 2.0) }
}

function Test-PortAvailable {
  param([int]$Port)
  try {
    $connection = Test-NetConnection -ComputerName "localhost" -Port $Port -WarningAction SilentlyContinue
    return $connection.TcpTestSucceeded
  } catch {
    return $false
  }
}

function Stop-ProductionServers {
  Write-Host "🛑 Stopping all production servers..." -ForegroundColor Red
  
  $portsToCheck = @(5000, 3000, 3001, 3002, 3003, 4000, 4001, 4002, 4003)
  
  foreach ($port in $portsToCheck) {
    if (Test-PortAvailable -Port $port) {
      Write-Host "   🔍 Finding process on port $port..." -ForegroundColor Yellow
      try {
        $process = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | 
                   Select-Object -First 1 | 
                   ForEach-Object { Get-Process -Id $_.OwningProcess -ErrorAction SilentlyContinue }
        
        if ($process) {
          Write-Host "   ❌ Stopping process $($process.ProcessName) (PID: $($process.Id)) on port $port" -ForegroundColor Red
          Stop-Process -Id $process.Id -Force
          Write-Host "   ✅ Port $port freed" -ForegroundColor Green
        }
      } catch {
        Write-Host "   ⚠️  Could not stop process on port $port" -ForegroundColor Yellow
      }
    } else {
      Write-Host "   ✅ Port $port already free" -ForegroundColor Green
    }
  }
  
  Write-Host "🆗 All production servers stopped!" -ForegroundColor Green
  Write-Host ""
}

Write-Host "🏭 Production Performance Analysis" -ForegroundColor Magenta
Write-Host "Edon Budakova - UP FIEK 2025" -ForegroundColor Yellow
Write-Host "====================================" -ForegroundColor Magenta
Write-Host ""

$results = @{}

function Measure-ProductionBuild {
  param(
    [string]$Architecture,
    [string]$Path, 
    [string]$BuildCommand = "npm run build"
  )

  Write-Host "🏗️  Building $Architecture for production..." -ForegroundColor Blue

  if (Test-Path $Path) {
    Push-Location $Path

    # Clean previous builds
    if (Test-Path "build") { Remove-Item -Recurse -Force "build" }
    if (Test-Path "dist")  { Remove-Item -Recurse -Force "dist" }

    Write-Host "   🧹 Cleaned previous builds" -ForegroundColor Gray
    Write-Host "   ⚡ Running: $BuildCommand" -ForegroundColor Gray

    # Measure build time
    $buildTime = Measure-Command { 
      Invoke-Expression $BuildCommand 2>&1 | Out-Host 
    }

    $buildDir = if (Test-Path "build") { "build" } elseif (Test-Path "dist") { "dist" } else { $null }
    
    $results[$Architecture] = @{
      BuildTime   = [math]::Round($buildTime.TotalSeconds, 2)
      BuildExists = $buildDir -ne $null
      BuildDir    = $buildDir
    }

    if ($results[$Architecture].BuildExists) {
      # Bundle size analysis
      $totalSize = (Get-ChildItem -Recurse $buildDir | Measure-Object -Property Length -Sum).Sum / 1MB
      $results[$Architecture].BundleSize_MB = [math]::Round($totalSize, 2)

      # JS files analysis (gzipped)
      $jsFiles = Get-ChildItem -Recurse $buildDir -Include *.js -File
      $jsTotal = 0
      $jsGzipTotal = 0
      foreach ($f in $jsFiles) { 
        $jsTotal += $f.Length
        $jsGzipTotal += Get-GzipSizeMB $f.FullName 
      }
      $results[$Architecture].JS_Raw_MB = [math]::Round($jsTotal / 1MB, 3)
      $results[$Architecture].JS_Gzip_MB = [math]::Round($jsGzipTotal, 3)

      # CSS files analysis
      $cssFiles = Get-ChildItem -Recurse $buildDir -Include *.css -File
      if ($cssFiles) {
        $cssTotal = ($cssFiles | Measure-Object -Property Length -Sum).Sum / 1MB
        $results[$Architecture].CSS_MB = [math]::Round($cssTotal, 3)
      }

      # Static assets
      $staticFiles = Get-ChildItem -Recurse $buildDir -Exclude *.js,*.css,*.html,*.map -File
      if ($staticFiles) {
        $staticTotal = ($staticFiles | Measure-Object -Property Length -Sum).Sum / 1MB
        $results[$Architecture].Static_MB = [math]::Round($staticTotal, 3)
      }

      Write-Host "   ✅ Build successful!" -ForegroundColor Green
      Write-Host "   📦 Total bundle: $($results[$Architecture].BundleSize_MB) MB" -ForegroundColor Cyan
      Write-Host "   🟨 JS (raw): $($results[$Architecture].JS_Raw_MB) MB" -ForegroundColor Cyan
      Write-Host "   🗜️  JS (gzip): $($results[$Architecture].JS_Gzip_MB) MB" -ForegroundColor Cyan
      if ($results[$Architecture].CSS_MB) {
        Write-Host "   🎨 CSS: $($results[$Architecture].CSS_MB) MB" -ForegroundColor Cyan
      }
    } else {
      Write-Host "   ❌ Build failed or no output directory found" -ForegroundColor Red
    }

    Pop-Location
    Write-Host "   ⏱️  Build time: $($results[$Architecture].BuildTime)s" -ForegroundColor Yellow
  } else {
    Write-Host "   ❌ Path not found: $Path" -ForegroundColor Red
  }
  Write-Host ""
}

function Start-ProductionServers {
  Write-Host "🚀 Starting Production Servers..." -ForegroundColor Magenta
  Write-Host ""
  
  # Check if serve is installed
  try { 
    serve --version | Out-Null 
  } catch {
    Write-Host "📦 Installing 'serve' package globally..." -ForegroundColor Yellow
    npm install -g serve
    Write-Host ""
  }

  # Stop any existing servers first
  Stop-ProductionServers

  $serverJobs = @()

  # Start Monolithic production server
  if (Test-Path ".\monolith\build") {
    Write-Host "🏛️  Starting Monolithic server (port 5000)..." -ForegroundColor Green
    $job = Start-Job -ScriptBlock {
      param($buildPath)
      Set-Location $buildPath
      serve -s build -l 5000
    } -ArgumentList (Resolve-Path ".\monolith")
    $serverJobs += @{ Name = "Monolith"; Job = $job; Port = 5000; URL = "http://localhost:5000" }
  }

  # Start Homogeneous production servers (order matters: remotes first, then shell)
  $homogeneousApps = @(
    @{ Name = "Homogeneous-ProductList"; Path = ".\mf-homogeneous\mf-product-list"; Port = 3001 },
    @{ Name = "Homogeneous-ProductDetail"; Path = ".\mf-homogeneous\mf-product-detail"; Port = 3002 },
    @{ Name = "Homogeneous-Cart"; Path = ".\mf-homogeneous\mf-cart"; Port = 3003 },
    @{ Name = "Homogeneous-Shell"; Path = ".\mf-homogeneous\mf-shell"; Port = 3000 }
  )
  
  Write-Host "🏠 Starting Homogeneous servers..." -ForegroundColor Blue
  foreach ($app in $homogeneousApps) {
    if (Test-Path "$($app.Path)\build") {
      Write-Host "   🔗 Starting $($app.Name) on port $($app.Port)..." -ForegroundColor Gray
      $job = Start-Job -ScriptBlock {
        param($buildPath, $port)
        Set-Location $buildPath
        serve -s build -l $port
      } -ArgumentList (Resolve-Path $app.Path), $app.Port
      $serverJobs += @{ Name = $app.Name; Job = $job; Port = $app.Port; URL = "http://localhost:$($app.Port)" }
      
      # Wait a bit between starting remotes and shell
      if ($app.Name -eq "Homogeneous-Cart") {
        Write-Host "   ⏳ Waiting 3s for remotes to stabilize before starting shell..." -ForegroundColor Yellow
        Start-Sleep -Seconds 3
      }
    } else {
      Write-Host "   ⚠️  Build not found for $($app.Name)" -ForegroundColor Yellow
    }
  }

  # Start Heterogeneous production servers  
  $heterogeneousApps = @(
    @{ Name = "Heterogeneous-ProductList"; Path = ".\mf-heterogeneous\mf-product-list"; Port = 4001; BuildDir = "build" },
    @{ Name = "Heterogeneous-ProductDetail"; Path = ".\mf-heterogeneous\mf-product-detail"; Port = 4002; BuildDir = "build" },
    @{ Name = "Heterogeneous-SvelteCart"; Path = ".\mf-heterogeneous\mf-cart-svelte"; Port = 4003; BuildDir = "dist" },
    @{ Name = "Heterogeneous-Shell"; Path = ".\mf-heterogeneous\mf-shell"; Port = 4000; BuildDir = "build" }
  )
  
  Write-Host "🌈 Starting Heterogeneous servers..." -ForegroundColor Magenta
  foreach ($app in $heterogeneousApps) {
    if (Test-Path "$($app.Path)\$($app.BuildDir)") {
      Write-Host "   🔗 Starting $($app.Name) on port $($app.Port) ($($app.BuildDir))..." -ForegroundColor Gray
      $job = Start-Job -ScriptBlock {
        param($buildPath, $port, $buildDir)
        Set-Location $buildPath
        serve -s $buildDir -l $port
      } -ArgumentList (Resolve-Path $app.Path), $app.Port, $app.BuildDir
      $serverJobs += @{ Name = $app.Name; Job = $job; Port = $app.Port; URL = "http://localhost:$($app.Port)" }
      
      # Wait before starting shell
      if ($app.Name -eq "Heterogeneous-SvelteCart") {
        Write-Host "   ⏳ Waiting 3s for remotes to stabilize before starting shell..." -ForegroundColor Yellow
        Start-Sleep -Seconds 3
      }
    } else {
      Write-Host "   ⚠️  Build not found for $($app.Name) at $($app.Path)\$($app.BuildDir)" -ForegroundColor Yellow
    }
  }

  Write-Host ""
  Write-Host "✅ Production servers started!" -ForegroundColor Green
  Write-Host "📋 Active servers:" -ForegroundColor Cyan
  foreach ($server in $serverJobs) {
    Write-Host "   🌐 $($server.Name): $($server.URL)" -ForegroundColor Gray
  }
  Write-Host ""
  Write-Host "⏳ Waiting 5 seconds for all servers to fully initialize..." -ForegroundColor Yellow
  Start-Sleep -Seconds 5
  
  return $serverJobs
}

function Test-ProductionPerformance {
  param([string]$Architecture, [string]$URL, [int]$Runs=3)
  
  try { 
    lighthouse --version | Out-Null 
  } catch {
    Write-Host "❌ Install Lighthouse: npm i -g lighthouse" -ForegroundColor Red
    return
  }

  Write-Host "🧪 Testing $Architecture at $URL..." -ForegroundColor Blue
  
  # Check if URL is healthy first
  if (-not (Wait-UntilHealthy -Url $URL)) {
    Write-Host "❌ Skipping $Architecture - server not responding" -ForegroundColor Red
    return
  }

  $perf=@(); $fcp=@(); $lcp=@(); $tti=@(); $tbt=@(); $cls=@(); $inp=@(); $si=@()

  # Warm-up test (ignored)
  Write-Host "   🔥 Warm-up test..." -ForegroundColor Gray
  $warm = "$Architecture-prod-warmup.json"
  cmd /c "lighthouse `"$URL`" --preset=desktop --throttling-method=simulate --output=json --output-path=`"$warm`" --chrome-flags=`"--headless --disable-gpu`"" 2>&1 | Out-Null
  Remove-Item $warm -ErrorAction SilentlyContinue

  # Actual tests
  for($i=1; $i -le $Runs; $i++){
    Write-Host "   📊 Test run $i/$Runs..." -ForegroundColor Gray
    $out = "$Architecture-prod-$i.json"
    cmd /c "lighthouse `"$URL`" --preset=desktop --throttling-method=simulate --output=json --output-path=`"$out`" --chrome-flags=`"--headless --disable-gpu`"" 2>&1 | Out-Null
    
    if (Test-Path $out) {
      $r = Get-Content $out | ConvertFrom-Json

      $perf += [math]::Round($r.categories.performance.score*100,0)
      $fcp  += $r.audits.'first-contentful-paint'.numericValue
      $lcp  += $r.audits.'largest-contentful-paint'.numericValue
      $tti  += $r.audits.'interactive'.numericValue
      $tbt  += $r.audits.'total-blocking-time'.numericValue
      $si   += $r.audits.'speed-index'.numericValue
      $cls  += $r.audits.'cumulative-layout-shift'.numericValue
      $inp  += $r.audits.'interaction-to-next-paint'.numericValue
      
      # Clean up test file
      Remove-Item $out -ErrorAction SilentlyContinue
    } else {
      Write-Host "   ⚠️  Test $i failed" -ForegroundColor Yellow
    }
  }

  if (-not $results.ContainsKey($Architecture)) { $results[$Architecture]=@{} }
  $results[$Architecture].Production_Lighthouse = @{
    Performance   = [int](Get-Median $perf)
    FCPms         = [int](Get-Median $fcp)
    LCPms         = [int](Get-Median $lcp)
    TTIms         = [int](Get-Median $tti)
    TBTms         = [int](Get-Median $tbt)
    SpeedIndexms  = if ($si.Count)  { [int](Get-Median $si) }  else { $null }
    INPms         = if ($inp.Count) { [int](Get-Median $inp) } else { $null }
    CLS           = if ($cls.Count) { [math]::Round((Get-Median $cls),3) } else { $null }
    Runs          = $Runs
    TestedURL     = $URL
  }
  
  Write-Host "   ✅ $Architecture testing complete!" -ForegroundColor Green
}

# === Main Script Logic ===

if ($StopServers) {
  Stop-ProductionServers
  exit
}

if ($BuildAll) {
  Write-Host "🏗️  Building all architectures for production..." -ForegroundColor Magenta
  Write-Host ""

  # Monolithic
  Measure-ProductionBuild -Architecture "Monolith" -Path ".\monolith"

  # Homogeneous (All React)
  Write-Host "🏠 Building Homogeneous Microfrontends..." -ForegroundColor Blue
  Measure-ProductionBuild -Architecture "Homogeneous-Shell"         -Path ".\mf-homogeneous\mf-shell"
  Measure-ProductionBuild -Architecture "Homogeneous-ProductList"   -Path ".\mf-homogeneous\mf-product-list"
  Measure-ProductionBuild -Architecture "Homogeneous-ProductDetail" -Path ".\mf-homogeneous\mf-product-detail"
  Measure-ProductionBuild -Architecture "Homogeneous-Cart"          -Path ".\mf-homogeneous\mf-cart"

  # Heterogeneous (React + Svelte)
  Write-Host "🌈 Building Heterogeneous Microfrontends..." -ForegroundColor Magenta
  Measure-ProductionBuild -Architecture "Heterogeneous-Shell"        -Path ".\mf-heterogeneous\mf-shell"
  Measure-ProductionBuild -Architecture "Heterogeneous-ProductList"  -Path ".\mf-heterogeneous\mf-product-list"
  Measure-ProductionBuild -Architecture "Heterogeneous-ProductDetail"-Path ".\mf-heterogeneous\mf-product-detail"
  Measure-ProductionBuild -Architecture "Heterogeneous-SvelteCart"   -Path ".\mf-heterogeneous\mf-cart-svelte"

  # Calculate totals
  $homogeneousKeys = @("Homogeneous-Shell","Homogeneous-ProductList","Homogeneous-ProductDetail","Homogeneous-Cart")
  $heterogeneousKeys = @("Heterogeneous-Shell","Heterogeneous-ProductList","Heterogeneous-ProductDetail","Heterogeneous-SvelteCart")
  
  # Homogeneous totals
  $homogeneousTotal = @{
    BuildTime = ($homogeneousKeys | ForEach-Object { if($results.ContainsKey($_)) { $results[$_].BuildTime } else { 0 } } | Measure-Object -Sum).Sum
    BundleSize_MB = ($homogeneousKeys | ForEach-Object { if($results.ContainsKey($_)) { $results[$_].BundleSize_MB } else { 0 } } | Measure-Object -Sum).Sum
    JS_Gzip_MB = ($homogeneousKeys | ForEach-Object { if($results.ContainsKey($_)) { $results[$_].JS_Gzip_MB } else { 0 } } | Measure-Object -Sum).Sum
  }
  $results["Homogeneous-Total"] = $homogeneousTotal

  # Heterogeneous totals
  $heterogeneousTotal = @{
    BuildTime = ($heterogeneousKeys | ForEach-Object { if($results.ContainsKey($_)) { $results[$_].BuildTime } else { 0 } } | Measure-Object -Sum).Sum
    BundleSize_MB = ($heterogeneousKeys | ForEach-Object { if($results.ContainsKey($_)) { $results[$_].BundleSize_MB } else { 0 } } | Measure-Object -Sum).Sum
    JS_Gzip_MB = ($heterogeneousKeys | ForEach-Object { if($results.ContainsKey($_)) { $results[$_].JS_Gzip_MB } else { 0 } } | Measure-Object -Sum).Sum
  }
  $results["Heterogeneous-Total"] = $heterogeneousTotal
}

if ($StartServers) {
  $serverJobs = Start-ProductionServers
}

if ($TestPerformance) {
  Write-Host "🏭 Running Production Performance Tests..." -ForegroundColor Magenta
  Write-Host ""

  # Start servers if not already started
  if (-not $StartServers) {
    Write-Host "⚠️  Starting production servers first..." -ForegroundColor Yellow
    $serverJobs = Start-ProductionServers
  }

  # Test architectures
  $testConfigs = @(
    @{ Name = "Monolith"; URL = "http://localhost:5000"; Ports = @(5000) },
    @{ Name = "Homogeneous"; URL = "http://localhost:3000"; Ports = @(3000,3001,3002,3003) },
    @{ Name = "Heterogeneous"; URL = "http://localhost:4000"; Ports = @(4000,4001,4002,4003) }
  )

  foreach ($config in $testConfigs) {
    $allPortsRunning = $true
    foreach ($port in $config.Ports) {
      if (-not (Test-PortAvailable -Port $port)) {
        Write-Host "❌ Port $port not available for $($config.Name)" -ForegroundColor Red
        $allPortsRunning = $false
      }
    }
    
    if ($allPortsRunning) {
      Test-ProductionPerformance -Architecture $config.Name -URL $config.URL -Runs $Runs
    } else {
      Write-Host "⚠️  Skipping $($config.Name) - not all required ports are running" -ForegroundColor Yellow
    }
    Write-Host ""
  }
}

# Display results
if ($results.Count -gt 0) {
  Write-Host "📊 PRODUCTION PERFORMANCE RESULTS" -ForegroundColor Magenta
  Write-Host "==================================" -ForegroundColor Magenta
  Write-Host ""

  foreach ($arch in $results.Keys) {
    Write-Host "🏗️  ${arch}:" -ForegroundColor Cyan

    if ($results[$arch].BuildTime) {
      Write-Host "   ⏱️  Build Time: $($results[$arch].BuildTime)s" -ForegroundColor Yellow
    }
    if ($results[$arch].BundleSize_MB) {
      Write-Host "   📦 Bundle Size: $($results[$arch].BundleSize_MB) MB" -ForegroundColor Cyan
    }
    if ($results[$arch].JS_Gzip_MB) {
      Write-Host "   🗜️  JS (gzip): $($results[$arch].JS_Gzip_MB) MB" -ForegroundColor Cyan
    }
    if ($results[$arch].CSS_MB) {
      Write-Host "   🎨 CSS: $($results[$arch].CSS_MB) MB" -ForegroundColor Cyan
    }

    if ($results[$arch].Production_Lighthouse) {
      $perf = $results[$arch].Production_Lighthouse
      Write-Host "   🎯 Performance Score: $($perf.Performance)/100 (median of $($perf.Runs) runs)" -ForegroundColor Green
      Write-Host "   ⚡ First Contentful Paint: $($perf.FCPms)ms" -ForegroundColor Green
      Write-Host "   🖼️  Largest Contentful Paint: $($perf.LCPms)ms" -ForegroundColor Green
      Write-Host "   🎮 Time to Interactive: $($perf.TTIms)ms" -ForegroundColor Green
      Write-Host "   🔄 Total Blocking Time: $($perf.TBTms)ms" -ForegroundColor Yellow
      if ($perf.SpeedIndexms) { Write-Host "   🧭 Speed Index: $($perf.SpeedIndexms)ms" -ForegroundColor Green }
      if ($perf.INPms)        { Write-Host "   🫰 INP: $($perf.INPms)ms" -ForegroundColor Green }
      if ($perf.CLS -ne $null){ Write-Host "   🧱 CLS: $($perf.CLS)" -ForegroundColor Green }
      Write-Host "   🌐 Tested URL: $($perf.TestedURL)" -ForegroundColor Gray
    }
    Write-Host ""
  }

  # Export results
  $timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
  $resultsJson = $results | ConvertTo-Json -Depth 4
  $jsonFile = "production-results-$timestamp.json"
  $resultsJson | Out-File -FilePath $jsonFile -Encoding UTF8

  $csvData = @()
  foreach ($arch in $results.Keys) {
    $data = $results[$arch]
    $csvRow = [PSCustomObject]@{
      Architecture        = $arch
      BuildTime_Seconds   = if ($data.BuildTime) { $data.BuildTime } else { "N/A" }
      BundleSize_MB      = if ($data.BundleSize_MB) { $data.BundleSize_MB } else { "N/A" }
      JS_Raw_MB          = if ($data.JS_Raw_MB) { $data.JS_Raw_MB } else { "N/A" }
      JS_Gzip_MB         = if ($data.JS_Gzip_MB) { $data.JS_Gzip_MB } else { "N/A" }
      CSS_MB             = if ($data.CSS_MB) { $data.CSS_MB } else { "N/A" }
      Performance_Score   = if ($data.Production_Lighthouse) { $data.Production_Lighthouse.Performance } else { "N/A" }
      FCP_ms             = if ($data.Production_Lighthouse) { $data.Production_Lighthouse.FCPms } else { "N/A" }
      LCP_ms             = if ($data.Production_Lighthouse) { $data.Production_Lighthouse.LCPms } else { "N/A" }
      TTI_ms             = if ($data.Production_Lighthouse) { $data.Production_Lighthouse.TTIms } else { "N/A" }
      TBT_ms             = if ($data.Production_Lighthouse) { $data.Production_Lighthouse.TBTms } else { "N/A" }
      SpeedIndex_ms      = if ($data.Production_Lighthouse) { $data.Production_Lighthouse.SpeedIndexms } else { "N/A" }
      INP_ms             = if ($data.Production_Lighthouse) { $data.Production_Lighthouse.INPms } else { "N/A" }
      CLS                = if ($data.Production_Lighthouse) { $data.Production_Lighthouse.CLS } else { "N/A" }
      TestRuns           = if ($data.Production_Lighthouse) { $data.Production_Lighthouse.Runs } else { "N/A" }
      TestTimestamp      = $timestamp
      TestType           = "Production"
    }
    $csvData += $csvRow
  }
  $csvFile = "production-summary-$timestamp.csv"
  $csvData | Export-Csv -Path $csvFile -NoTypeInformation

  Write-Host "💾 Production results saved to:" -ForegroundColor Green
  Write-Host "   📊 JSON: $jsonFile" -ForegroundColor Cyan
  Write-Host "   📈 CSV: $csvFile" -ForegroundColor Cyan
  Write-Host ""
}

Write-Host "🎓 Production analysis complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📚 Usage examples:" -ForegroundColor Cyan
Write-Host "   .\production-compare.ps1 -BuildAll" -ForegroundColor Gray
Write-Host "   .\production-compare.ps1 -StartServers" -ForegroundColor Gray
Write-Host "   .\production-compare.ps1 -TestPerformance" -ForegroundColor Gray
Write-Host "   .\production-compare.ps1 -BuildAll -StartServers -TestPerformance" -ForegroundColor Gray
Write-Host "   .\production-compare.ps1 -BuildAll -TestPerformance -Runs 5" -ForegroundColor Gray
Write-Host "   .\production-compare.ps1 -StopServers" -ForegroundColor Yellow
Write-Host ""
Write-Host "🔄 Full workflow:" -ForegroundColor Magenta
Write-Host "   1. .\production-compare.ps1 -BuildAll" -ForegroundColor Gray
Write-Host "   2. .\production-compare.ps1 -StartServers" -ForegroundColor Gray
Write-Host "   3. .\production-compare.ps1 -TestPerformance" -ForegroundColor Gray
Write-Host "   4. .\production-compare.ps1 -StopServers" -ForegroundColor Gray
