const express = require("express");
const router = express.Router();
const orderController = require("./controller.js");
const {
  authenticateCustomer,
  authenticate,
} = require("../../middlwares/auth.middleware.js");

// Customer routes
router.post("/", authenticateCustomer, orderController.createOrder);
router.get(
  "/my-orders",
  authenticateCustomer,
  orderController.getCustomerOrders
);

// Admin routes
router.get("/", authenticate, orderController.getAllOrders);
router.get("/:id", authenticate, orderController.getOrder);
router.put("/:id/status", authenticate, orderController.updateStatus);
router.delete("/:id", authenticate, orderController.deleteOrder);
router.get(
  "/restaurant/:restaurantId",
  authenticate,
  orderController.getByRestaurantId
);
module.exports = router;
