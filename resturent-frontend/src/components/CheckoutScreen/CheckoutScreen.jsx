import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createOrder } from "../../api/orderApi";
import CartService from "../../services/cartService";
import PaymentMethod from "./PaymentMethod";
import DeliveryAddressForm from "./DeliveryAddressForm";
import "./CheckoutScreen.css";

const CheckoutScreen = () => {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("");
  const [address, setAddress] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const cartItems = CartService.getCart(restaurantId);
  const subtotal = CartService.getTotalPrice(restaurantId);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  const validateForm = () => {
    const newErrors = {};
    if (!address.trim()) newErrors.address = "Delivery address is required";
    if (!paymentMethod) newErrors.paymentMethod = "Payment method is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const orderData = {
        restaurant: restaurantId,
        orderedItems: cartItems.map((item) => ({
          item: item._id,
          quantity: item.quantity,
        })),
        totalBilled: total,
        address,
        paymentMethod,
      };

      await createOrder(orderData, token);
      CartService.clearCart(restaurantId);
      navigate("/order-confirmation");
    } catch (error) {
      console.error("Order failed:", error);
      alert("Order failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart">
        <h2>Your cart is empty</h2>
        <p>There are no items to checkout.</p>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>

      <div className="checkout-grid">
        <div className="order-summary">
          <h2>Order Summary</h2>
          <ul className="order-items">
            {cartItems.map((item) => (
              <li key={item._id} className="order-item">
                <div className="item-info">
                  <span className="item-name">{item.name}</span>
                  <span className="item-quantity">x{item.quantity}</span>
                </div>
                <span className="item-price">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>

          <div className="order-totals">
            <div className="total-row">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="total-row">
              <span>Tax (10%):</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="total-row grand-total">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="checkout-form">
          <DeliveryAddressForm
            address={address}
            setAddress={setAddress}
            error={errors.address}
          />

          <PaymentMethod
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            error={errors.paymentMethod}
          />

          <button
            type="submit"
            className="place-order-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Place Order"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutScreen;
