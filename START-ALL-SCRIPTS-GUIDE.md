# 🚀 Complete Start-All Scripts Guide

## 📋 **Available Start Scripts**

### **✅ Monolithic Architecture**

```powershell
# Location: ./monolith/
# Port: 5000
# Command: npm start (with PORT=5000)

# Start script:
cd monolith
.\start-all.ps1
# OR
.\start-all.bat
# OR manually:
set PORT=5000 && npm start
```

### **✅ Homogeneous Microfrontends (All React)**

```powershell
# Location: ./mf-homogeneous/
# Ports: 3000-3003
# Commands: npm start (all apps)

# Start script:
cd mf-homogeneous
.\start-all.ps1

# Manual startup order:
# 1. cd mf-product-list && npm start    # Port 3001
# 2. cd mf-product-detail && npm start  # Port 3002
# 3. cd mf-cart && npm start           # Port 3003
# 4. cd mf-shell && npm start          # Port 3000
```

### **✅ Heterogeneous Microfrontends (React + Svelte)**

```powershell
# Location: ./mf-heterogeneous/
# Ports: 4000-4003
# Commands: npm start (React), npm run dev (Svelte)

# Start script:
cd mf-heterogeneous
.\start-all.ps1

# Manual startup order:
# 1. cd mf-product-list && npm start     # Port 4001 (React)
# 2. cd mf-product-detail && npm start   # Port 4002 (React)
# 3. cd mf-cart-svelte && npm run dev    # Port 4003 (Svelte)
# 4. cd mf-shell && npm start           # Port 4000 (React)
```

---

## 🎯 **Complete Testing Workflow**

### **PHASE 1: Build Performance Testing**

```powershell
# This works regardless of running apps
.\performance-compare.ps1 -BuildAll
```

### **PHASE 2: Runtime Performance Testing**

#### **Step 1: Test Monolithic**

```powershell
# Start monolith
cd monolith
.\start-all.ps1
# Verify URLs are working:
# ✅ http://localhost:5000 (Monolith App)

# Test performance (new terminal)
cd ..
.\performance-compare.ps1 -LighthouseTest -Runs 3

# Stop: Ctrl+C in monolith terminal
```

#### **Step 2: Test Homogeneous**

```powershell
# Start all React microfrontends
cd mf-homogeneous
.\start-all.ps1
# Wait for all 4 apps to show "webpack compiled successfully"

# Verify URLs are working:
# ✅ http://localhost:3000 (Shell)
# ✅ http://localhost:3001 (ProductList)
# ✅ http://localhost:3002 (ProductDetail)
# ✅ http://localhost:3003 (Cart)

# Test performance (new terminal)
cd ..
.\performance-compare.ps1 -LighthouseTest -Runs 3

# Stop: Close all PowerShell windows or Ctrl+C in each
```

#### **Step 3: Test Heterogeneous**

```powershell
# Start all React + Svelte microfrontends
cd mf-heterogeneous
.\start-all.ps1
# Wait for all 4 apps to compile

# Verify URLs are working:
# ✅ http://localhost:4000 (Shell)
# ✅ http://localhost:4001 (ProductList)
# ✅ http://localhost:4002 (ProductDetail)
# ✅ http://localhost:4003 (Svelte Cart)

# Test performance (new terminal)
cd ..
.\performance-compare.ps1 -LighthouseTest -Runs 3

# Stop: Close all PowerShell windows or Ctrl+C in each
```

---

## 🔧 **Port Configuration Summary**

| Architecture      | Shell | ProductList | ProductDetail | Cart | Framework      |
| ----------------- | ----- | ----------- | ------------- | ---- | -------------- |
| **Monolithic**    | 5000  | -           | -             | -    | React          |
| **Homogeneous**   | 3000  | 3001        | 3002          | 3003 | All React      |
| **Heterogeneous** | 4000  | 4001        | 4002          | 4003 | React + Svelte |

---

## ⚡ **Quick Commands Reference**

### **Full Automated Testing**

```powershell
# Complete workflow
.\performance-compare.ps1 -BuildAll

# Then for each architecture:
cd monolith && .\start-all.ps1
# New terminal: .\performance-compare.ps1 -LighthouseTest

cd ..\mf-homogeneous && .\start-all.ps1
# New terminal: .\performance-compare.ps1 -LighthouseTest

cd ..\mf-heterogeneous && .\start-all.ps1
# New terminal: .\performance-compare.ps1 -LighthouseTest
```

### **High Accuracy Testing**

```powershell
# More runs for statistical significance
.\performance-compare.ps1 -LighthouseTest -Runs 5
```

### **Individual Architecture Testing**

```powershell
# Test only specific architecture
cd mf-heterogeneous && .\start-all.ps1
.\performance-compare.ps1 -LighthouseTest -Runs 3
```

---

## 🎓 **Thesis Testing Strategy**

### **1. Build Performance Comparison**

- Individual component build times
- Total build time per architecture
- Framework-specific build efficiency

### **2. Runtime Performance Analysis**

- Complete system performance under load
- Resource usage with all services running
- Real-world user experience simulation

### **3. Scalability Assessment**

- Single app vs multiple apps resource usage
- Network overhead of distributed architecture
- Memory footprint comparison

### **4. Framework Impact Study**

- React vs Svelte performance differences
- Module Federation overhead analysis
- Cross-framework communication costs

---

## ⚠️ **Important Notes**

### **Development vs Production**

- **Homogeneous**: Uses `npm start` (development mode)
- **Heterogeneous**: Uses `npm start` (development) + `npm run dev` (Svelte)
- **Monolithic**: Uses `npm start` (development mode)

### **Startup Order Matters**

1. **Start remotes first** (ProductList, ProductDetail, Cart)
2. **Start shell last** (needs remotes to be available)
3. **Wait for compilation** before testing

### **Port Conflicts**

- **Homogeneous** and **Monolithic** both use port 3000 for shell
- **Cannot run simultaneously** without port conflicts
- **Test one architecture at a time**

**🎯 Summary: Use the start-all.ps1 scripts for each architecture, then run performance testing with the enhanced script that automatically detects the correct ports!**
