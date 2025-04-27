import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RestaurantItems from "./RestaurantItems";
import RestaurantOrders from "./RestaurantOrders";
import "./RestaurantDashboard.css";
import {
  getRestaurantProfile,
  updateRestaurantProfile,
} from "../../api/restaurantApi";
import ResturantProfile from "./ResturantProfile";

const RestaurantDashboard = () => {
  const token = localStorage.getItem("token");
  const [activeTab, setActiveTab] = useState("items");
  const [restuarant, setRestuarant] = useState();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const markUnavailable = async () => {
    await updateRestaurantProfile(
      { activeStatus: !restuarant.activeStatus },
      token
    );
    await getRestaurantProfile(token)
      .then((restuarant) => setRestuarant(restuarant.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    getRestaurantProfile(token)
      .then((restuarant) => setRestuarant(restuarant.data))
      .catch((err) => console.error(err));
  }, [token]);

  return (
    <div className="restaurant-dashboard" style={{ padding: 0, margin: 0 }}>
      <aside className="sidebar">
        <h2 className="logo" style={{ color: "white" }}>
          Dashboard
        </h2>
        <nav className="nav-links">
          <button
            className={activeTab === "profile" ? "active" : ""}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>
          <button
            className={activeTab === "items" ? "active" : ""}
            onClick={() => setActiveTab("items")}
          >
            Items
          </button>
          <button
            className={activeTab === "orders" ? "active" : ""}
            onClick={() => setActiveTab("orders")}
          >
            Orders
          </button>
          <button
            onClick={() => {
              const isConfirmed = window.confirm(
                restuarant?.activeStatus
                  ? "Are you sure you want to mark this restaurant as inactive?"
                  : "Are you sure you want to mark this restaurant as active?"
              );

              if (isConfirmed) {
                markUnavailable();
              }
            }}
          >
            {restuarant?.activeStatus ? "Mark Inactive" : "Mark Active"}
          </button>
        </nav>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <main className="main-content">
        {activeTab === "items" ? (
          <RestaurantItems token={token} />
        ) : activeTab === "profile" ? (
          <ResturantProfile />
        ) : (
          <RestaurantOrders token={token} />
        )}
      </main>
    </div>
  );
};

export default RestaurantDashboard;
