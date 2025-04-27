import React, { useState, useEffect } from "react";
import { getAllRestaurants } from "../../api/restaurantApi";
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";
import "./RestaurantManagement.css";
import axios from "axios";

const RestaurantManagement = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  // Fetch all restaurants on component mount
  useEffect(() => {
    fetchRestaurants();
  }, []);

  // Filter restaurants whenever search term changes
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredRestaurants(restaurants);
    } else {
      const filtered = restaurants.filter(
        (restaurant) =>
          restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          restaurant.username
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          restaurant.ownerName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          restaurant.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
          restaurant.restaurantId
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          restaurant.businessRegistrationNumber
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
      setFilteredRestaurants(filtered);
    }
  }, [searchTerm, restaurants]);

  // Fetch all restaurants
  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const response = await getAllRestaurants(token);
      setRestaurants(response.data);
      setFilteredRestaurants(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch restaurants");
      setLoading(false);
      console.error("Error fetching restaurants:", err);
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle status change
  const handleStatusChange = async (restaurant, field, value) => {
    const statusText =
      field === "activeStatus"
        ? value
          ? "activate"
          : "deactivate"
        : value
        ? "mark as deleted"
        : "restore";

    if (
      window.confirm(
        `Are you sure you want to ${statusText} ${restaurant.name}?`
      )
    ) {
      try {
        
   
        await axios.patch("http://localhost:8081/v1/api/restaurants/"+restaurant._id, {activeStatus:value
        })
        const updatedRestaurants = restaurants.map((item) => {
          if (item._id === restaurant._id) {
            return { ...item, [field]: value };
          }
          return item;
        });

        setRestaurants(updatedRestaurants);
        setFilteredRestaurants(
          filteredRestaurants.map((item) => {
            if (item._id === restaurant._id) {
              return { ...item, [field]: value };
            }
            return item;
          })
        );

        alert(`Restaurant ${statusText}d successfully!`);
      } catch (err) {
        alert(`Failed to ${statusText} restaurant`);
        console.error(`Error updating restaurant ${field}:`, err);
      }
    }
  };
  const handleDeleteChange = async (restaurant, field, value) => {
    const statusText =
      field === "activeStatus"
        ? value
          ? "activate"
          : "deactivate"
        : value
        ? "mark as deleted"
        : "restore";

    if (
      window.confirm(
        `Are you sure you want to ${statusText} ${restaurant.name}?`
      )
    ) {
      try {
        
   
        await axios.patch("http://localhost:8081/v1/api/restaurants/"+restaurant._id, {deleteStatus:value
        })
        const updatedRestaurants = restaurants.map((item) => {
          if (item._id === restaurant._id) {
            return { ...item, [field]: value };
          }
          return item;
        });

        setRestaurants(updatedRestaurants);
        setFilteredRestaurants(
          filteredRestaurants.map((item) => {
            if (item._id === restaurant._id) {
              return { ...item, [field]: value };
            }
            return item;
          })
        );

        alert(`Restaurant ${statusText}d successfully!`);
      } catch (err) {
        alert(`Failed to ${statusText} restaurant`);
        console.error(`Error updating restaurant ${field}:`, err);
      }
    }
  };
  // Handle delete restaurant
  const handleDeleteRestaurant = async (restaurant) => {
    if (
      window.confirm(
        `Are you sure you want to permanently delete ${restaurant.name}? This cannot be undone.`
      )
    ) {
      try {
        await axios.patch("http://localhost:8081/v1/api/restaurants/"+restaurant._id, {
          deleteStatus:true
        })
        const updatedRestaurants = restaurants.filter(
          (item) => item._id !== restaurant._id
        );

        setRestaurants(updatedRestaurants);
        setFilteredRestaurants(
          filteredRestaurants.filter((item) => item._id !== restaurant._id)
        );

        alert("Restaurant permanently deleted successfully!");
      } catch (err) {
        alert("Failed to delete restaurant");
        console.error("Error deleting restaurant:", err);
      }
    }
  };

  // Generate PDF report
  const generatePDF = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text("Restaurants Report", 14, 22);
    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

    // Define the table columns
    const tableColumn = ["Name", "Owner", "Restaurant ID", "Address", "Status"];

    // Define the rows data
    const tableRows = [];

    filteredRestaurants.forEach((restaurant) => {
      const restaurantData = [
        restaurant.name,
        restaurant.ownerName,
        restaurant.restaurantId,
        restaurant.address,
        restaurant.activeStatus ? "Active" : "Inactive",
      ];
      tableRows.push(restaurantData);
    });

    // Generate the table
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      styles: {
        fontSize: 10,
        cellPadding: 3,
        overflow: "linebreak",
      },
      headStyles: {
        fillColor: [66, 135, 245],
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240],
      },
      columnStyles: {
        3: { cellWidth: "auto" },
      },
    });

    // Save the PDF
    doc.save("restaurants-report.pdf");
  };

  // If loading
  if (loading) {
    return <div className="loading">Loading restaurants...</div>;
  }

  // If error
  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="restaurant-management-dashboard">
      <h2>Restaurant Management</h2>

      <div className="dashboard-actions">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by name, owner, ID, address..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>
        <div className="action-buttons">
          <button className="btn btn-secondary" onClick={generatePDF}>
            Generate PDF Report
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="restaurant-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Owner</th>
              <th>Restaurant ID</th>
              <th>Business Reg. No.</th>
              <th>Address</th>
              <th>Active Status</th>
              <th>Delete Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRestaurants.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-data">
                  No restaurants found
                </td>
              </tr>
            ) : (
              filteredRestaurants.map((restaurant) => (
                <tr
                  key={restaurant._id}
                  className={!restaurant.activeStatus ? "inactive-row" : ""}
                >
                  <td data-label="Name">{restaurant.name}</td>
                  <td data-label="Owner">{restaurant.ownerName}</td>
                  <td data-label="Restaurant ID">{restaurant.restaurantId}</td>
                  <td data-label="Business Reg. No.">
                    {restaurant.businessRegistrationNumber}
                  </td>
                  <td data-label="Address">{restaurant.address}</td>
                  <td data-label="Active Status">
                    <select
                      className={`status-select ${
                        restaurant.activeStatus ? "active" : "inactive"
                      }`}
                      value={restaurant.activeStatus ? "active" : "inactive"}
                      onChange={(e) =>
                        handleStatusChange(
                          restaurant,
                          "activeStatus",
                          e.target.value === "active"
                        )
                      }
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </td>
                  <td data-label="Delete Status">
                    <select
                      className={`status-select ${
                        restaurant.deleteStatus ? "deleted" : "not-deleted"
                      }`}
                      value={
                        restaurant.deleteStatus ? "deleted" : "not-deleted"
                      }
                      onChange={(e) =>
                        handleDeleteChange(
                          restaurant,
                          "deleteStatus",
                          e.target.value === "deleted"
                        )
                      }
                    >
                      <option value="not-deleted">Not Deleted</option>
                      <option value="deleted">Marked as Deleted</option>
                    </select>
                  </td>
                  <td data-label="Actions" className="action-cell">
                    <button
                      className="btn-action btn-delete"
                      onClick={() => handleDeleteRestaurant(restaurant)}
                    >
                      Permanently Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="status-legend">
        <div className="legend-item">
          <span className="legend-color active"></span>
          <span>Active</span>
        </div>
        <div className="legend-item">
          <span className="legend-color inactive"></span>
          <span>Inactive</span>
        </div>
        <div className="legend-item">
          <span className="legend-color deleted"></span>
          <span>Marked as Deleted</span>
        </div>
      </div>
    </div>
  );
};

export default RestaurantManagement;
