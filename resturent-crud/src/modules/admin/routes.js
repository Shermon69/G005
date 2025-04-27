const express = require("express");
const router = express.Router();
const adminController = require("./controller.js");
const { authenticate } = require("../../middlwares/auth.middleware.js");

// Public routes
router.post("/register", authenticate, adminController.register);
router.post("/login", adminController.login);

// Protected routes
router.get("/profile", authenticate, adminController.getProfile);
router.put("/profile", authenticate, adminController.updateProfile);
router.delete("/profile", authenticate, adminController.deleteProfile);

// Admin-only routes (example)
router.get("/all", authenticate, adminController.getAllAdmins);

router.put("/change-password", authenticate, adminController.changePassword);

module.exports = router;
