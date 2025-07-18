import { BrowserRouter } from "react-router-dom";
import ProductList from "./ProductList";

const App = () => (
  <BrowserRouter>
  <div className="p-4 text-xl font-bold text-white bg-blue-500">
  Tailwind works! 🚀
</div>
    <ProductList />
  </BrowserRouter>
);

export default App;
