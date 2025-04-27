import React, { useState } from "react";
import CardPaymentForm from "./CardPaymentForm";

const PaymentMethod = ({ paymentMethod, setPaymentMethod, error }) => {
  const [showCardForm, setShowCardForm] = useState(false);

  const handlePaymentChange = (method) => {
    setPaymentMethod(method);
    setShowCardForm(method === "card");
  };

  return (
    <div className="payment-method">
      <h3>Payment Method</h3>

      <div className="payment-options">
        <label className="payment-option">
          <input
            type="radio"
            name="paymentMethod"
            checked={paymentMethod === "cod"}
            onChange={() => handlePaymentChange("cod")}
          />
          <span>Cash on Delivery</span>
        </label>

        <label className="payment-option">
          <input
            type="radio"
            name="paymentMethod"
            checked={paymentMethod === "card"}
            onChange={() => handlePaymentChange("card")}
          />
          <span>Credit/Debit Card</span>
        </label>
      </div>

      {error && <p className="error-message">{error}</p>}

      {showCardForm && <CardPaymentForm />}
    </div>
  );
};

export default PaymentMethod;
