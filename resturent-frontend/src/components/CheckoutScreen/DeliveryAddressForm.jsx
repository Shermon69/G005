import React from "react";

const DeliveryAddressForm = ({ address, setAddress, error }) => {
  return (
    <div className="address-form">
      <h3>Delivery Address</h3>
      <div className="form-group">
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter your full delivery address"
          rows="4"
        />
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default DeliveryAddressForm;
