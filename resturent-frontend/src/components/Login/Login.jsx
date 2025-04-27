import React, { useState } from "react";
import "./Login.css";
import { loginAdmin } from "../../api/adminApi";
import { loginRestaurant } from "../../api/restaurantApi";
import { loginCustomer } from "../../api/customerApi";
import { Link } from "react-router-dom";

const Login = () => {
  const [activeTab, setActiveTab] = useState("customer");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleTabChange = (tab) => {
    setFormData({ username: "", email: "", password: "" });
    setError("");
    setActiveTab(tab);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (activeTab === "admin") {
        const credentials = {
          employeeNumber: formData.username,
          password: formData.password,
        };
        const response = await loginAdmin(credentials);
        const { token, admin } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("id", admin._id);
        localStorage.setItem("userType", "admin");
        alert("Admin login successful!");
        window.location.href = "/dashboard";
      } else if (activeTab === "restaurant") {
        const credentials = {
          username: formData.username,
          password: formData.password,
        };
        const response = await loginRestaurant(credentials);
        const { token, restaurant } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("id", restaurant._id);
        localStorage.setItem("userType", "restaurant");
        alert("Restaurant login successful!");
        window.location.href = "/restaurent-dashboard";
      } else {
        // Customer login
        const credentials = {
          email: formData.email,
          password: formData.password,
        };
        const response = await loginCustomer(credentials);
        const { token, customer } = response.data;

        localStorage.setItem("token", token);
        localStorage.setItem("id", customer._id);
        localStorage.setItem("userType", "customer");
        alert("Customer login successful!");
        window.location.href = "/customer-dashboard";
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(
        error?.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="tab-switcher">
          <button
            className={activeTab === "customer" ? "active" : ""}
            onClick={() => handleTabChange("customer")}
          >
            Customer Login
          </button>
          <button
            className={activeTab === "restaurant" ? "active" : ""}
            onClick={() => handleTabChange("restaurant")}
          >
            Restaurant Login
          </button>
          <button
            className={activeTab === "admin" ? "active" : ""}
            onClick={() => handleTabChange("admin")}
          >
            Admin Login
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
          <h2>
            {activeTab === "admin"
              ? "Admin Login"
              : activeTab === "restaurant"
              ? "Restaurant Login"
              : "Customer Login"}
          </h2>

          {activeTab !== "customer" ? (
            <div className="form-group">
              <label htmlFor="username">
                {activeTab === "admin" ? "Employee Number" : "Username"}
              </label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder={
                  activeTab === "admin"
                    ? "Enter employee number"
                    : "Enter username"
                }
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
          ) : (
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {activeTab === "customer" && (
          <div className="register-link">
            <p>
              Don't have an account? <Link to="/register">Register Now</Link>
            </p>
          </div>
        )}

        {activeTab === "restaurant" && (
          <div className="register-link">
            <p>
              Need a restaurant account?{" "}
              <Link to="/register">Register Your Restaurant</Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
