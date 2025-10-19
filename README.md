# Microfrontends master thesis · Teza e masterit për mikrofrontendët

**Analysis of the performance and modularity of heterogeneous microfrontends compared to homogeneous and monolithic architectures**  
**Analiza e performancës dhe modularitetit të mikrofrontendëve heterogjenë krahasuar me arkitektura homogjene dhe monolitike**

---

## Përmbledhje 

Ky repository përmban një studim të kontrolluar ku i njëjti SPA implementohet në tre stile arkitekturore për të mundësuar krahasim të drejtë dhe të riprodhues:

1. **Monolitike** (React)
2. **Microfrontends Homogjen** (React + Webpack Module Federation)
3. **Microfrontends Heterogjen** (React + Svelte, përmes Module Federation)

Rezultatet kryesore lidhen me **performancën web**, **modularitetin**, dhe **përvojën e zhvilluesit (DX)** nën procedura të standardizuara matjeje.

---

## Metodologjia (Përmbledhje)

- **Variabla e pavarur:** Stili arkitekturor. Domeni, UI dhe logjika mbahen **identike** në të tre prototipet.
- **Ekzekutime të shumta:** 3 ekzekutime për skenar; raportohet **mediana**.
- **Metrikat kryesore:**
  - **Performance Score** (0-100)
  - **FCP** (First Contentful Paint)
  - **LCP** (Largest Contentful Paint)
  - **TTI** (Time to Interactive)
  - **TBT** (Total Blocking Time)
  - **Speed Index**
  - **CLS** (Cumulative Layout Shift)
  - **INP** (Interaction to Next Paint)
  - Plus **build time** dhe **bundle size**

### Mjedisi i testimit 

- **OS:** Windows 11
- **Node.js:** 20.19.2
- **npm:** 10.8.2
- **Chrome:** 140
- **React:** 19.1.0
- **Svelte:** 3.59.1
- **Webpack:** 5.89.0
- **Tailwind CSS:** 3.4.1

> ** Shënim metodologjik:** CLS më i lartë rrjedh nga imazhe pa dimensione të fiksuara dhe mungesë skeleton-loaders; INP/TBT mund të jenë 0 në skenarë pa ndërveprim të përdoruesit.

---

## Ekzekutimi (Getting Started)

### **Kërkesa minimale**

- **Node.js** ≥ 18 (rekomandohet 20)
- **npm** ≥ 8 (rekomandohet 10)
- **Chrome** (për Lighthouse testing)

### **1. Monolit (Dev)**

```bash
cd monolith
npm install
npm start
# Dev server afishon portin (zakonisht 3000 ose i radhës nëse 3000 është i zënë)
```

### **2. MF Homogjen (Dev, porte tipike 3000–3003)**

```bash
cd mf-homogeneous

# Windows (PowerShell)
powershell -ExecutionPolicy Bypass -File start-all.ps1

# Linux/Mac
chmod +x start-all.sh && ./start-all.sh

# Shell:3000 · ProductList:3001 · ProductDetail:3002 · Cart:3003
```

### **3. MF Heterogjen (Dev, porte tipike 4000–4003)**

```bash
cd mf-heterogeneous

# Windows (PowerShell)
powershell -ExecutionPolicy Bypass -File start-all.ps1

# Linux/Mac
chmod +x start-all.sh && ./start-all.sh

# Shell:4000 · ProductList:4001 · ProductDetail:4002 · Cart(Svelte):4003
```

> ** Për ndërtim dhe testim në Prod, shih skriptet më poshtë.**

---

## Skriptet e matjes

### **Matje në Dev (Lighthouse + build/bundle në Dev)**

```powershell
# Test performance në development mode
.\performance-compare.ps1 -LighthouseTest -Runs 3

# Build dhe analizo bundle sizes
.\performance-compare.ps1 -BuildAll

# Full workflow
.\performance-compare.ps1 -BuildAll -LighthouseTest -Runs 3

# Output: ./performance-results-YYYYMMDD-HHMMSS.json & .csv
```

### **Matje në Prod (build → serve → Lighthouse)**

```powershell
# Full production testing workflow
.\production-compare.ps1 -BuildAll -StartServers -TestPerformance -Runs 3

# Output: ./production-results-YYYYMMDD-HHMMSS.json & .csv
```

**Komanda të veçanta:**

```powershell
# Vetëm build
.\production-compare.ps1 -BuildAll

# Start production servers
.\production-compare.ps1 -StartServers

# Test performance (servers duhet të jenë aktive)
.\production-compare.ps1 -TestPerformance -Runs 3

# Stop të gjitha servers
.\production-compare.ps1 -StopServers
```

---

##  Rezultate (Përmbledhje)

### **Performanca – Dev (mediana e 3 ekzekutimeve)**

| Metrika                 | Monolit | MF Homogjen | MF Heterogjen |
| ----------------------- | ------- | ----------- | ------------- |
| **Performance (0–100)** | 52      | 51          | 51            |
| **FCP (ms)**            | 736     | 737         | 807           |
| **LCP (ms)**            | 5788    | 5185        | 6198          |
| **TTI (ms)**            | 5788    | 5185        | 6198          |
| **Speed Index (ms)**    | 861     | 1125        | 1108          |
| **TBT (ms)**            | 0       | 0           | 0             |
| **CLS**                 | 0.419   | 0.419       | 0.419         |
| **INP (ms)**            | 0       | 0           | 0             |

### **Performanca – Prod (mediana e 3 ekzekutimeve)**

| Metrika                 | Monolit | MF Homogjen | MF Heterogjen |
| ----------------------- | ------- | ----------- | ------------- |
| **Performance (0–100)** | 63      | 62          | 66            |
| **FCP (ms)**            | 208     | 208         | 205           |
| **LCP (ms)**            | 2397    | 2522        | 2107          |
| **TTI (ms)**            | 2397    | 2522        | 2107          |
| **Speed Index (ms)**    | 317     | 498         | 377           |
| **TBT (ms)**            | 0       | 0           | 0             |
| **CLS**                 | 0.419   | 0.419       | 0.419         |
| **INP (ms)**            | 0       | 0           | 0             |

### **Ndërtimi & Bundle (Dev)**

| Arkitektura               | Build Time (s) | Bundle Size (MB) | JS Gzipped (MB) |
| ------------------------- | -------------- | ---------------- | --------------- |
| **Monolit**               | 7.13           | 1.81             | 0.512           |
| **MF Homogjen (total)**   | 456.56         | 8.09             | 2.156           |
| **MF Heterogjen (total)** | 379.41         | 7.93             | 2.089           |

### ** Vëzhgime kryesore**

✅ **Në Dev:**

- MF homogjen rezulton më mirë në LCP/TTI
- Monoliti ruan avantazh në Speed Index
- Të tre arkitekturat kanë CLS të njëjtë (0.419)

✅ **Në Prod:**

- **MF heterogjen (React + Svelte) del fitues** në LCP/TTI dhe Performance Score
- Optimizimet e production përmirësojnë të gjitha arkitekturat ndjeshëm
- FCP është pothuajse identik (205-208ms)

⚠️ **Kostot e Modularitetit:**

- MF-të rrisin kohën totale të ndërtimit (7s → 456s për homogjen, 379s për heterogjen)
- Madhësia kumulative e bundle-eve rritet për shkak të orkestrimit dhe varësive të ndara
- Cart (Svelte) mbetet minimal në madhësi (më i vogël se Cart React)

---

##  Variantet Arkitekturore (Pikat Kryesore)

### **1. Monolit (React)**

✅ **Avantazhet:**

- Thjeshtësi dhe konfigurim i centralizuar
- Build time më i shpejtë (7.13s)
- Bundle size më i vogël (1.81 MB)
- I përshtatshëm për sisteme të vogla/mesme

❌ **Disavantazhet:**

- Modularitet i kufizuar
- Vështirësi në skalim të ekipeve
- Rivendosje e plotë për çdo ndryshim

### **2. MF Homogjen (React + Module Federation)**

✅ **Avantazhet:**

- Ndarje e qartë e përgjegjësive
- Shared dependencies (React, React-DOM)
- Ekuilibër modularitet/mirëmbajtje
- Zhvillim i pavarur i komponentëve

❌ **Disavantazhet:**

- Build time i lartë (456.56s total)
- Kompleksitet i shtuar në konfigurimin
- Bundle size më i madh (8.09 MB total)

### **3. MF Heterogjen (React + Svelte)**

✅ **Avantazhet:**

- Fleksibilitet teknologjik maksimal
- Svelte Cart më i vogël dhe më i shpejtë
- Performance më i mirë në production (66/100)
- Mundësi për optimizime framework-specifike

❌ **Disavantazhet:**

- Kërkon menaxhim të kujdesshëm të varësive
- Kompleksitet i shtuar në konfigurimin (React↔Svelte wrapper)
- Build time i lartë (379.41s total)
- Nevoja për ekspertizë në dy framework-e

---

##  Riprodhueshmëri & Kufizime

### **Për Riprodhueshmëri të Plotë:**

1. Përdorni të njëjtat versione të Node/npm/Chrome për të minimizuar devijimet
2. Ekzekutoni të paktën 3 teste dhe raportoni medianen
3. Mbyllni të gjitha aplikacionet e tjera për të shmangur ndërhyrjet
4. Përdorni të njëjtin hardware/OS për krahasime të drejta

### **Kufizime dhe Përmirësime të Mundshme:**

- ⚠️ **CLS i lartë (0.419):** Mund të përmirësohet me:
  - Dimensione fikse për imazhet
  - Skeleton loaders për përmbajtje dinamike
  - Optimizim i layout-it
- ⚠️ **INP/TBT = 0:** Scenarios aktualisht nuk përfshijnë ndërveprime komplekse

  - Shtoni rrjedha interaktive (p.sh., "Add to Cart" me animacione)
  - Implementoni filtra dhe sortim dinamik
  - Testoni me heavy JavaScript operations

-  **Skenarë shtesë për testuar:**
  - Mobile performance
  - Network throttling (3G/4G)
  - Multiple concurrent users
  - Different browser engines (Firefox, Safari)

---

## 📁 Struktura e Repository-s

```
microfrontends-master-thesis/
├── monolith/                          # Monolithic React app
│   ├── src/
│   ├── package.json
│   └── start-all.ps1
│
├── mf-homogeneous/                    # Homogeneous MF (all React)
│   ├── mf-shell/                      # Shell app (port 3000)
│   ├── mf-product-list/               # Remote (port 3001)
│   ├── mf-product-detail/             # Remote (port 3002)
│   ├── mf-cart/                       # Remote (port 3003)
│   └── start-all.ps1
│
├── mf-heterogeneous/                  # Heterogeneous MF (React + Svelte)
│   ├── mf-shell/                      # Shell app (port 4000)
│   ├── mf-product-list/               # Remote React (port 4001)
│   ├── mf-product-detail/             # Remote React (port 4002)
│   ├── mf-cart-svelte/                # Remote Svelte (port 4003)
│   └── start-all.ps1
│
├── performance-compare.ps1            # Development testing script
├── production-compare.ps1             # Production testing script
├── README.md                          # This file
├── HETEROGENEOUS_ARCHITECTURE.md      # Detailed architecture docs
├── TESTING-GUIDE.md                   # Comprehensive testing guide
└── results/                           # Generated test results
    ├── performance-results-*.json
    ├── performance-summary-*.csv
    ├── production-results-*.json
    └── production-summary-*.csv
```

---

## 📄 Licenca dhe përdorimi

Ky kod dhe rezultatet publikohen për **qëllime akademike** (tezë Master, UP "Hasan Prishtina", FIEK).  
Lejohet riprodhimi me referencë të autorit dhe citim të repository-s dhe tezës.

### **Citimi (Recommended):**

```bibtex
@mastersthesis{edonbudakova2025microfrontends,
  author  = {Budakova, Edon},
  title   = {Analysis of the performance and modularity of heterogeneous microfrontends compared to homogeneous and monolithic architectures},
  school  = {University of Prishtina – Faculty of Electrical and Computer Engineering},
  year    = {2025},
  type    = {Master's thesis},
  url     = {https://github.com/edonb99/microfrontends-master-thesis}
}
```

---

##  Autori & Mentor

**Autor:** Edon Budakova  
**Mentore:** Prof. Ass. Dr. Dhuratë Hyseni  
**Institucioni:** Universiteti i Prishtinës "Hasan Prishtina" – FIEK  
**Viti:** 2025

**Kontakt:**

- GitHub: [@edonb99](https://github.com/edonb99)
- Repository: [microfrontends-master-thesis](https://github.com/edonb99/microfrontends-master-thesis)

---

##  Overview (English)

This repository contains a controlled case study where the same Single Page Application (SPA) is implemented in three architectural styles to enable a fair and reproducible comparison:

1. **Monolithic** (React)
2. **Homogeneous microfrontends** (React + Webpack Module Federation)
3. **Heterogeneous microfrontends** (React + Svelte, via Module Federation)

Primary outcomes concern **web performance**, **modularity**, and **developer experience (DX)** under standardized measurement procedures.

---

##  Method (High-Level)

- **Independent variable:** Architecture style
- **Controlled variables:** Domain, UI, and logic remain identical across all three implementations
- **Measurement protocol:** Three runs per scenario; report **median** values
- **Core metrics:** FCP, LCP, TTI, TBT, Speed Index, CLS, INP, plus build time and bundle size
- **Testbed:** Windows 11, Node 20.19.2, npm 10.8.2, Chrome 140, React 19.1.0, Svelte 3.59.1, Webpack 5.89.0, Tailwind 3.4.1

---

##  Running & Reproducing

### **Prerequisites**

- Node.js ≥ 18 (recommended 20)
- npm ≥ 8 (recommended 10)
- Chrome (for Lighthouse testing)

### **Quick Start**

**Monolith (Dev):**

```bash
cd monolith
npm install
npm start  # Dev server prints port (typically 3000)
```

**Homogeneous MF (Dev, ports 3000–3003):**

```bash
cd mf-homogeneous
powershell -ExecutionPolicy Bypass -File start-all.ps1  # Windows
# OR
chmod +x start-all.sh && ./start-all.sh  # Linux/Mac

# Shell:3000 · ProductList:3001 · ProductDetail:3002 · Cart:3003
```

**Heterogeneous MF (Dev, ports 4000–4003):**

```bash
cd mf-heterogeneous
powershell -ExecutionPolicy Bypass -File start-all.ps1  # Windows
# OR
chmod +x start-all.sh && ./start-all.sh  # Linux/Mac

# Shell:4000 · ProductList:4001 · ProductDetail:4002 · Cart(Svelte):4003
```

### **Performance Testing**

**Development Testing:**

```powershell
.\performance-compare.ps1 -LighthouseTest -Runs 3
.\performance-compare.ps1 -BuildAll
```

**Production Testing:**

```powershell
.\production-compare.ps1 -BuildAll -StartServers -TestPerformance -Runs 3
```

Scripts write results under `performance-results-*.json/csv` and `production-results-*.json/csv`.

---

##  Key Findings (Concise)

### **Development Mode:**

- **Homogeneous MFs** outperform in LCP/TTI
- **Monolith** leads in Speed Index
- All architectures have identical CLS (0.419)

### **Production Mode:**

- **Heterogeneous MFs (React+Svelte)** lead in LCP/TTI and overall Performance score (66/100)
- Monolith still strong on Speed Index (317ms)
- Production optimizations significantly improve all architectures

### **Build & Bundle:**

- MF variants increase total build time (7s → 379-456s)
- Cumulative bundle size grows due to orchestration and shared/duplicated dependencies
- Svelte Cart remains minimal in size (smaller than React Cart)

---

##  Conclusion

This study demonstrates that:

1. **Monolithic architecture** remains optimal for small-to-medium projects prioritizing simplicity and fast build times
2. **Homogeneous microfrontends** provide a balanced approach with good modularity and shared dependencies
3. **Heterogeneous microfrontends** offer maximum flexibility and best production performance, at the cost of increased complexity

The choice depends on project scale, team structure, and long-term maintainability requirements.

---

## 📄 License & Citation

This work is published for **academic purposes** as part of a Master's thesis (University of Prishtina – FIEK, 2025).

When reusing code or results, please cite:

```bibtex
@mastersthesis{edonbudakova2025microfrontends,
  author  = {Budakova, Edon},
  title   = {Analysis of the performance and modularity of heterogeneous microfrontends compared to homogeneous and monolithic architectures},
  school  = {University of Prishtina – Faculty of Electrical and Computer Engineering},
  year    = {2025},
  type    = {Master's thesis},
  url     = {https://github.com/edonb99/microfrontends-master-thesis}
}
```

---

##  Contributing

This is an academic research project. If you find issues or have suggestions for improvements:

1. Open an issue describing the problem or enhancement
2. Fork the repository and create a pull request
3. Ensure all tests pass and results are reproducible

---

## 📞 Contact

**Author:** Edon Budakova  
**Supervisor:** Prof. Ass. Dr. Dhuratë Hyseni  
**Institution:** University of Prishtina "Hasan Prishtina" – FIEK  
**Year:** 2025

**Links:**

-  GitHub: [@edonb99](https://github.com/edonb99)
-  Repository: [microfrontends-master-thesis](https://github.com/edonb99/microfrontends-master-thesis)

---

##  Acknowledgments

Special thanks to:

- Prof. Ass. Dr. Dhuratë Hyseni for supervision and guidance
- University of Prishtina – FIEK for academic support
- Open-source communities (React, Svelte, Webpack) for excellent tools and documentation

---

** If this research helps your work, please consider citing it and starring the repository!**
