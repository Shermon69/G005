import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CartService from "../../services/cartService";

const Cart = () => {
  const { restaurantId } = useParams();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load cart items when component mounts or restaurantId changes
    const items = CartService.getCart(restaurantId);
    setCartItems(items);
    setLoading(false);
  }, [restaurantId]);

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      // Remove item if quantity is less than 1
      const updatedCart = CartService.removeFromCart(restaurantId, itemId);
      setCartItems(updatedCart);
    } else {
      // Update quantity
      const updatedCart = CartService.updateQuantity(
        restaurantId,
        itemId,
        newQuantity
      );
      setCartItems(updatedCart);
    }
  };

  const handleRemoveItem = (itemId) => {
    const updatedCart = CartService.removeFromCart(restaurantId, itemId);
    setCartItems(updatedCart);
  };
  const navigate = useNavigate();
  const handleCheckout = () => {
    console.log("Proceeding to checkout with items:", cartItems);
    navigate("/checkout/" + restaurantId);
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };
  console.log(restaurantId);
  if (loading) {
    return <div className="loading">Loading cart...</div>;
  }

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart">
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added any items yet.</p>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2>Your Order</h2>

      <div className="cart-items">
        {cartItems.map((item) => (
          <div key={item._id} className="cart-item">
            <div className="item-image">
              <img src={item.imageUrl} alt={item.name} />
            </div>

            <div className="item-details">
              <h3>{item.name}</h3>
              <p className="description">{item.description}</p>

              <div className="quantity-controls">
                <button
                  onClick={() =>
                    handleQuantityChange(item._id, item.quantity - 1)
                  }
                  className="quantity-btn"
                >
                  -
                </button>
                <span className="quantity">{item.quantity}</span>
                <button
                  onClick={() =>
                    handleQuantityChange(item._id, item.quantity + 1)
                  }
                  className="quantity-btn"
                >
                  +
                </button>
              </div>

              <div className="price-section">
                <p className="price">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
                <button
                  onClick={() => handleRemoveItem(item._id)}
                  className="remove-btn"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <div className="summary-row">
          <span>Subtotal:</span>
          <span>${calculateTotal().toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span>Tax (10%):</span>
          <span>${(calculateTotal() * 0.1).toFixed(2)}</span>
        </div>
        <div className="summary-row total">
          <span>Total:</span>
          <span>${(calculateTotal() * 1.1).toFixed(2)}</span>
        </div>

        <button onClick={handleCheckout} className="checkout-btn">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

// CSS Styles
const styles = `
  .cart-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }

  .loading {
    text-align: center;
    padding: 40px;
    font-size: 18px;
  }

  .empty-cart {
    text-align: center;
    padding: 40px;
  }

  .empty-cart h2 {
    color: #2c3e50;
    margin-bottom: 10px;
  }

  .empty-cart p {
    color: #7f8c8d;
  }

  .cart-items {
    margin-bottom: 30px;
  }

  .cart-item {
    display: flex;
    gap: 20px;
    padding: 15px;
    border-bottom: 1px solid #eee;
  }

  .item-image {
    width: 100px;
    height: 100px;
    overflow: hidden;
    border-radius: 6px;
  }

  .item-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .item-details {
    flex: 1;
  }

  .item-details h3 {
    margin: 0 0 5px 0;
    color: #2c3e50;
  }

  .description {
    color: #7f8c8d;
    font-size: 14px;
    margin: 5px 0 10px 0;
  }

  .quantity-controls {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 10px 0;
  }

  .quantity-btn {
    width: 30px;
    height: 30px;
    border: 1px solid #ddd;
    background: #f9f9f9;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .quantity-btn:hover {
    background: #eee;
  }

  .quantity {
    min-width: 20px;
    text-align: center;
  }

  .price-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .price {
    font-weight: bold;
    color: #27ae60;
  }

  .remove-btn {
    background: none;
    border: none;
    color: #e74c3c;
    cursor: pointer;
    font-size: 14px;
  }

  .remove-btn:hover {
    text-decoration: underline;
  }

  .cart-summary {
    background: #f9f9f9;
    padding: 20px;
    border-radius: 8px;
  }

  .summary-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  .summary-row.total {
    font-weight: bold;
    font-size: 18px;
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid #ddd;
  }

  .checkout-btn {
    width: 100%;
    padding: 12px;
    background-color: #27ae60;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
    margin-top: 20px;
    transition: background-color 0.3s;
  }

  .checkout-btn:hover {
    background-color: #219653;
  }
`;

// Inject styles
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default Cart;
