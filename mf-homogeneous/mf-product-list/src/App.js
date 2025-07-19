import { BrowserRouter } from "react-router-dom";
import ProductList from "./ProductList";

const App = () => (
  <BrowserRouter>
    <div className="p-4 mb-4 text-center text-white bg-blue-600">
      🧩 ProductList Microfrontend - Standalone Mode
    </div>
    <ProductList />
  </BrowserRouter>
);

export default App;
