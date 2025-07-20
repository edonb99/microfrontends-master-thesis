# Heterogeneous Microfrontend Architecture

## Overview

This project demonstrates a **heterogeneous microfrontend architecture** using Webpack Module Federation, combining React and Svelte applications in a single federated system.

## Architecture Components

### 🏠 Host Application (React)

- **Location**: `mf-heterogeneous/mf-shell/`
- **Port**: 4000
- **Framework**: React 19 with CRACO
- **Purpose**: Main shell application that federates and orchestrates all remote components

### 🔗 Remote Applications

#### 1. Product List Remote (React)

- **Location**: `mf-heterogeneous/mf-product-list/`
- **Port**: 4001
- **Framework**: React 19 with CRACO
- **Exposes**: `ProductList` component
- **Route**: `/` (home page)

#### 2. Product Detail Remote (React)

- **Location**: `mf-heterogeneous/mf-product-detail/`
- **Port**: 4002
- **Framework**: React 19 with CRACO
- **Exposes**: `ProductDetail` component
- **Route**: `/product/:id`

#### 3. Cart Remote (Svelte) 🎯

- **Location**: `mf-heterogeneous/mf-cart-svelte/`
- **Port**: 4003
- **Framework**: Svelte 3.59.1 with Webpack
- **Exposes**: `Cart` component
- **Route**: `/cart`
- **Special**: Cross-framework federation (Svelte → React)

## Key Technical Features

### Cross-Framework Module Federation

- React host successfully consumes Svelte remote components
- Webpack Module Federation bridges React and Svelte applications
- Shared state management via localStorage for cart functionality

### Technology Stack

- **React**: 19.x with CRACO for webpack customization
- **Svelte**: 3.59.1 (optimized for webpack compatibility)
- **Webpack**: Module Federation Plugin for component sharing
- **TailwindCSS**: 3.4.1 unified styling across all frameworks
- **PostCSS**: CSS processing pipeline
- **React Router**: Client-side routing in the shell

### Component Integration Pattern

```javascript
// React Shell consuming Svelte Cart
const SvelteCartComponent = () => {
  const containerRef = React.useRef(null);
  const componentRef = React.useRef(null);

  React.useEffect(() => {
    const loadSvelteCart = async () => {
      const SvelteCartModule = await import("cart/Cart");
      const SvelteCart = SvelteCartModule.default || SvelteCartModule;

      componentRef.current = new SvelteCart({
        target: containerRef.current,
      });
    };

    loadSvelteCart();

    return () => {
      componentRef.current?.$destroy();
    };
  }, []);

  return <div ref={containerRef} className="w-full" />;
};
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation & Running

```bash
cd mf-heterogeneous

# Install dependencies for all apps
npm install  # in each subdirectory

# Start all applications (Windows PowerShell)
.\start-all.ps1

# OR Windows Command Prompt
start-all.bat

# OR Unix/Linux/macOS
./start-all.sh
```

### Application URLs

- **Shell (Main App)**: http://localhost:4000
- **Product List Remote**: http://localhost:4001
- **Product Detail Remote**: http://localhost:4002
- **Cart Remote (Svelte)**: http://localhost:4003

## Module Federation Configuration

### Shell (Host) Configuration

```javascript
// mf-shell/craco.config.js
new ModuleFederationPlugin({
  name: "shell",
  remotes: {
    product_list: "product_list@http://localhost:4001/remoteEntry.js",
    product_detail: "product_detail@http://localhost:4002/remoteEntry.js",
    cart: "cart@http://localhost:4003/remoteEntry.js", // Svelte remote!
  },
}),
```

### Svelte Cart Remote Configuration

```javascript
// mf-cart-svelte/webpack.config.js
new ModuleFederationPlugin({
  name: "cart",
  filename: "remoteEntry.js",
  exposes: {
    "./Cart": "./src/Cart.svelte",
  },
}),
```

## State Management

- **Shared State**: localStorage for cart data
- **Cross-Component Communication**: Storage events and polling
- **Framework Agnostic**: Works seamlessly between React and Svelte

## Development Notes

### Svelte 3 + Webpack Compatibility

- Downgraded from Svelte 5 to 3.59.1 for better webpack toolchain compatibility
- Uses `svelte-loader` for webpack integration
- Custom webpack configuration replaces Vite for Module Federation support

### TailwindCSS Integration

- Shared TailwindCSS 3.4.1 configuration across all frameworks
- PostCSS pipeline ensures consistent styling
- Framework-specific CSS processing (JSX for React, Svelte preprocessor)

## Architecture Benefits

1. **Framework Flexibility**: Mix React and Svelte in the same application
2. **Independent Development**: Teams can work on different frameworks
3. **Incremental Migration**: Gradually migrate from one framework to another
4. **Technology Choice**: Use the right tool for each specific component
5. **Shared Resources**: Common utilities, state, and styling systems

## Production Considerations

- **Bundle Size**: Each framework adds overhead, monitor carefully
- **Runtime Performance**: Cross-framework communication has slight overhead
- **Dependency Management**: Avoid version conflicts between frameworks
- **Testing Strategy**: Component and integration tests across framework boundaries
- **Deployment**: Coordinate releases of federated applications

## Comparison with Homogeneous Architecture

| Feature           | Homogeneous (React-only) | Heterogeneous (React + Svelte)       |
| ----------------- | ------------------------ | ------------------------------------ |
| Complexity        | Lower                    | Higher                               |
| Framework Choice  | Limited to React         | React + Svelte flexibility           |
| Bundle Size       | Smaller                  | Larger (multiple frameworks)         |
| Team Skills       | React expertise          | Multi-framework expertise            |
| Migration Path    | React-to-React           | Cross-framework migration            |
| Development Speed | Faster                   | Slower (framework context switching) |

This heterogeneous architecture demonstrates the power and flexibility of Module Federation for building truly framework-agnostic microfrontend systems.
