<script>
  import { onMount } from 'svelte';
  import { addToCart } from './utils/cart.js';
  
  // Products data - normally this would come from an API
  const products = [
    { id: 1, name: 'Laptop', price: 999.99, image: 'https://via.placeholder.com/400x400?text=Laptop', description: 'High-performance laptop perfect for work and gaming. Features the latest processor, 16GB RAM, and 512GB SSD storage.' },
    { id: 2, name: 'Phone', price: 699.99, image: 'https://via.placeholder.com/400x400?text=Phone', description: 'Latest smartphone with advanced camera system, 5G connectivity, and all-day battery life.' },
    { id: 3, name: 'Headphones', price: 199.99, image: 'https://via.placeholder.com/400x400?text=Headphones', description: 'Premium wireless headphones with noise cancellation and studio-quality sound.' },
    { id: 4, name: 'Tablet', price: 499.99, image: 'https://via.placeholder.com/400x400?text=Tablet', description: 'Versatile tablet perfect for creativity, productivity, and entertainment. Includes stylus support.' },
    { id: 5, name: 'Watch', price: 299.99, image: 'https://via.placeholder.com/400x400?text=Watch', description: 'Smart watch with health monitoring, fitness tracking, and seamless connectivity.' },
    { id: 6, name: 'Camera', price: 799.99, image: 'https://via.placeholder.com/400x400?text=Camera', description: 'Professional camera with advanced features for photography enthusiasts and professionals.' }
  ];

  export let productId = '1';
  
  let product = null;
  let quantity = 1;
  let isLoading = true;

  onMount(() => {
    // Simulate API call delay
    setTimeout(() => {
      const id = parseInt(productId);
      product = products.find(p => p.id === id) || products[0];
      isLoading = false;
    }, 500);
  });

  function handleAddToCart() {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
      alert(`${quantity} ${product.name}(s) added to cart!`);
    }
  }

  function goBack() {
    window.history.back();
  }
</script>

<style>
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  .loading {
    text-align: center;
    padding: 3rem;
    font-size: 1.25rem;
    color: #6b7280;
  }

  .back-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background-color: #6b7280;
    color: white;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    text-decoration: none;
    margin-bottom: 2rem;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .back-button:hover {
    background-color: #4b5563;
  }

  .product-detail {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    align-items: start;
  }

  .image-section img {
    width: 100%;
    height: 400px;
    object-fit: cover;
    border-radius: 0.75rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }

  .info-section h1 {
    font-size: 2.25rem;
    font-weight: bold;
    color: #1f2937;
    margin-bottom: 1rem;
  }

  .svelte-badge {
    display: inline-block;
    background-color: #ff3e00;
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    margin-bottom: 1rem;
  }

  .price {
    font-size: 2rem;
    font-weight: bold;
    color: #2563eb;
    margin-bottom: 1.5rem;
  }

  .description {
    color: #6b7280;
    line-height: 1.6;
    margin-bottom: 2rem;
  }

  .purchase-section {
    background-color: #f9fafb;
    padding: 1.5rem;
    border-radius: 0.75rem;
  }

  .quantity-selector {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .quantity-selector label {
    font-weight: 600;
    color: #374151;
  }

  .quantity-selector input {
    width: 4rem;
    padding: 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    text-align: center;
  }

  .add-to-cart-button {
    width: 100%;
    background-color: #10b981;
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    border: none;
    font-size: 1.125rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .add-to-cart-button:hover {
    background-color: #059669;
  }

  @media (max-width: 768px) {
    .container {
      padding: 1rem;
    }

    .product-detail {
      grid-template-columns: 1fr;
      gap: 2rem;
    }
  }
</style>

<div class="container">
  {#if isLoading}
    <div class="loading">Loading product details...</div>
  {:else if product}
    <button class="back-button" on:click={goBack}>
      ← Back to Products
    </button>

    <div class="product-detail">
      <div class="image-section">
        <img src={product.image} alt={product.name} />
      </div>

      <div class="info-section">
        <span class="svelte-badge">Svelte Remote</span>
        <h1>{product.name}</h1>
        <div class="price">${product.price}</div>
        <p class="description">{product.description}</p>

        <div class="purchase-section">
          <div class="quantity-selector">
            <label for="quantity">Quantity:</label>
            <input
              id="quantity"
              type="number"
              min="1"
              max="10"
              bind:value={quantity}
            />
          </div>

          <button class="add-to-cart-button" on:click={handleAddToCart}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  {:else}
    <div class="loading">Product not found</div>
  {/if}
</div>
