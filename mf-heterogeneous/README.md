# Heterogeneous Microfrontend Architecture

This project demonstrates a **heterogeneous microfrontend architecture** that combines React and Svelte components using Module Federation. Unlike the homogeneous architecture which uses only React, this setup showcases true framework diversity.

## Architecture Overview

```
mf-heterogeneous/
├── mf-shell-react/          # React Host Application (Port 4000)
├── mf-product-list-react/   # React Remote - Product Listing (Port 4001)
├── mf-product-detail-svelte/# Svelte Remote - Product Details (Port 4002)
└── mf-cart-react/          # React Remote - Shopping Cart (Port 4003)
```

## Framework Integration

### React Host Shell (Port 4000)

- **Framework**: React 19.1.0 with React Router
- **Purpose**: Main application shell that orchestrates all remotes
- **Technology**: CRACO + Module Federation + TailwindCSS
- **Features**:
  - Navigation between different microfrontends
  - Lazy loading of all remote components
  - Shared React context across React remotes

### React Product List Remote (Port 4001)

- **Framework**: React 19.1.0
- **Purpose**: Display product catalog with add-to-cart functionality
- **Technology**: CRACO + Module Federation + TailwindCSS
- **Integration**: Seamlessly integrated with React shell
- **Communication**: Uses custom events and localStorage for cart state

### Svelte Product Detail Remote (Port 4002)

- **Framework**: Svelte 3.44.0
- **Purpose**: Detailed product view with enhanced interactivity
- **Technology**: Webpack + Module Federation + Custom CSS
- **Integration**: React wrapper component bridges Svelte into React ecosystem
- **Unique Features**:
  - Native Svelte reactivity and animations
  - Custom styling independent of TailwindCSS
  - Demonstrates cross-framework communication

### React Cart Remote (Port 4003)

- **Framework**: React 19.1.0
- **Purpose**: Shopping cart management with full CRUD operations
- **Technology**: CRACO + Module Federation + TailwindCSS
- **Features**:
  - Real-time cart updates from all remotes
  - Quantity management and item removal
  - Checkout simulation

## Key Technical Achievements

### 1. Cross-Framework Module Federation

- **React ↔ React**: Direct module sharing with singleton React instances
- **React ↔ Svelte**: React wrapper components that mount/unmount Svelte instances
- **Shared Dependencies**: React and ReactDOM shared as singletons across all React components

### 2. State Management Across Frameworks

- **localStorage**: Persistent cart state
- **Custom Events**: Cross-framework communication via `cartUpdated` events
- **Event Listeners**: Both React (useEffect) and Svelte (onMount) listen for cart updates

### 3. Unified Development Experience

- **Consistent Build Tools**: Webpack Module Federation across all remotes
- **Port Management**: Dedicated ports (4000-4003) for each service
- **Hot Reloading**: Development-time updates for both frameworks

### 4. Styling Approaches

- **React Components**: TailwindCSS for utility-first styling
- **Svelte Component**: Custom CSS with scoped styles
- **No Style Conflicts**: Framework isolation prevents CSS bleeding

## Running the Application

### Prerequisites

```bash
# Install dependencies for all microfrontends
cd mf-shell-react && npm install
cd ../mf-product-list-react && npm install
cd ../mf-product-detail-svelte && npm install
cd ../mf-cart-react && npm install
```

### Development Mode

```bash
# Terminal 1 - Shell (React Host)
cd mf-shell-react
npm start  # Runs on http://localhost:4000

# Terminal 2 - Product List (React Remote)
cd mf-product-list-react
npm start  # Runs on http://localhost:4001

# Terminal 3 - Product Detail (Svelte Remote)
cd mf-product-detail-svelte
npm start  # Runs on http://localhost:4002

# Terminal 4 - Cart (React Remote)
cd mf-cart-react
npm start  # Runs on http://localhost:4003
```

### Accessing the Application

- **Main Application**: http://localhost:4000
- **Individual Remotes** (for development/testing):
  - Product List: http://localhost:4001
  - Product Detail: http://localhost:4002
  - Cart: http://localhost:4003

## Cross-Framework Integration Details

### React-to-Svelte Integration

The Svelte remote exposes a React wrapper component that:

1. **Mounts Svelte Component**: Uses `new SvelteComponent()` to create instances
2. **Props Bridge**: Maps React props to Svelte component props
3. **Lifecycle Management**: Properly destroys Svelte instances on unmount
4. **Event Integration**: Bridges Svelte events to React event system

### Shared Utilities

All components share the same cart utility functions:

- Cross-framework localStorage management
- Custom event dispatching for real-time updates
- Consistent API across React and Svelte

## Benefits of Heterogeneous Architecture

### 1. **Framework Freedom**

- Teams can choose optimal frameworks for specific features
- Legacy code integration without full rewrites
- Performance optimization through framework-specific strengths

### 2. **Independent Deployments**

- Each microfrontend can be deployed independently
- Different release cycles for different teams
- Reduced blast radius for changes

### 3. **Technology Evolution**

- Gradual migration between frameworks
- Experimentation with new technologies
- Future-proofing application architecture

### 4. **Team Autonomy**

- Frontend teams can specialize in preferred frameworks
- Reduced learning curve for domain experts
- Parallel development workflows

## Comparison with Homogeneous Architecture

| Aspect          | Homogeneous (React-only)   | Heterogeneous (React + Svelte)   |
| --------------- | -------------------------- | -------------------------------- |
| **Complexity**  | Lower setup complexity     | Higher integration complexity    |
| **Bundle Size** | Smaller (single framework) | Larger (multiple frameworks)     |
| **Team Skills** | Single framework expertise | Multi-framework knowledge needed |
| **Performance** | Optimized for React        | Framework-specific optimizations |
| **Innovation**  | Limited to React ecosystem | Best-of-breed solutions          |
| **Migration**   | Lock-in to React           | Gradual migration paths          |

## Production Considerations

### 1. **Performance**

- Multiple framework runtimes increase bundle size
- Consider lazy loading strategies
- Monitor Core Web Vitals across frameworks

### 2. **Testing**

- Framework-specific testing strategies
- Integration testing across framework boundaries
- E2E testing for cross-framework workflows

### 3. **Monitoring**

- Error tracking across different framework stacks
- Performance monitoring for each remote
- User experience consistency metrics

### 4. **Security**

- CORS configuration for cross-origin remotes
- Content Security Policy for multiple sources
- Dependency vulnerability scanning across frameworks

This heterogeneous architecture demonstrates the flexibility and power of Module Federation for building truly polyglot frontend applications while maintaining a cohesive user experience.
