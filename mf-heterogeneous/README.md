# Heterogeneous Microfrontends Architecture

This project demonstrates a **heterogeneous microfrontend architecture** using:

- **React (Host)** + **2 React Remotes** + **1 Svelte Remote**
- **Webpack Module Federation** for React apps
- **Vite Module Federation Plugin** for Svelte app
- **TailwindCSS** for consistent styling across all frameworks

## 🏗️ Architecture Overview

### Applications:

1. **mf-shell** (React Host) - Port 4000

   - Routes and orchestrates all microfrontends
   - Uses React Router for navigation

2. **mf-product-list** (React Remote) - Port 4001

   - Displays product catalog with cart functionality
   - Exposes: `./ProductList` component

3. **mf-product-detail** (React Remote) - Port 4002

   - Shows individual product details
   - Exposes: `./ProductDetail` component

4. **mf-cart-svelte** (Svelte Remote) - Port 4003
   - Shopping cart built with Svelte
   - Exposes: `./Cart` component

### Shared Features:

- **Cart State**: Synchronized via localStorage across all apps
- **API Integration**: Fake Store API with fallback mock data
- **Consistent UI**: TailwindCSS styling in all frameworks
- **Error Handling**: Graceful fallbacks and error boundaries

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation & Setup

1. Install dependencies for all apps:

   ```bash
   # React Shell
   cd mf-shell && npm install

   # React Product List
   cd ../mf-product-list && npm install

   # React Product Detail
   cd ../mf-product-detail && npm install

   # Svelte Cart
   cd ../mf-cart-svelte && npm install
   ```

2. Start all applications:

   **Windows (PowerShell):**

   ```powershell
   .\start-all.ps1
   ```

   **Windows (Command Prompt):**

   ```cmd
   start-all.bat
   ```

   **Linux/Mac:**

   ```bash
   chmod +x start-all.sh
   ./start-all.sh
   ```

### Manual Startup

If you prefer to start apps individually:

```bash
# Terminal 1 - Shell (Host)
cd mf-shell && npm start

# Terminal 2 - Product List
cd mf-product-list && npm start

# Terminal 3 - Product Detail
cd mf-product-detail && npm start

# Terminal 4 - Cart (Svelte)
cd mf-cart-svelte && npm run dev
```

## 🌐 Application URLs

- **Main Application**: http://localhost:4000
- **Product List Standalone**: http://localhost:4001
- **Product Detail Standalone**: http://localhost:4002
- **Cart Standalone**: http://localhost:4003

## 🔧 Technical Stack

### React Apps (Shell, Product List, Product Detail):

- **React 19**
- **React Router DOM**
- **CRACO** (for Webpack customization)
- **Webpack Module Federation**
- **TailwindCSS**
- **PostCSS & Autoprefixer**

### Svelte App (Cart):

- **Svelte**
- **Vite**
- **@originjs/vite-plugin-federation**
- **TailwindCSS**
- **PostCSS & Autoprefixer**

## 📁 Project Structure

```
mf-heterogeneous/
├── mf-shell/                 # React Host App
├── mf-product-list/          # React Remote - Product Catalog
├── mf-product-detail/        # React Remote - Product Details
├── mf-cart-svelte/           # Svelte Remote - Shopping Cart
├── start-all.bat            # Windows batch startup script
├── start-all.ps1            # PowerShell startup script
├── start-all.sh             # Linux/Mac bash startup script
└── README.md                # This file
```

## 🔍 Key Features Demonstrated

### Module Federation Configuration:

- **Host App**: Consumes remotes from different frameworks
- **React Remotes**: Standard Webpack Module Federation
- **Svelte Remote**: Vite-based federation with framework bridge

### Cross-Framework Communication:

- **Shared State**: Cart data via localStorage
- **Event System**: Custom events for state synchronization
- **Framework Agnostic**: Components work regardless of host framework

### Development Experience:

- **Hot Reloading**: All apps support live reload
- **Standalone Testing**: Each app can run independently
- **Mock Data**: Fallback data for development without API

## 🎯 Comparison with Homogeneous Setup

| Feature              | Homogeneous (All React) | Heterogeneous (React + Svelte) |
| -------------------- | ----------------------- | ------------------------------ |
| **Complexity**       | Lower                   | Higher                         |
| **Bundle Size**      | Shared dependencies     | Framework-specific bundles     |
| **Development**      | Single toolchain        | Multiple toolchains            |
| **Team Flexibility** | React expertise only    | Multi-framework teams          |
| **Innovation**       | Framework-locked        | Best-tool-for-job approach     |

## 🚨 Known Limitations

1. **Bundle Size**: Multiple framework runtimes increase overall size
2. **Complexity**: More complex build and deployment pipeline
3. **State Management**: Cross-framework state sharing requires custom solutions
4. **Testing**: Framework-specific testing strategies needed

## 🎉 Success Criteria

✅ **Multi-Framework Integration**: React + Svelte working together  
✅ **Shared Functionality**: Cart state synchronized across all apps  
✅ **Independent Development**: Each team can use preferred framework  
✅ **Production Ready**: Build and deployment pipeline configured  
✅ **Developer Experience**: Hot reloading and standalone testing
