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

  if (loading || !product) return <p className="mt-10 text-center">Loading...</p>;

  return (
    <div className="grid max-w-4xl grid-cols-1 gap-6 p-6 mx-auto md:grid-cols-2">
      <img src={product.image} alt={product.title} className="object-contain mx-auto h-80" />
      <div>
        <h2 className="mb-2 text-2xl font-bold">{product.title}</h2>
        <p className="mb-4 text-gray-600">{product.description}</p>
        <p className="mb-4 text-xl font-semibold">${product.price}</p>
        <button
          onClick={handleAddToCart}
          className="px-4 py-2 mt-4 text-white transition-all bg-blue-500 rounded-xl hover:bg-blue-700 "
          >
          Add to cart
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;
