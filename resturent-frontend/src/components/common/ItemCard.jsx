import React from "react";
import CartService from "../../services/cartService";

const ItemCard = ({ item, restaurantId, onCartUpdate }) => {
  const handleAddToCart = () => {
    // Check if item already exists in cart
    const currentCart = CartService.getCart(restaurantId);
    const existingItem = currentCart.find(
      (cartItem) => cartItem._id === item._id
    );

    if (existingItem) {
      // If exists, increase quantity by 1
      CartService.increaseQuantity(restaurantId, item._id);
    } else {
      // If new, add to cart with quantity 1
      CartService.addToCart(restaurantId, item);
    }

    // Notify parent component of cart update if callback provided
    if (onCartUpdate) {
      onCartUpdate(CartService.getCart(restaurantId));
    }
    alert("Item added to cart");
  };

  return (
    <div className="menu-item">
      <div className="item-details">
        <h3>{item.name}</h3>
        <p className="item-description">{item.description}</p>
        <p className="item-price">Rs.{item.price.toFixed(2)}</p>

        <div className="cart-controls">
          <button className="add-to-cart-btn" onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>
      </div>
      <div className="item-image">
        <img src={item.imageUrl} alt={item.name} />
      </div>
    </div>
  );
};

export default ItemCard;
