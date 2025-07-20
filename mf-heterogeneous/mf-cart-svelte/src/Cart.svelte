<script>
  import { onMount } from "svelte";
  import { getCart, addToCart, removeFromCart } from "./utils/cart.js";

  let cart = {};
  let products = [];
  let total = 0;

  onMount(() => {
    updateCart();
  });

  function updateCart() {
    cart = getCart();
    products = Object.values(cart).filter(Boolean);
    total = products.reduce(
      (sum, p) => sum + (p.price || 0) * (p.quantity || 0),
      0
    );
  }

  function handleAdd(product) {
    addToCart(product);
    updateCart();
  }

  function handleRemove(id) {
    removeFromCart(id);
    updateCart();
  }

  function clearCart() {
    localStorage.setItem("cart", JSON.stringify({}));
    updateCart();
  }
</script>

<div class="max-w-4xl mx-auto px-4 py-8">
  <!-- Header -->
  <div class="flex items-center justify-between mb-8">
    <div>
      <h1 class="text-3xl font-bold text-gray-900">Shopping Cart</h1>
      <p class="text-gray-600 mt-1">
        {products.length === 0
          ? "Your cart is empty"
          : `${products.length} ${products.length === 1 ? "item" : "items"} in your cart`}
      </p>
    </div>
    <a
      href="/"
      class="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
    >
      <svg
        class="w-4 h-4 mr-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 19l-7-7m0 0l7-7m-7 7h18"
        />
      </svg>
      Continue Shopping
    </a>
  </div>

  {#if products.length === 0}
    <div class="text-center py-16">
      <div
        class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6"
      >
        <svg
          class="w-10 h-10 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 5H3m4 8v4a2 2 0 002 2h8a2 2 0 002-2v-4"
          />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
      <p class="text-gray-500 mb-6">Add some products to get started</p>
      <a
        href="/"
        class="inline-flex items-center px-6 py-3 bg-blue-700 text-white font-medium rounded-xl hover:bg-blue-800 transition-colors duration-200"
      >
        <svg
          class="w-5 h-5 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 5H3m4 8v4a2 2 0 002 2h8a2 2 0 002-2v-4"
          />
        </svg>
        Start Shopping
      </a>
    </div>
  {:else}
    <div class="space-y-6">
      <!-- Cart Items -->
      <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {#each products as item, index (item.id)}
          <div
            class="p-6 flex items-start space-x-4 {index !== products.length - 1
              ? 'border-b border-gray-100'
              : ''}"
          >
            <!-- Product Image -->
            <div
              class="w-20 h-20 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0"
            >
              <img
                src={item.image}
                alt={item.title}
                class="w-10 h-10 object-contain"
              />
            </div>

            <!-- Product Info -->
            <div class="flex-1 min-w-0">
              <h3
                class="font-semibold text-gray-900 text-sm leading-tight line-clamp-2 mb-2"
              >
                {item.title}
              </h3>
              <div class="flex items-center justify-between">
                <div class="text-lg font-bold text-blue-700">
                  ${item.price}
                </div>
                <div class="text-sm text-gray-500">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            </div>

            <!-- Quantity Controls -->
            <div
              class="flex items-center space-x-3 bg-gray-50 rounded-full p-1 flex-shrink-0"
            >
              <button
                on:click={() => handleRemove(item.id)}
                class="w-8 h-8 rounded-full bg-white shadow-sm border border-gray-200 flex items-center justify-center text-blue-700 hover:bg-blue-50 hover:border-blue-200 transition-all duration-200"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M20 12H4"
                  />
                </svg>
              </button>
              <span
                class="font-semibold text-blue-700 min-w-[24px] text-center"
              >
                {item.quantity}
              </span>
              <button
                on:click={() => handleAdd(item)}
                class="w-8 h-8 rounded-full bg-blue-700 shadow-sm flex items-center justify-center text-white hover:bg-blue-800 transition-all duration-200"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>
            </div>
          </div>
        {/each}
      </div>

      <!-- Cart Summary -->
      <div
        class="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200"
      >
        <div class="flex items-center justify-between mb-4">
          <span class="text-lg font-semibold text-gray-900">Total</span>
          <span class="text-2xl font-bold text-blue-700"
            >${total.toFixed(2)}</span
          >
        </div>

        <!-- Action Buttons - Minimalist and Small -->
        <div class="flex space-x-3">
          <button
            on:click={clearCart}
            class="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
          >
            Clear Cart
          </button>
          <button
            class="flex-1 bg-blue-700 hover:bg-blue-800 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 text-sm group"
          >
            <svg
              class="w-4 h-4 group-hover:scale-110 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>Proceed to Checkout</span>
          </button>
        </div>
      </div>
    </div>
  {/if}
</div>
