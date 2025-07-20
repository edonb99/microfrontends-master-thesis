# Microfrontends Master Thesis / Teza e Masterit për Mikrofrontendët

**Analiza e performancës dhe modularitetit të mikrofrontendëve heterogjenë krahasuar me arkitektura homogjene dhe monolitike**

_Performance and modularity analysis of heterogeneous microfrontends compared to homogeneous and monolithic architectures_

---

## 📚 Project Overview / Përmbledhje e Projektit

### Albanian / Shqip

Ky projekt është një studim i plotë i arkitekturave të ndryshme të zhvillimit të aplikacioneve web, duke analizuar tre qasje kryesore:

1. **Arkitektura Monolitike** - Aplikacion i vetëm i integruar
2. **Mikrofrontendë Homogjene** - Mikrofrontendë të gjitha me React
3. **Mikrofrontendë Heterogjenë** - Mikrofrontendë me teknologji të përziera (React + Svelte)

Projekti implementon një platformë e-commerce për të demonstruar dallimet në performancë, modularitet dhe kompleksitet të zhvillimit.

### English

This project is a comprehensive study of different web application development architectures, analyzing three main approaches:

1. **Monolithic Architecture** - Single integrated application
2. **Homogeneous Microfrontends** - All microfrontends using React
3. **Heterogeneous Microfrontends** - Mixed technology microfrontends (React + Svelte)

The project implements an e-commerce platform to demonstrate differences in performance, modularity, and development complexity.

---

## 🏗️ Project Structure / Struktura e Projektit

```
microfrontends-master-thesis/
├── monolith/                          # Arkitektura Monolitike
├── mf-homogeneous/                    # Mikrofrontendë Homogjene
├── mf-heterogeneous/                  # Mikrofrontendë Heterogjenë
├── HETEROGENEOUS_ARCHITECTURE.md      # Dokumentimi i arkitekturës heterogjenë
├── HETEROGENEOUS_IMPLEMENTATION_SUMMARY.md
└── README.md
```

---

## 🎯 1. Monolithic Architecture / Arkitektura Monolitike

### Albanian / Shqip

**Lokacioni:** `./monolith/`

Aplikacioni monolitik është implementuar si një aplikacion i vetëm React që përmban të gjitha funksionalitetet:

**Struktura:**

- `src/components/` - Komponentët kryesorë (ProductList, ProductDetail, Cart)
- `src/pages/` - Faqet e aplikacionit
- `src/utils/` - Utilitetat (cart management)
- `public/` - Resurset statike

**Karakteristikat:**

- ✅ Zhvillim i thjeshtë dhe i shpejtë
- ✅ Debugim më i lehtë
- ✅ Deployment i vetëm
- ❌ Skalabilitet i kufizuar
- ❌ Teknologji të kufizuara në një framework

### English

**Location:** `./monolith/`

The monolithic application is implemented as a single React application containing all functionalities:

**Structure:**

- `src/components/` - Core components (ProductList, ProductDetail, Cart)
- `src/pages/` - Application pages
- `src/utils/` - Utilities (cart management)
- `public/` - Static resources

**Characteristics:**

- ✅ Simple and fast development
- ✅ Easier debugging
- ✅ Single deployment
- ❌ Limited scalability
- ❌ Technology locked to one framework

---

## 🏠 2. Homogeneous Microfrontends / Mikrofrontendë Homogjene

### Albanian / Shqip

**Lokacioni:** `./mf-homogeneous/`

Arkitektura homogjene përdor Module Federation për të ndarë aplikacionin në mikrofrontendë të veçanta, të gjitha të implementuara në React.

### English

**Location:** `./mf-homogeneous/`

The homogeneous architecture uses Module Federation to split the application into separate microfrontends, all implemented in React.

### 📁 Detailed Structure / Struktura e Detajuar

#### 🚀 Shell Application / Aplikacioni Kryesor

**Path:** `./mf-homogeneous/mf-shell/`

```
mf-shell/
├── src/
│   ├── App.js                 # Main application with navigation
│   ├── bootstrap.js           # Module Federation bootstrap
│   └── index.js              # Entry point
├── webpack.config.js          # Module Federation configuration
├── package.json
└── public/
```

**Albanian:** Shell aplikacioni që orkestroj të gjithë mikrofrontendët. Përmban navigimin kryesor, branding-un e universitetit UP FIEK, dhe menaxhon gjendjen globale të cart-it.

**English:** Shell application that orchestrates all microfrontends. Contains main navigation, UP FIEK university branding, and manages global cart state.

#### 📦 Product List Microfrontend

**Path:** `./mf-homogeneous/mf-product-list/`

```
mf-product-list/
├── src/
│   ├── ProductList.jsx        # Main product listing component
│   ├── utils/cart.js         # Cart utility functions
│   ├── bootstrap.js
│   └── index.js
├── webpack.config.js          # Exposes ProductList component
└── package.json
```

**Features / Karakteristikat:**

- ✅ FakeStore API integration
- ✅ Modern card design with hover effects
- ✅ Real-time cart updates
- ✅ Responsive grid layout
- ✅ Star ratings display

#### 🔍 Product Detail Microfrontend

**Path:** `./mf-homogeneous/mf-product-detail/`

```
mf-product-detail/
├── src/
│   ├── ProductDetail.jsx      # Detailed product view
│   ├── utils/cart.js         # Cart utilities
│   ├── bootstrap.js
│   └── index.js
├── webpack.config.js          # Exposes ProductDetail component
└── package.json
```

**Features / Karakteristikat:**

- ✅ Individual product API fetching
- ✅ Enhanced product information display
- ✅ Interactive quantity controls
- ✅ Back navigation
- ✅ Loading and error states

#### 🛒 Cart Microfrontend

**Path:** `./mf-homogeneous/mf-cart/`

```
mf-cart/
├── src/
│   ├── Cart.jsx              # Shopping cart component
│   ├── utils/cart.js        # Shared cart logic
│   ├── bootstrap.js
│   └── index.js
├── webpack.config.js         # Exposes Cart component
└── package.json
```

**Features / Karakteristikat:**

- ✅ Professional cart interface
- ✅ Quantity management
- ✅ Clear cart functionality
- ✅ Checkout preparation
- ✅ Empty state handling

---

## 🌈 3. Heterogeneous Microfrontends / Mikrofrontendë Heterogjenë

### Albanian / Shqip

**Lokacioni:** `./mf-heterogeneous/`

Arkitektura më komplekse që kombinon teknologji të ndryshme - React për shell dhe shumicën e komponentëve, dhe Svelte për cart mikrofrontendin.

### English

**Location:** `./mf-heterogeneous/`

The most complex architecture combining different technologies - React for shell and most components, and Svelte for the cart microfrontend.

### 📁 Detailed Structure / Struktura e Detajuar

#### 🚀 React Shell Application

**Path:** `./mf-heterogeneous/mf-shell/`

**Albanian:** Shell aplikacioni React që menaxhon integrimin mes teknologjive të ndryshme. Përmban wrapper komponent për Svelte cart-in.

**English:** React shell application managing integration between different technologies. Contains wrapper component for the Svelte cart.

```javascript
// Svelte Cart Wrapper - Integration Challenge Solution
const SvelteCartWrapper = () => {
  const containerRef = React.useRef(null);
  const svelteInstance = React.useRef(null);

  React.useEffect(() => {
    const loadSvelteCart = async () => {
      try {
        const { default: SvelteCart } = await import("cart/Cart");
        if (containerRef.current && !svelteInstance.current) {
          svelteInstance.current = new SvelteCart({
            target: containerRef.current,
          });
        }
      } catch (error) {
        console.error("Failed to load Svelte cart:", error);
      }
    };
    loadSvelteCart();
    return () => {
      if (svelteInstance.current) {
        svelteInstance.current.$destroy();
        svelteInstance.current = null;
      }
    };
  }, []);

  return React.createElement("div", {
    ref: containerRef,
    className: "svelte-cart-container",
  });
};
```

#### 📦 React Product Microfrontends

**Paths:**

- `./mf-heterogeneous/mf-product-list/`
- `./mf-heterogeneous/mf-product-detail/`

Same structure and functionality as homogeneous version, but configured to work with mixed architecture.

#### 🛒 Svelte Cart Microfrontend - The Challenge

**Path:** `./mf-heterogeneous/mf-cart-svelte/`

```
mf-cart-svelte/
├── src/
│   ├── Cart.svelte           # Main Svelte component
│   ├── utils/cart.js        # Shared cart utilities
│   ├── bootstrap.js         # Module Federation bootstrap
│   ├── main.js             # Svelte entry point
│   └── CartExport.js       # Export wrapper for Module Federation
├── webpack.config.js        # Complex Svelte + Module Federation config
├── svelte.config.js        # Svelte configuration
├── package.json
└── public/
```

### 🔥 The Svelte Integration Challenge / Sfida e Integrimit të Svelte

#### Albanian / Shqip

**Problemet e hasura:**

1. **Module Federation me Svelte:** Module Federation është krijuar kryesisht për React. Integrimi i Svelte kërkoi konfiguracion të veçantë të webpack-it.

2. **Vite vs Webpack Konflikti:** Svelte punon më mirë me Vite, por Module Federation kërkonte webpack. Zgjidhja ishte përdorimi i webpack-it me konfiguracion të personalizuar.

3. **Component Lifecycle Management:** Svelte komponentët kanë lifecycle të ndryshëm nga React. Duhej krijuar wrapper që menaxhon mount/unmount në mënyrë korrekte.

4. **Bundle Size Optimization:** Svelte compiler-i krijon bundles të vogla, por Module Federation shtonte overhead shtesë.

#### English

**Challenges encountered:**

1. **Module Federation with Svelte:** Module Federation was primarily designed for React. Integrating Svelte required special webpack configuration.

2. **Vite vs Webpack Conflict:** Svelte works better with Vite, but Module Federation required webpack. Solution was using webpack with custom configuration.

3. **Component Lifecycle Management:** Svelte components have different lifecycle than React. Had to create wrapper that manages mount/unmount correctly.

4. **Bundle Size Optimization:** Svelte compiler creates small bundles, but Module Federation added additional overhead.

### 🔧 Technical Solutions / Zgjidhjet Teknike

#### Webpack Configuration for Svelte

```javascript
// webpack.config.js - Key configurations
module.exports = {
  mode: "development",
  resolve: {
    alias: {
      svelte: path.dirname(require.resolve("svelte/package.json")),
    },
    extensions: [".mjs", ".js", ".svelte"],
    mainFields: ["svelte", "browser", "module", "main"],
    conditionNames: ["svelte", "browser", "import"],
  },
  module: {
    rules: [
      {
        test: /\.svelte$/,
        use: {
          loader: "svelte-loader",
          options: {
            compilerOptions: {
              dev: true,
            },
            emitCss: false,
          },
        },
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "cart",
      filename: "remoteEntry.js",
      exposes: {
        "./Cart": "./src/CartExport.js",
      },
      shared: {
        // Minimal sharing to avoid conflicts
      },
    }),
  ],
};
```

#### CartExport.js - Bridge Component

```javascript
import Cart from "./Cart.svelte";

// Export Svelte component in Module Federation compatible way
export default Cart;
```

---

## 🎨 Design System & University Branding

### Albanian / Shqip

Të tre arkitekturat implementojnë një sistem dizajni të unifikuar me:

**Branding i Universitetit:**

- Logo dhe ngjyrat e UP (Universiteti i Prishtinës)
- Informata të FIEK (Fakulteti i Inxhinierisë Elektrike dhe Kompjuterike)
- Footer profesional me detaje të projektit

**Sistem Dizajni Modern (2025):**

- Dizajn minimalist me TailwindCSS
- Ngjyra të përbashkëta: Blue-700 primary, gray scale
- Komponenta responsive
- Micro-interactions dhe hover effects
- Accessibility të përmirësuar

### English

All three architectures implement a unified design system with:

**University Branding:**

- UP (University of Prishtina) logo and colors
- FIEK (Faculty of Electrical and Computer Engineering) information
- Professional footer with project details

**Modern Design System (2025):**

- Minimalist design with TailwindCSS
- Consistent colors: Blue-700 primary, gray scale
- Responsive components
- Micro-interactions and hover effects
- Improved accessibility

---

## 📊 Performance Comparison Framework / Korniza e Krahasimit të Performancës

### Metrics to Analyze / Metrikat për Analizim

#### 1. Load Performance / Performanca e Ngarkimit

- **Initial Bundle Size** - Madhësia e bundle-it fillestar
- **Time to First Contentful Paint (FCP)** - Koha deri në paint-in e parë
- **Time to Interactive (TTI)** - Koha deri të bëhet interactive
- **Largest Contentful Paint (LCP)** - Paint-i më i madh i përmbajtjes

#### 2. Runtime Performance / Performanca në Runtime

- **JavaScript execution time** - Koha e ekzekutimit të JavaScript-it
- **Memory usage** - Përdorimi i memories
- **Network requests efficiency** - Efikasiteti i kërkesave të rrjetit
- **Cache utilization** - Përdorimi i cache-it

#### 3. Developer Experience / Përvoja e Zhvilluesit

- **Build time** - Koha e ndërtimit
- **Development server startup** - Nisja e serverit të zhvillimit
- **Hot reload performance** - Performanca e hot reload-it
- **Bundle analysis** - Analiza e bundle-it

#### 4. Modularity & Maintainability / Modulariteti dhe Mirëmbajtja

- **Code splitting effectiveness** - Efikasiteti i ndarjes së kodit
- **Independent deployability** - Deployment-i i pavarur
- **Technology flexibility** - Fleksibiliteti teknologjik
- **Team scalability** - Skalabiliteti i ekipit

---

## 🚀 Getting Started / Si të Filloni

### Prerequisites / Parakushtet

```bash
Node.js >= 18
npm >= 8
```

### Running Monolithic Application / Ekzekutimi i Aplikacionit Monolitik

```bash
cd monolith
npm install
npm start
# Hapet në http://localhost:3000
```

### Running Homogeneous Microfrontends / Ekzekutimi i Mikrofrontendëve Homogjene

```bash
cd mf-homogeneous

# Windows
start-all.bat

# PowerShell
powershell -ExecutionPolicy Bypass -File start-all.ps1

# Linux/Mac
chmod +x start-all.sh
./start-all.sh
```

**Ports / Portet:**

- Shell: http://localhost:4000
- Product List: http://localhost:4001
- Product Detail: http://localhost:4002
- Cart: http://localhost:4003

### Running Heterogeneous Microfrontends / Ekzekutimi i Mikrofrontendëve Heterogjenë

```bash
cd mf-heterogeneous

# Windows
start-all.bat

# PowerShell
powershell -ExecutionPolicy Bypass -File start-all.ps1

# Linux/Mac
chmod +x start-all.sh
./start-all.sh
```

**Ports / Portet:**

- Shell: http://localhost:4000
- Product List: http://localhost:4001
- Product Detail: http://localhost:4002
- Svelte Cart: http://localhost:4003

---

## 🔧 Technical Stack / Stack-u Teknik

### Shared Technologies / Teknologjitë e Përbashkëta

- **API:** FakeStore API (https://fakestoreapi.com)
- **Styling:** TailwindCSS 3.4.1
- **State Management:** LocalStorage-based cart
- **Build Tools:** Webpack 5 with Module Federation
- **Package Manager:** npm

### Monolith Specific / Specifike për Monolitin

- **Framework:** React 19
- **Routing:** React Router DOM
- **Build:** Create React App (CRA)

### Homogeneous Specific / Specifike për Homogjene

- **Framework:** React 19 (all microfrontends)
- **Module Federation:** Webpack 5 ModuleFederationPlugin
- **Build:** Custom webpack configuration

### Heterogeneous Specific / Specifike për Heterogjenë

- **Shell & Remotes:** React 19
- **Cart:** Svelte 3.59.1
- **Integration:** Custom Svelte-React bridge
- **Build:** Mixed webpack configurations

---

## 📈 Expected Results / Rezultatet e Pritura

### Performance Predictions / Parashikimet e Performancës

#### 1. Bundle Size / Madhësia e Bundle-it

```
Monolith:     ~500KB (single bundle)
Homogeneous:  ~300KB + ~200KB chunks
Heterogeneous: ~250KB + ~180KB + ~50KB (Svelte cart)
```

#### 2. Load Time / Koha e Ngarkimit

```
Monolith:     Fastest initial, slower with growth
Homogeneous:  Medium initial, better caching
Heterogeneous: Slowest initial, best granular caching
```

#### 3. Development Experience / Përvoja e Zhvillimit

```
Monolith:     ⭐⭐⭐⭐⭐ (Simple)
Homogeneous:  ⭐⭐⭐⭐ (Medium complexity)
Heterogeneous: ⭐⭐⭐ (High complexity)
```

---

## 🎓 Academic Context / Konteksti Akademik

**Institution / Institucioni:** Universiteti i Prishtinës "Hasan Prishtina"  
**Faculty / Fakulteti:** FIEK - Fakulteti i Inxhinierisë Elektrike dhe Kompjuterike  
**Program / Programi:** Master në Inxhinieri Kompjuterike  
**Year / Viti:** 2025

**Thesis Objectives / Objektivat e Tezës:**

1. Analizimi i performancës së arkitekturave të ndryshme
2. Vlerësimi i modularitetit dhe skalabilitetit
3. Matja e kompleksitetit të zhvillimit
4. Rekomandime për përdorim praktik

---

## 🔍 Future Analysis / Analiza e Ardhshme

### Performance Testing Tools / Mjetet e Testimit të Performancës

- **Lighthouse** - Web performance metrics
- **WebPageTest** - Detailed loading analysis
- **Bundle Analyzer** - Bundle size analysis
- **Chrome DevTools** - Runtime performance
- **k6** - Load testing

### Metrics Collection / Mbledhja e Metrikave

- Automated performance testing scripts
- CI/CD integration for continuous monitoring
- Real user monitoring (RUM) setup
- Comparative analysis dashboards

---

## 📚 References / Referencat

1. **Module Federation Documentation** - Webpack 5 Module Federation
2. **Micro Frontends Pattern** - Martin Fowler's architecture patterns
3. **Svelte Documentation** - Official Svelte framework docs
4. **React Documentation** - Official React framework docs
5. **TailwindCSS Documentation** - Utility-first CSS framework
6. **Web Performance APIs** - Browser performance measurement APIs

---

## 🤝 Contributing / Kontributi

This project is part of a master's thesis research. For questions or contributions, please contact the author through the university.

Ky projekt është pjesë e një hulumtimi për tezën e masterit. Për pyetje apo kontribute, ju lutemi kontaktoni autorin përmes universitetit.

---

## 📄 License / Licenca

This project is created for academic purposes as part of a master's thesis at the University of Prishtina.

Ky projekt është krijuar për qëllime akademike si pjesë e tezës së masterit në Universitetin e Prishtinës.

---

**Author / Autori:** Edon Budakova
**Supervisor / Mentori:** Dhurata Ahmetaj
**University / Universiteti:** Universiteti i Prishtinës "Hasan Prishtina" - FIEK  
**Year / Viti:** 2025
