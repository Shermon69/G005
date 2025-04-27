import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getRestaurantById } from "../../api/restaurantApi";
import { getAllItems } from "../../api/restaurantItemApi";
import "./SingleRestaurant.css";
import ItemCard from "../common/ItemCard";
import NavBar from "../common/NavBar";

const SingleRestaurant = () => {
  const token = localStorage.getItem("token");
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const setInitialData = async () => {
    try {
      setLoading(true);
      const [restaurantData, itemsData] = await Promise.all([
        getRestaurantById(id),
        getAllItems(token),
      ]);

      setRestaurant(restaurantData.data);

      // Filter items by restaurant ID
      const restaurantItems = itemsData.data.filter(
        (item) => item.restaurant._id === id
      );

      setItems(restaurantItems);
      setFilteredItems(restaurantItems);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load restaurant data. Please try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    setInitialData();
  }, [id]);

  useEffect(() => {
    if (items.length > 0 && searchTerm) {
      const filtered = items.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredItems(filtered);
    } else {
      setFilteredItems(items);
    }
  }, [searchTerm, items]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Loading restaurant details...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  if (!restaurant) {
    return <div className="error-container">Restaurant not found</div>;
  }

  return (
    <div className="restaurant-container">
      <NavBar id={id} />
      <div className="restaurant-hero" style={{ '--restaurant-image': `url(${restaurant.imageUrl})` }}>
        <div className="restaurant-info">
          <h1 style={{ color: "white" }}>{restaurant.name}</h1>
        </div>
      </div>

      <div className="category-tabs">
        <div className="tab active">Picked For You</div>
      </div>

      <div className="menu-section">
        <h2>Picked For You</h2>

        <div className="search-container">
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>

        {restaurant?.activeStatus ? (
          <div className="items-grid">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <ItemCard
                  key={item._id}
                  item={item}
                  restaurantId={restaurant._id}
                  onCartUpdate={(updatedCart) => {
                    console.dir(updatedCart);
                  }}
                />
              ))
            ) : (
              <div className="no-items">
                {searchTerm
                  ? "No items match your search"
                  : "No items available"}
              </div>
            )}{" "}
          </div>
        ) : (
          <div className="no-items">Resturent closed</div>
        )}
      </div>

      <div className="checkout-bar">
        <button
          onClick={() => {
            navigate("/cart/" + id);
          }}
          disabled={!restaurant?.activeStatus}
          className="checkout-button"
        >
          Checkout
        </button>
        <p className="basket-message">
          Add items to your basket and they'll appear here
        </p>
      </div>
    </div>
  );
};

export default SingleRestaurant;
