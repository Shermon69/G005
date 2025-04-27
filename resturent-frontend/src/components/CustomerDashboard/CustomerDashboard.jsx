import React, { useEffect, useState } from "react";
import { getAllRestaurants } from "../../api/restaurantApi";
import { getAllItems } from "../../api/restaurantItemApi";
import "./CustomerDashboard.css";
import { Link } from "react-router-dom";

const CustomerDashboard = () => {
  const token = localStorage.getItem("token");
  const [restaurants, setRestaurants] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("restaurants");

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [restaurantsData, itemsData] = await Promise.all([
        getAllRestaurants(token),
        getAllItems(token),
      ]);
      setRestaurants(restaurantsData.data.filter(res=>res.deleteStatus===false)); 
      setItems(itemsData.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const filteredRestaurants = restaurants?.filter(
    (restaurant) =>
      restaurant.name?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      restaurant.address?.toLowerCase().includes(searchTerm?.toLowerCase())
  );

  const filteredItems = items.filter(
    (item) =>
      item.name?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm?.toLowerCase())
  );

  const renderRestaurants = () => {
    if (filteredRestaurants.length === 0) {
      return <p className="no-results">No restaurants found</p>;
    }

    return (
      <div className="restaurant-grid">
        {filteredRestaurants.map((restaurant) => (
          <Link to={`/restaurant/${restaurant._id}`}>
            <div className="restaurant-card" key={restaurant._id}>
              <div className="restaurant-image-container">
                <img
                  src={restaurant.imageUrl}
                  alt={restaurant.name}
                  className="restaurant-image"
                />
                {!restaurant.activeStatus && (
                  <div className="closed-badge">Closed</div>
                )}
              </div>
              <div className="restaurant-details">
                <h3>{restaurant.name}</h3>
                <p className="restaurant-address">{restaurant.address}</p>
                <div className="restaurant-info">
                  <span>25–40 min</span>
                  <span className="dot">•</span>
                  <span>$7.99 Fee</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  };

  const renderItems = () => {
    if (filteredItems.length === 0) {
      return <p className="no-results">No food items found</p>;
    }

    return (
      <div className="items-grid">
        {filteredItems.map((item) => (
          <div className="item-card" key={item._id}>
            <div className="item-image-container">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="item-image"
                style={{ width: "100%", objectFit: "fit", height: "180px"}}
              />
              {!item.inStock && (
                <div className="out-of-stock">Out of stock</div>
              )}
            </div>
            <div className="item-details">
              <h3>{item.name}</h3>
              <p className="item-description">{item.description}</p>
              <div className="item-restaurant-price">
                <span>From {item.restaurant.name}</span>
                <span className="price">${item.price.toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="customer-dashboard">
      <header className="dashboard-header">
        <div className="logo-container">
          <h1>Food Delivery</h1>
        </div>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search for restaurants or dishes"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button className="search-button">
            <i className="search-icon">🔍</i>
          </button>
        </div>
        <div className="user-actions">
          {" "}
          <Link to={"/my-orders"} className="profile-button">
            My Orders
          </Link>
          <Link to={"/profile"} className="profile-button">
            Profile
          </Link>
        </div>
      </header>

      <div className="tabs-container">
        <button
          className={`tab-button ${
            activeTab === "restaurants" ? "active" : ""
          }`}
          onClick={() => setActiveTab("restaurants")}
        >
          Restaurants
        </button>
        <button
          className={`tab-button ${activeTab === "items" ? "active" : ""}`}
          onClick={() => setActiveTab("items")}
        >
          Food Items
        </button>
      </div>

      <div className="dashboard-content">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading...</p>
          </div>
        ) : (
          <>
            <div className="section-header">
              <h2>
                {activeTab === "restaurants"
                  ? "Popular Restaurants"
                  : "Popular Food Items"}
              </h2>
              <div className="section-actions">
                <button className="section-arrow left-arrow">←</button>
                <button className="section-arrow right-arrow">→</button>
              </div>
            </div>

            {activeTab === "restaurants" ? renderRestaurants() : renderItems()}
          </>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;
