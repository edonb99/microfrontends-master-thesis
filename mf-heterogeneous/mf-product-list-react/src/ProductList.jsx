import React from 'react';
import { Link } from 'react-router-dom';
import { addToCart } from './utils/cart';

const products = [
  { id: 1, name: 'Laptop', price: 999.99, image: 'https://via.placeholder.com/200x200?text=Laptop' },
  { id: 2, name: 'Phone', price: 699.99, image: 'https://via.placeholder.com/200x200?text=Phone' },
  { id: 3, name: 'Headphones', price: 199.99, image: 'https://via.placeholder.com/200x200?text=Headphones' },
  { id: 4, name: 'Tablet', price: 499.99, image: 'https://via.placeholder.com/200x200?text=Tablet' },
  { id: 5, name: 'Watch', price: 299.99, image: 'https://via.placeholder.com/200x200?text=Watch' },
  { id: 6, name: 'Camera', price: 799.99, image: 'https://via.placeholder.com/200x200?text=Camera' }
];

function ProductList() {
  const handleAddToCart = (product) => {
    addToCart(product);
    alert(`${product.name} added to cart!`);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Our Products (React Remote)
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {product.name}
              </h3>
              <p className="text-2xl font-bold text-blue-600 mb-4">
                ${product.price}
              </p>
              <div className="flex gap-2">
                <Link
                  to={`/product/${product.id}`}
                  className="flex-1 bg-gray-500 text-white text-center py-2 px-4 rounded hover:bg-gray-600 transition-colors"
                >
                  View Details
                </Link>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;
