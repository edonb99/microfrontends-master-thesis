# Performance Comparison Script
# Script për krahasimin e performancës mes arkitekturave

param(
  [switch]$BuildAll,
  [switch]$LighthouseTest,
  [int]$Runs = 3
)

# === Helpers: compression & health check ===
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
  param([Parameter(Mandatory)][string]$Url,[int]$Retries=12,[int]$DelayMs=500)
  for($i=1;$i -le $Retries; $i++){
    try {
      $r = Invoke-WebRequest -Uri $Url -TimeoutSec 3
      if ($r.StatusCode -in 200,204,301,302) { return $true }
    } catch {}
    Start-Sleep -Milliseconds $DelayMs
  }
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

function Test-AllPortsRunning {
  param([int[]]$Ports, [string]$Architecture)
  Write-Host "🔍 Checking required ports for $Architecture..." -ForegroundColor Yellow
  $allRunning = $true
  foreach ($port in $Ports) {
    $isRunning = Test-PortAvailable -Port $port
    if ($isRunning) {
      Write-Host "   ✅ Port $port is running" -ForegroundColor Green
    } else {
      Write-Host "   ❌ Port $port is NOT running" -ForegroundColor Red
      $allRunning = $false
    }
  }
  return $allRunning
}

function Test-LighthousePerformance {
  param([string]$Architecture,[string]$URL,[int]$Runs=3)
  try { lighthouse --version | Out-Null } catch {
    Write-Host "❌ Install Lighthouse: npm i -g lighthouse" -ForegroundColor Red
    return
  }

  $perf=@(); $fcp=@(); $lcp=@(); $tti=@(); $tbt=@(); $cls=@(); $inp=@(); $si=@()

  # Warm-up (ignored) to stabilize first-run variance
  $warm = "$Architecture-lh-warmup.json"
  cmd /c "lighthouse `"$URL`" --preset=desktop --throttling-method=simulate --output=json --output-path=`"$warm`" --chrome-flags=`"--headless --disable-gpu`"" | Out-Null
  Remove-Item $warm -ErrorAction SilentlyContinue

  for($i=1; $i -le $Runs; $i++){
    $out = "$Architecture-lh-$i.json"
    cmd /c "lighthouse `"$URL`" --preset=desktop --throttling-method=simulate --output=json --output-path=`"$out`" --chrome-flags=`"--headless --disable-gpu`"" | Out-Null
    $r = Get-Content $out | ConvertFrom-Json

    $perf += [math]::Round($r.categories.performance.score*100,0)
    $fcp  += $r.audits.'first-contentful-paint'.numericValue
    $lcp  += $r.audits.'largest-contentful-paint'.numericValue
    $tti  += $r.audits.'interactive'.numericValue
    $tbt  += $r.audits.'total-blocking-time'.numericValue
    $si   += $r.audits.'speed-index'.numericValue
    $cls  += $r.audits.'cumulative-layout-shift'.numericValue
    $inp  += $r.audits.'interaction-to-next-paint'.numericValue
  }

  if (-not $results.ContainsKey($Architecture)) { $results[$Architecture]=@{} }
  $results[$Architecture].Lighthouse = @{
    Performance   = [int](Get-Median $perf)
    FCPms         = [int](Get-Median $fcp)
    LCPms         = [int](Get-Median $lcp)
    TTIms         = [int](Get-Median $tti)
    TBTms         = [int](Get-Median $tbt)
    SpeedIndexms  = if ($si.Count)  { [int](Get-Median $si) }  else { $null }
    INPms         = if ($inp.Count) { [int](Get-Median $inp) } else { $null }
    CLS           = if ($cls.Count) { [math]::Round((Get-Median $cls),3) } else { $null }
    Runs          = $Runs
  }
}

Write-Host "🎓 Master Thesis Performance Analysis" -ForegroundColor Cyan
Write-Host "Edon Budakova - UP FIEK 2025" -ForegroundColor Yellow
Write-Host ""

$results = @{}

function Measure-BuildTime {
  param(
    [string]$Architecture,
    [string]$Path,
    [string]$BuildCommand = "npm run build"
  )

  Write-Host "⏱️  Measuring build time for: $Architecture" -ForegroundColor Blue

  if (Test-Path $Path) {
    Push-Location $Path

    # Clean previous build
    if (Test-Path "build") { Remove-Item -Recurse -Force "build" }
    if (Test-Path "dist")  { Remove-Item -Recurse -Force "dist" }

    # Measure build time
    $buildTime = Measure-Command { Invoke-Expression $BuildCommand 2>&1 | Out-Null }

    $results[$Architecture] = @{
      BuildTime   = $buildTime.TotalSeconds
      BuildExists = (Test-Path "build") -or (Test-Path "dist")
    }

    # Measure bundle size if build exists
    if ($results[$Architecture].BuildExists) {
      $buildDir = if (Test-Path "build") { "build" } else { "dist" }
      $bundleSize = (Get-ChildItem -Recurse $buildDir | Measure-Object -Property Length -Sum).Sum / 1MB
      $results[$Architecture].BundleSize = [math]::Round($bundleSize, 2)

      # JS total (gzip)
      $jsFiles = Get-ChildItem -Recurse $buildDir -Include *.js -File
      $gzipTotal = 0
      foreach ($f in $jsFiles) { $gzipTotal += Get-GzipSizeMB $f.FullName }
      $results[$Architecture].JS_Gzip_MB = [math]::Round($gzipTotal, 3)

      Write-Host "   🗜️  JS (gzip): $($results[$Architecture].JS_Gzip_MB) MB" -ForegroundColor Cyan
    }

    Pop-Location

    Write-Host "✅ $Architecture - Build Time: $([math]::Round($buildTime.TotalSeconds, 2))s" -ForegroundColor Green
    if ($results[$Architecture].BundleSize) {
      Write-Host "📦 Bundle Size: $($results[$Architecture].BundleSize) MB" -ForegroundColor Cyan
    }
  } else {
    Write-Host "❌ Path not found: $Path" -ForegroundColor Red
  }
  Write-Host ""
}

function Add-MFTotal {
  param([Parameter(Mandatory)][string]$Label,[string[]]$Keys)
  $parts = @()
  foreach($k in $Keys){ if($results.ContainsKey($k)) { $parts += $results[$k] } }
  if($parts.Count -gt 0){
    $results[$Label] = @{
      BuildTime  = ($parts | Where-Object { $_.BuildTime }  | Measure-Object -Property BuildTime  -Sum).Sum
      BundleSize = ($parts | Where-Object { $_.BundleSize } | Measure-Object -Property BundleSize -Sum).Sum
      JS_Gzip_MB = ($parts | Where-Object { $_.JS_Gzip_MB } | Measure-Object -Property JS_Gzip_MB -Sum).Sum
    }
  }
}

# Build all architectures if requested
if ($BuildAll) {
  Write-Host "🏗️  Building all architectures..." -ForegroundColor Magenta
  Write-Host ""

  # Monolithic Architecture
  Measure-BuildTime -Architecture "Monolith" -Path ".\monolith"

  # Homogeneous Microfrontends (All React)
  Write-Host "🏠 Building Homogeneous Microfrontends (All React)..." -ForegroundColor Blue
  Measure-BuildTime -Architecture "Homogeneous-Shell"         -Path ".\mf-homogeneous\mf-shell"
  Measure-BuildTime -Architecture "Homogeneous-ProductList"   -Path ".\mf-homogeneous\mf-product-list"
  Measure-BuildTime -Architecture "Homogeneous-ProductDetail" -Path ".\mf-homogeneous\mf-product-detail"
  Measure-BuildTime -Architecture "Homogeneous-Cart"          -Path ".\mf-homogeneous\mf-cart"

  # Heterogeneous Microfrontends (React + Svelte)
  Write-Host "🌈 Building Heterogeneous Microfrontends (React + Svelte)..." -ForegroundColor Magenta
  Measure-BuildTime -Architecture "Heterogeneous-Shell"        -Path ".\mf-heterogeneous\mf-shell"
  Measure-BuildTime -Architecture "Heterogeneous-ProductList"  -Path ".\mf-heterogeneous\mf-product-list"
  Measure-BuildTime -Architecture "Heterogeneous-ProductDetail"-Path ".\mf-heterogeneous\mf-product-detail"
  Measure-BuildTime -Architecture "Heterogeneous-SvelteCart"   -Path ".\mf-heterogeneous\mf-cart-svelte"

  Add-MFTotal -Label "Homogeneous (Total)" -Keys @(
    "Homogeneous-Shell","Homogeneous-ProductList","Homogeneous-ProductDetail","Homogeneous-Cart"
  )
  Add-MFTotal -Label "Heterogeneous (Total)" -Keys @(
    "Heterogeneous-Shell","Heterogeneous-ProductList","Heterogeneous-ProductDetail","Heterogeneous-SvelteCart"
  )
}

# Run Lighthouse tests if requested
if ($LighthouseTest) {
  Write-Host "🚀 Running Lighthouse Performance Tests..." -ForegroundColor Magenta
  Write-Host "⚠️  Make sure all applications are running before proceeding!" -ForegroundColor Yellow
  Write-Host ""

  # Architecture-specific URLs and port checking
  $architectures = @{
    "Monolith" = @{
      URL = "http://localhost:5000"
      RequiredPorts = @(5000)
      Description = "Monolithic React App"
      StartCommand = "cd monolith && .\start-all.ps1"
    }
    "Homogeneous" = @{
      URL = "http://localhost:3000"  # Shell port for homogeneous
      RequiredPorts = @(3000,3001,3002,3003)
      Description = "All React Microfrontends (Shell + 3 Remotes)"
      StartCommand = "cd mf-homogeneous && .\start-all.ps1"
    }
    "Heterogeneous" = @{
      URL = "http://localhost:4000"  # Shell port for heterogeneous
      RequiredPorts = @(4000,4001,4002,4003)
      Description = "React + Svelte Microfrontends (Shell + 3 Remotes)"
      StartCommand = "cd mf-heterogeneous && .\start-all.ps1"
    }
  }

  Write-Host "📋 Required Applications:" -ForegroundColor Cyan
  foreach ($arch in $architectures.Keys) {
    $config = $architectures[$arch]
    Write-Host "   ${arch}: $($config.Description)" -ForegroundColor Gray
    Write-Host "     Shell: $($config.URL)" -ForegroundColor Gray
    Write-Host "     Required ports: $($config.RequiredPorts -join ', ')" -ForegroundColor Gray
    Write-Host "     Start command: $($config.StartCommand)" -ForegroundColor Yellow
    Write-Host ""
  }

  $continue = Read-Host "Are all required applications running? (y/n)"
  if ($continue -eq "y" -or $continue -eq "Y") {
    Write-Host "🔄 Running $Runs test runs for each architecture..." -ForegroundColor Yellow
    Write-Host ""

    foreach ($arch in $architectures.Keys) {
      $config = $architectures[$arch]

      # Check if all required ports are running
      $portsOk = Test-AllPortsRunning -Ports $config.RequiredPorts -Architecture $arch

      if ($portsOk) {
        if (-not (Wait-UntilHealthy -Url $config.URL -Retries 12 -DelayMs 500)) {
          Write-Host "⏳ $arch shell at $($config.URL) isn't healthy yet (no HTTP 200/204/301/302). Skipping." -ForegroundColor Yellow
        } else {
          Write-Host "🧪 Testing $arch at $($config.URL)..." -ForegroundColor Blue
          Test-LighthousePerformance -Architecture $arch -URL $config.URL -Runs $Runs
        }
      } else {
        Write-Host "⚠️  Skipping $arch - not all required applications are running!" -ForegroundColor Yellow
        Write-Host "   Please start all microfrontends for $arch first." -ForegroundColor Gray
      }
      Write-Host ""
    }
  }
}

# Display final comparison + Export
if ($results.Count -gt 0) {
  Write-Host "📊 FINAL PERFORMANCE COMPARISON" -ForegroundColor Magenta
  Write-Host "=================================" -ForegroundColor Magenta
  Write-Host ""

  foreach ($arch in $results.Keys) {
    Write-Host "🏗️  ${arch}:" -ForegroundColor Cyan

    if ($results[$arch].BuildTime) {
      Write-Host "   ⏱️  Build Time: $($results[$arch].BuildTime)s"
    }
    if ($results[$arch].BundleSize) {
      Write-Host "   📦 Bundle Size: $($results[$arch].BundleSize) MB"
    }
    if ($results[$arch].JS_Gzip_MB) {
      Write-Host "   🗜️  JS (gzip): $($results[$arch].JS_Gzip_MB) MB"
    }

    if ($results[$arch].Lighthouse) {
      $perf = $results[$arch].Lighthouse
      Write-Host "   🎯 Performance Score: $($perf.Performance)/100 (median of $($perf.Runs) runs)" -ForegroundColor Green
      Write-Host "   ⚡ First Contentful Paint: $($perf.FCPms)ms" -ForegroundColor Cyan
      Write-Host "   🖼️  Largest Contentful Paint: $($perf.LCPms)ms" -ForegroundColor Cyan
      Write-Host "   🎮 Time to Interactive: $($perf.TTIms)ms" -ForegroundColor Cyan
      Write-Host "   🔄 Total Blocking Time: $($perf.TBTms)ms" -ForegroundColor Yellow
      if ($perf.SpeedIndexms) { Write-Host "   🧭 Speed Index: $($perf.SpeedIndexms)ms" -ForegroundColor Cyan }
      if ($perf.INPms)        { Write-Host "   🫰 INP: $($perf.INPms)ms" -ForegroundColor Cyan }
      if ($perf.CLS -ne $null){ Write-Host "   🧱 CLS: $($perf.CLS)" -ForegroundColor Cyan }
    }
    Write-Host ""
  }

  # Export results to JSON/CSV for thesis analysis
  $timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
  $resultsJson = $results | ConvertTo-Json -Depth 3
  $jsonFile = "performance-results-$timestamp.json"
  $resultsJson | Out-File -FilePath $jsonFile -Encoding UTF8

  $csvData = @()
  foreach ($arch in $results.Keys) {
    $data = $results[$arch]
    $csvRow = [PSCustomObject]@{
      Architecture      = $arch
      BuildTime_Seconds = if ($data.BuildTime) { [math]::Round($data.BuildTime, 2) } else { "N/A" }
      BundleSize_MB     = if ($data.BundleSize) { $data.BundleSize } else { "N/A" }
      JS_Gzip_MB        = if ($data.JS_Gzip_MB) { $data.JS_Gzip_MB } else { "N/A" }
      Performance_Score = if ($data.Lighthouse) { $data.Lighthouse.Performance } else { "N/A" }
      FCP_ms            = if ($data.Lighthouse) { $data.Lighthouse.FCPms } else { "N/A" }
      LCP_ms            = if ($data.Lighthouse) { $data.Lighthouse.LCPms } else { "N/A" }
      TTI_ms            = if ($data.Lighthouse) { $data.Lighthouse.TTIms } else { "N/A" }
      TBT_ms            = if ($data.Lighthouse) { $data.Lighthouse.TBTms } else { "N/A" }
      SpeedIndex_ms     = if ($data.Lighthouse) { $data.Lighthouse.SpeedIndexms } else { "N/A" }
      INP_ms            = if ($data.Lighthouse) { $data.Lighthouse.INPms } else { "N/A" }
      CLS               = if ($data.Lighthouse) { $data.Lighthouse.CLS } else { "N/A" }
      TestRuns          = if ($data.Lighthouse) { $data.Lighthouse.Runs } else { "N/A" }
      TestTimestamp     = $timestamp
    }
    $csvData += $csvRow
  }
  $csvFile = "performance-summary-$timestamp.csv"
  $csvData | Export-Csv -Path $csvFile -NoTypeInformation

  Write-Host "💾 Results saved to:" -ForegroundColor Green
  Write-Host "   📊 JSON: $jsonFile" -ForegroundColor Cyan
  Write-Host "   📈 CSV: $csvFile" -ForegroundColor Cyan
  Write-Host "📊 Use this data for your thesis analysis!" -ForegroundColor Yellow
}

Write-Host "🎓 Performance analysis complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📚 Usage examples:" -ForegroundColor Cyan
Write-Host "   .\performance-compare.ps1 -BuildAll" -ForegroundColor Gray
Write-Host "   .\performance-compare.ps1 -LighthouseTest" -ForegroundColor Gray
Write-Host "   .\performance-compare.ps1 -LighthouseTest -Runs 5" -ForegroundColor Gray
Write-Host "   .\performance-compare.ps1 -BuildAll -LighthouseTest" -ForegroundColor Gray
Write-Host "   .\performance-compare.ps1 -BuildAll -LighthouseTest -Runs 3" -ForegroundColor Gray
