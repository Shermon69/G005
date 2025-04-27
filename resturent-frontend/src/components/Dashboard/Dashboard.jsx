import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import AdminManagement from "./AdminManagement";
import RestaurantManagement from "./RestaurantManagement";

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("admin");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("id");

    if (!token || !id) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2 className="logo">Admin Panel</h2>
        <ul className="sidebar-menu">
          <li
            className={activeSection === "admin" ? "active" : ""}
            onClick={() => setActiveSection("admin")}
          >
            Admin Management
          </li>
          <li
            className={activeSection === "restaurant" ? "active" : ""}
            onClick={() => setActiveSection("restaurant")}
          >
            Restaurant Management
          </li>
          <li
            onClick={() => {
              localStorage.clear();
              window.location.href = "/";
            }}
          >
            Logout
          </li>
        </ul>
      </aside>

      <main className="main-content">
        {activeSection === "admin" ? (
          <AdminManagement />
        ) : (
          <RestaurantManagement />
        )}
      </main>
    </div>
  );
};

export default Dashboard;
