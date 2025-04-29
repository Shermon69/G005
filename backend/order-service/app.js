const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const orderRoutes = require("./src/modules/order/routes");
const errorHandler = require("./src/middlwares/errorHandler");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose
  .connect(
    "mongodb+srv://vihanga:731ViiWA@vihaaitp.zd6bn.mongodb.net/order-service?retryWrites=true&w=majority",
  )
  .then(() => console.log("Order Service: Connected to MongoDB"))
  .catch((err) => console.error("Order Service MongoDB connection error:", err));

// Routes
app.use("/v1/api/orders", orderRoutes);

// Error handling middleware
app.use(errorHandler);

const PORT = 8082; // Different port from restaurant service
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Order Service running on port ${PORT}`);
});

module.exports = app;