// Cart utility functions shared across microfrontends
const CART_STORAGE_KEY = 'mf-cart';

export const getCart = () => {
  const cart = localStorage.getItem(CART_STORAGE_KEY);
  return cart ? JSON.parse(cart) : [];
};

export const addToCart = (product) => {
  const cart = getCart();
  const existingItem = cart.find(item => item.id === product.id);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  
  // Dispatch custom event to notify other microfrontends
  window.dispatchEvent(new CustomEvent('cartUpdated', { detail: cart }));
};

export const removeFromCart = (productId) => {
  const cart = getCart();
  const updatedCart = cart.filter(item => item.id !== productId);
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedCart));
  
  // Dispatch custom event to notify other microfrontends
  window.dispatchEvent(new CustomEvent('cartUpdated', { detail: updatedCart }));
};

export const updateCartItemQuantity = (productId, quantity) => {
  const cart = getCart();
  const item = cart.find(item => item.id === productId);
  
  if (item) {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      item.quantity = quantity;
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      
      // Dispatch custom event to notify other microfrontends
      window.dispatchEvent(new CustomEvent('cartUpdated', { detail: cart }));
    }
  }
};

export const clearCart = () => {
  localStorage.removeItem(CART_STORAGE_KEY);
  
  // Dispatch custom event to notify other microfrontends
  window.dispatchEvent(new CustomEvent('cartUpdated', { detail: [] }));
};

export const getCartTotal = () => {
  const cart = getCart();
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
};

export const getCartItemCount = () => {
  const cart = getCart();
  return cart.reduce((total, item) => total + item.quantity, 0);
};
