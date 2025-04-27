import React, { useEffect, useState } from "react";
import {
  getRestaurantOrders,
  updateOrderStatus,
  deleteOrder,
} from "../../api/orderApi";
import "./RestaurantOrders.css";

const RestaurantOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const token = localStorage.getItem("token");
  const restaurantId = localStorage.getItem("id");

  const setInitialData = async () => {
    try {
      const response = await getRestaurantOrders(restaurantId, token);
      setOrders(response.data);
      setFilteredOrders(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setInitialData();
  }, [token]);

  useEffect(() => {
    filterOrders();
  }, [searchTerm, filterStatus, orders]);

  const filterOrders = () => {
    let result = [...orders];

    // Filter by search term
    if (searchTerm) {
      result = result.filter(
        (order) =>
          order.customer.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          order.customer.email
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          order.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order._id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (filterStatus !== "all") {
      result = result.filter((order) => order.status === filterStatus);
    }

    setFilteredOrders(result);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus, token);
      setOrders(
        orders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await deleteOrder(orderId, token);
        setOrders(orders.filter((order) => order._id !== orderId));
      } catch (error) {
        console.error("Failed to delete order:", error);
      }
    }
  };

  return (
    <div className="restaurant-orders">
      <h1>Restaurant Orders</h1>

      <div className="filters">
        <input
          type="text"
          placeholder="Search by customer, address or ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="status-filter"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="preparing">Preparing</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {filteredOrders.length === 0 ? (
        <p className="no-orders">No orders found</p>
      ) : (
        <div className="orders-list">
          {filteredOrders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <h3>Order #{order._id.slice(-6)}</h3>
                <span className={`status ${order.status}`}>{order.status}</span>
              </div>

              <div className="customer-info">
                <p>
                  <strong>Customer:</strong> {order.customer.name}
                </p>
                <p>
                  <strong>Email:</strong> {order.customer.email}
                </p>
                <p>
                  <strong>Address:</strong> {order.address}
                </p>
                <p>
                  <strong>Order Date:</strong>{" "}
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="order-items">
                <h4>Items:</h4>
                <ul>
                  {order.orderedItems.map((item, index) => (
                    <li key={index}>
                      {item.quantity} x {item.item.name} - $
                      {item.item.price.toFixed(2)}
                    </li>
                  ))}
                </ul>
                <p className="total">
                  <strong>Total:</strong> ${order.totalBilled.toFixed(2)}
                </p>
              </div>

              <div className="order-actions">
                <select
                  value={order.status}
                  onChange={(e) =>
                    handleStatusChange(order._id, e.target.value)
                  }
                  className="status-select"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="preparing">Preparing</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                <button
                  onClick={() => handleDeleteOrder(order._id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantOrders;
