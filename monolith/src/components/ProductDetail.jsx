// src/components/ProductDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://fakestoreapi.com/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = () => {
    const existing = JSON.parse(localStorage.getItem("cart")) || [];
    const updated = [...existing, { ...product, quantity: 1 }];
    localStorage.setItem("cart", JSON.stringify(updated));
    navigate("/cart");
  };

  if (loading || !product) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      <img src={product.image} alt={product.title} className="object-contain h-80 mx-auto" />
      <div>
        <h2 className="text-2xl font-bold mb-2">{product.title}</h2>
        <p className="text-gray-600 mb-4">{product.description}</p>
        <p className="text-xl font-semibold mb-4">${product.price}</p>
        <button
          onClick={handleAddToCart}
          className="mt-4 px-4 bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-700 transition-all  "
          >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;
