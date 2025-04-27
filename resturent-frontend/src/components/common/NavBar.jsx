import React from "react";
import { Link } from "react-router-dom";

const NavBar = ({ id }) => {
  return (
    <header className="dashboard-header">
      <div className="logo-container">
        <Link to={"/customer-dashboard"}>
          {" "}
          <h1>Food Delivery</h1>
        </Link>
      </div>
      <div className="search-container"></div>
      <div className="user-actions">
        <Link to={"/my-orders"} className="profile-button">
          My Orders
        </Link>
        {id && (
          <Link to={"/cart/" + id} className="cart-button">
            Cart
          </Link>
        )}
        <Link to={"/profile"} className="profile-button">
          Profile
        </Link>
      </div>
    </header>
  );
};

export default NavBar;
