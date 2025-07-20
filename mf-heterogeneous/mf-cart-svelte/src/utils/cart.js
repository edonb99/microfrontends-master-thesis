export const getCart = () => {
  return JSON.parse(localStorage.getItem("cart")) || {};
};

export const setCart = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

export const addToCart = (product) => {
  const cart = getCart();
  if (cart[product.id]) {
    cart[product.id].quantity += 1;
  } else {
    cart[product.id] = { ...product, quantity: 1 };
  }
  setCart(cart);
};

export const removeFromCart = (id) => {
  const cart = getCart();
  if (cart[id]) {
    cart[id].quantity -= 1;
    if (cart[id].quantity <= 0) delete cart[id];
  }
  setCart(cart);
};

export const getQuantity = (id) => {
  const cart = getCart();
  return cart[id]?.quantity || 0;
};
