import React, { useState } from "react";
import CustomerRegistration from "./CustomerRegistration";
import RestaurantRegistration from "./RestaurentRegistration";
import "./RegisterPage.css";

const RegisterPage = () => {
  const [activeTab, setActiveTab] = useState("customer");

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="tab-switcher">
          <button
            className={`tab-button ${activeTab === "customer" ? "active" : ""}`}
            onClick={() => setActiveTab("customer")}
          >
            Customer Registration
          </button>
          <button
            className={`tab-button ${
              activeTab === "restaurant" ? "active" : ""
            }`}
            onClick={() => setActiveTab("restaurant")}
          >
            Restaurant Registration
          </button>
        </div>
        <div className="tab-content">
          {activeTab === "customer" ? (
            <CustomerRegistration />
          ) : (
            <RestaurantRegistration />
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
