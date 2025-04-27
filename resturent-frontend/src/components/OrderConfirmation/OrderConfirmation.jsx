import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./OrderConfirmation.css";

const OrderConfirmation = () => {
  const navigate = useNavigate();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="confirmation-container">
      <div className="confirmation-card">
        <div className="checkmark-container">
          <svg
            width="80"
            height="80"
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 40L35 55L60 25"
              stroke="#27ae60"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle
              cx="40"
              cy="40"
              r="35"
              stroke="#27ae60"
              strokeWidth="4"
              fill="none"
            />
          </svg>
        </div>

        <h1>Order Confirmed!</h1>
        <p className="confirmation-message">
          Thank you for your order. Your food is being prepared and will be
          delivered soon.
        </p>

        <div className="order-details">
          <div className="detail-row">
            <span>Order Number:</span>
            <span>#{Math.floor(Math.random() * 1000000)}</span>
          </div>
          <div className="detail-row">
            <span>Estimated Delivery:</span>
            <span>30-45 minutes</span>
          </div>
        </div>

        <button
          className="home-btn"
          onClick={() => navigate("/customer-dashboard")}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmation;
