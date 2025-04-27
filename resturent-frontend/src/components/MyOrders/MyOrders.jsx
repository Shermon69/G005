import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyOrders } from "../../api/orderApi";
import NavBar from "../common/NavBar";

const MyOrders = () => {
  const token = localStorage.getItem("token");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch orders on mount
  useEffect(() => {
    if (!token) {
      navigate("/");
    } else {
      const fetchOrders = async () => {
        try {
          setLoading(true);
          const response = await getMyOrders(token);
          setOrders(response.data);
        } catch (err) {
          console.error(err);
          alert("Failed to load orders. Please try again.");
        } finally {
          setLoading(false);
        }
      };

      fetchOrders();
    }
  }, [token, navigate]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <NavBar />
        <p style={{ fontSize: "1.2rem", color: "#555" }}>
          Loading your orders...
        </p>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <NavBar />
        <p style={{ fontSize: "1.2rem", color: "#777" }}>No orders found.</p>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "50px auto",
        padding: "30px",
        backgroundColor: "#ffffff",
        border: "1px solid #e0e0e0",
        borderRadius: "12px",
        boxShadow: "0 6px 12px rgba(0, 0, 0, 0.08)",
      }}
    >
      <NavBar />
      <h1
        style={{
          textAlign: "center",
          marginBottom: "30px",
          fontSize: "2rem",
          color: "#2c3e50",
          fontWeight: "600",
          letterSpacing: "1px",
        }}
      >
        My Orders
      </h1>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "20px",
          fontSize: "1rem",
        }}
      >
        <thead>
          <tr
            style={{
              backgroundColor: "#f8f9fa",
              borderBottom: "1px solid #f0f0f0",
            }}
          >
            <th style={tableHeaderStyle}>Order ID</th>
            <th style={tableHeaderStyle}>Items</th>
            <th style={tableHeaderStyle}>Quantity</th>
            <th style={tableHeaderStyle}>Total Billed</th>
            <th style={tableHeaderStyle}>Delivery Address</th>
            <th style={tableHeaderStyle}>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id} style={rowStyle}>
              <td style={cellStyle}>{order._id}</td>
              <td style={cellStyle}>
                <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
                  {order.orderedItems.map((item) => (
                    <li
                      key={item._id}
                      style={{
                        marginBottom: "5px",
                        fontSize: "0.9rem",
                      }}
                    >
                      {item.item.name} - ${item.item.price.toFixed(2)}
                    </li>
                  ))}
                </ul>
              </td>
              <td style={cellStyle}>
                <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
                  {order.orderedItems.map((item) => (
                    <li
                      key={item._id}
                      style={{
                        marginBottom: "5px",
                        fontSize: "0.9rem",
                      }}
                    >
                      {item.quantity}
                    </li>
                  ))}
                </ul>
              </td>
              <td style={cellStyle}>Rs.{order.totalBilled.toFixed(2)}</td>
              <td style={cellStyle}>{order.address}</td>
              <td style={cellStyle}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Reusable Styles
const tableHeaderStyle = {
  padding: "12px 15px",
  textAlign: "left",
  fontWeight: "600",
  color: "#333",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  fontSize: "0.9rem",
  borderBottom: "1px solid #f0f0f0",
};

const rowStyle = {
  borderBottom: "1px solid #f0f0f0",
};

const cellStyle = {
  padding: "12px 15px",
  verticalAlign: "middle",
};

export default MyOrders;
