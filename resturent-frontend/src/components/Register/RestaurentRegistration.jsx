import React, { useState } from "react";
import { registerRestaurant } from "../../api/restaurantApi";

const RestaurantRegistration = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    address: "",
    password: "",
    confirmPassword: "",
    ownerName: "",
    businessRegistrationNumber: "",
    imageUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      setLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...restaurantData } = formData;
      console.log(confirmPassword);
      // Generate a unique restaurant ID
      const restaurantId = `REST-${Date.now().toString().slice(-6)}`;

      await registerRestaurant({
        ...restaurantData,
        restaurantId,
      });

      setSuccess("Registration successful! Your account is pending approval.");
      setFormData({
        name: "",
        username: "",
        address: "",
        password: "",
        confirmPassword: "",
        ownerName: "",
        businessRegistrationNumber: "",
        imageUrl: "",
      });
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registration-form">
      <h2>Register Your Restaurant</h2>

      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Restaurant Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Your Restaurant Name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            placeholder="restaurant_username"
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">Restaurant Address</label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            placeholder="123 Restaurant St, City, Country"
          />
        </div>

        <div className="form-group">
          <label htmlFor="ownerName">Owner Name</label>
          <input
            type="text"
            id="ownerName"
            name="ownerName"
            value={formData.ownerName}
            onChange={handleChange}
            required
            placeholder="Restaurant Owner's Name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="businessRegistrationNumber">
            Business Registration Number
          </label>
          <input
            type="text"
            id="businessRegistrationNumber"
            name="businessRegistrationNumber"
            value={formData.businessRegistrationNumber}
            onChange={handleChange}
            required
            placeholder="BRN12345678"
          />
        </div>

        <div className="form-group">
          <label htmlFor="imageUrl">Restaurant Image URL (Optional)</label>
          <input
            type="url"
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="https://example.com/restaurant-image.jpg"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Minimum 8 characters"
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            placeholder="Confirm your password"
          />
        </div>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "Submitting..." : "Register Restaurant"}
        </button>
      </form>

      <p className="login-link">
        Already registered? <a href="/">Log in</a>
      </p>
    </div>
  );
};

export default RestaurantRegistration;
