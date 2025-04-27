const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const adminRoutes = require("./src/modules/admin/routes");
const restaurantRoutes = require("./src/modules/restaurant/routes");
const restaurantItemRoutes = require("./src/modules/restaurant_Item/routes");
const customerRoutes = require("./src/modules/customer/routes");
const orderRoutes = require("./src/modules/order/routes");
const errorHandler = require("./src/middlwares/errorHandler");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose
  .connect(
    "mongodb+srv://senudissanayake18:Golden18@af-db.9i4qf.mongodb.net/?retryWrites=true&w=majority&appName=AF-dB/DStest"
    // "mongodb+srv://root:root@cluster0.spmcifx.mongodb.net/resturent?retryWrites=true&w=majority"//change this to new url
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/v1/api/admins", adminRoutes);
app.use("/v1/api/restaurants", restaurantRoutes);
app.use("/v1/api/restaurant-items", restaurantItemRoutes);
app.use("/v1/api/customers", customerRoutes);
app.use("/v1/api/orders", orderRoutes);

// Error handling middleware
app.use(errorHandler);

const PORT = 8081;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
