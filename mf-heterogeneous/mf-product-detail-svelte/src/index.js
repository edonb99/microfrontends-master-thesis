import ProductDetail from './ProductDetail.svelte';

// Mount the Svelte component for standalone usage
const app = new ProductDetail({
  target: document.getElementById('root'),
  props: {
    // Default props for standalone mode
    productId: '1'
  }
});

export default app;
