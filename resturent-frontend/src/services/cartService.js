// cartService.js

/**
 * Cart Service for managing restaurant-specific carts using localStorage
 */
const CartService = {
  // Key prefix for localStorage
  CART_PREFIX: "restaurant_cart_",

  /**
   * Get cart for a specific restaurant
   * @param {string} restaurantId - ID of the restaurant
   * @returns {Array} Array of cart items
   */
  getCart: (restaurantId) => {
    try {
      const cartData = localStorage.getItem(
        `${CartService.CART_PREFIX}${restaurantId}`
      );
      return cartData ? JSON.parse(cartData) : [];
    } catch (error) {
      console.error("Error getting cart:", error);
      return [];
    }
  },

  /**
   * Add item to cart or update quantity if already exists
   * @param {string} restaurantId - ID of the restaurant
   * @param {object} item - Item to add
   * @param {number} [quantity=1] - Quantity to add
   * @returns {Array} Updated cart
   */
  addToCart: (restaurantId, item, quantity = 1) => {
    try {
      const cart = CartService.getCart(restaurantId);
      const existingItemIndex = cart.findIndex(
        (cartItem) => cartItem._id === item._id
      );

      if (existingItemIndex >= 0) {
        // Item exists, update quantity
        cart[existingItemIndex].quantity += quantity;
      } else {
        // New item, add to cart
        const cartItem = {
          ...item,
          quantity,
          restaurant: {
            _id: restaurantId,
            name: item.restaurant?.name || "",
          },
        };
        cart.push(cartItem);
      }

      localStorage.setItem(
        `${CartService.CART_PREFIX}${restaurantId}`,
        JSON.stringify(cart)
      );
      return cart;
    } catch (error) {
      console.error("Error adding to cart:", error);
      return [];
    }
  },

  /**
   * Remove item from cart
   * @param {string} restaurantId - ID of the restaurant
   * @param {string} itemId - ID of the item to remove
   * @returns {Array} Updated cart
   */
  removeFromCart: (restaurantId, itemId) => {
    try {
      const cart = CartService.getCart(restaurantId);
      const updatedCart = cart.filter((item) => item._id !== itemId);

      localStorage.setItem(
        `${CartService.CART_PREFIX}${restaurantId}`,
        JSON.stringify(updatedCart)
      );
      return updatedCart;
    } catch (error) {
      console.error("Error removing from cart:", error);
      return [];
    }
  },

  /**
   * Update item quantity in cart
   * @param {string} restaurantId - ID of the restaurant
   * @param {string} itemId - ID of the item to update
   * @param {number} newQuantity - New quantity (must be >= 1)
   * @returns {Array} Updated cart
   */
  updateQuantity: (restaurantId, itemId, newQuantity) => {
    try {
      if (newQuantity < 1) {
        return CartService.removeFromCart(restaurantId, itemId);
      }

      const cart = CartService.getCart(restaurantId);
      const itemIndex = cart.findIndex((item) => item._id === itemId);

      if (itemIndex >= 0) {
        cart[itemIndex].quantity = newQuantity;
        localStorage.setItem(
          `${CartService.CART_PREFIX}${restaurantId}`,
          JSON.stringify(cart)
        );
      }

      return cart;
    } catch (error) {
      console.error("Error updating quantity:", error);
      return [];
    }
  },

  /**
   * Increase item quantity by 1
   * @param {string} restaurantId - ID of the restaurant
   * @param {string} itemId - ID of the item to update
   * @returns {Array} Updated cart
   */
  increaseQuantity: (restaurantId, itemId) => {
    const cart = CartService.getCart(restaurantId);
    const item = cart.find((item) => item._id === itemId);

    if (item) {
      return CartService.updateQuantity(
        restaurantId,
        itemId,
        item.quantity + 1
      );
    }

    return cart;
  },

  /**
   * Decrease item quantity by 1 (removes if quantity becomes 0)
   * @param {string} restaurantId - ID of the restaurant
   * @param {string} itemId - ID of the item to update
   * @returns {Array} Updated cart
   */
  decreaseQuantity: (restaurantId, itemId) => {
    const cart = CartService.getCart(restaurantId);
    const item = cart.find((item) => item._id === itemId);

    if (item) {
      return CartService.updateQuantity(
        restaurantId,
        itemId,
        item.quantity - 1
      );
    }

    return cart;
  },

  /**
   * Clear the entire cart for a restaurant
   * @param {string} restaurantId - ID of the restaurant
   */
  clearCart: (restaurantId) => {
    try {
      localStorage.removeItem(`${CartService.CART_PREFIX}${restaurantId}`);
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  },

  /**
   * Get total number of items in cart for a restaurant
   * @param {string} restaurantId - ID of the restaurant
   * @returns {number} Total items count
   */
  getItemCount: (restaurantId) => {
    const cart = CartService.getCart(restaurantId);
    return cart.reduce((total, item) => total + item.quantity, 0);
  },

  /**
   * Get total price of items in cart for a restaurant
   * @param {string} restaurantId - ID of the restaurant
   * @returns {number} Total price
   */
  getTotalPrice: (restaurantId) => {
    const cart = CartService.getCart(restaurantId);
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  },

  /**
   * Get all carts from localStorage (for all restaurants)
   * @returns {object} Object with restaurant IDs as keys and carts as values
   */
  getAllCarts: () => {
    try {
      const carts = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith(CartService.CART_PREFIX)) {
          const restaurantId = key.replace(CartService.CART_PREFIX, "");
          carts[restaurantId] = CartService.getCart(restaurantId);
        }
      }
      return carts;
    } catch (error) {
      console.error("Error getting all carts:", error);
      return {};
    }
  },
};

export default CartService;
