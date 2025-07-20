import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  addToCart,
  removeFromCart,
  getQuantity,
} from "./utils/cart";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    fetch(`https://fakestoreapi.com/products/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setQuantity(getQuantity(data.id));
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching product:', error);
        // Set a mock product for development
        const mockProduct = {
          id: id,
          title: `Mock Product ${id}`,
          description: "This is a mock product for development purposes.",
          price: 29.99,
          image: `https://via.placeholder.com/300x300/cccccc/000000?text=Product+${id}`
        };
        setProduct(mockProduct);
        setQuantity(getQuantity(mockProduct.id));
        setLoading(false);
      });
  }, [id]);

  const handleAdd = () => {
    addToCart(product);
    setQuantity(getQuantity(product.id));
  };

  const handleRemove = () => {
    removeFromCart(product.id);
    setQuantity(getQuantity(product.id));
  };

  if (loading || !product) return <p className="mt-10 text-center">Loading...</p>;

  return (
    <div className="grid max-w-4xl grid-cols-1 gap-6 p-6 mx-auto md:grid-cols-2">
      <img src={product.image} alt={product.title} className="object-contain mx-auto h-80" />
      <div>
        <h2 className="mb-2 text-2xl font-bold">{product.title}</h2>
        <p className="mb-4 text-gray-600">{product.description}</p>
        <p className="mb-4 text-xl font-semibold">${product.price}</p>

        {quantity > 0 ? (
          <div className="flex items-center mt-4 space-x-4">
            <button
              onClick={handleRemove}
              className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
            >
              −
            </button>
            <span className="text-lg font-semibold">{quantity}</span>
            <button
              onClick={handleAdd}
              className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
            >
              +
            </button>
          </div>
        ) : (
          <button
            onClick={handleAdd}
            className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-xl hover:bg-blue-700"
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
