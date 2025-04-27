const express = require("express");
const router = express.Router();
const customerController = require("./controller.js");
const { authenticateCustomer } = require("../../middlwares/auth.middleware.js");

// Public
router.post("/register", customerController.register);
router.post("/login", customerController.login);

// Authenticated
router.get("/profile", authenticateCustomer, customerController.getProfile);
router.put("/profile", authenticateCustomer, customerController.updateProfile);
router.delete(
  "/profile",
  authenticateCustomer,
  customerController.deleteProfile
);
router.put(
  "/change-password",
  authenticateCustomer,
  customerController.changePassword
);

// Admin-level (optional)
router.get("/all", authenticateCustomer, customerController.getAllCustomers);

module.exports = router;
