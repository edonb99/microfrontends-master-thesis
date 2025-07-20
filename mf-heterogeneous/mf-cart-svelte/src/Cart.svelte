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
</script>

<div class="max-w-4xl p-6 mx-auto">
  <h2 class="mb-4 text-2xl font-bold">🛒 Checkout</h2>

  {#if products.length === 0}
    <p>No items in cart.</p>
  {:else}
    <div class="space-y-6">
      {#each products as item (item.id)}
        <div class="flex items-center justify-between pb-4 border-b">
          <div class="w-2/3">
            <h3 class="font-semibold">{item.title}</h3>
            <p class="text-sm text-gray-500">
              ${item.price} x {item.quantity} = ${(
                item.price * item.quantity
              ).toFixed(2)}
            </p>
          </div>
          <div class="flex items-center space-x-2">
            <button
              on:click={() => handleRemove(item.id)}
              class="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600"
            >
              −
            </button>
            <span class="font-semibold">{item.quantity}</span>
            <button
              on:click={() => handleAdd(item)}
              class="px-3 py-1 text-white bg-green-500 rounded hover:bg-green-600"
            >
              +
            </button>
          </div>
        </div>
      {/each}
      <div class="mt-6 text-xl font-bold text-right">
        Total: ${total.toFixed(2)}
      </div>
    </div>
  {/if}
</div>
