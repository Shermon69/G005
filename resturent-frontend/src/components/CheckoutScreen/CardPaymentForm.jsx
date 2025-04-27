import React, { useState } from "react";

const CardPaymentForm = () => {
  const [cardDetails, setCardDetails] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });
  const [errors, setErrors] = useState({});

  const validateCardNumber = (number) => {
    // Simple credit card validation (16 digits)
    return /^\d{16}$/.test(number.replace(/\s/g, ""));
  };

  const validateExpiry = (expiry) => {
    // MM/YY format
    return /^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(expiry);
  };

  const validateCVV = (cvv) => {
    // 3 or 4 digits
    return /^\d{3,4}$/.test(cvv);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCardDetails((prev) => ({ ...prev, [name]: value }));

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    return parts.length ? parts.join(" ") : value;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    let error = "";

    switch (name) {
      case "number":
        if (!validateCardNumber(value)) {
          error = "Invalid card number";
        }
        break;
      case "expiry":
        if (!validateExpiry(value)) {
          error = "Invalid expiry date (MM/YY)";
        }
        break;
      case "cvv":
        if (!validateCVV(value)) {
          error = "Invalid CVV";
        }
        break;
      case "name":
        if (!value.trim()) {
          error = "Cardholder name is required";
        }
        break;
    }

    if (error) {
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  return (
    <div className="card-payment-form">
      <div className="form-group">
        <label>Card Number</label>
        <input
          type="text"
          name="number"
          value={formatCardNumber(cardDetails.number)}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="1234 5678 9012 3456"
          maxLength="19"
        />
        {errors.number && <span className="error">{errors.number}</span>}
      </div>

      <div className="form-group">
        <label>Cardholder Name</label>
        <input
          type="text"
          name="name"
          value={cardDetails.name}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="John Doe"
        />
        {errors.name && <span className="error">{errors.name}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Expiry Date</label>
          <input
            type="text"
            name="expiry"
            value={cardDetails.expiry}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="MM/YY"
            maxLength="5"
          />
          {errors.expiry && <span className="error">{errors.expiry}</span>}
        </div>

        <div className="form-group">
          <label>CVV</label>
          <input
            type="text"
            name="cvv"
            value={cardDetails.cvv}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="123"
            maxLength="4"
          />
          {errors.cvv && <span className="error">{errors.cvv}</span>}
        </div>
      </div>
    </div>
  );
};

export default CardPaymentForm;
