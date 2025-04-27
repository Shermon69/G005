const express = require("express");
const router = express.Router();
const restaurantController = require("./controller.js");
const {
  authenticate,
  authenticateRestaurant,
} = require("../../middlwares/auth.middleware.js");

// Public routes
router.post("/register", restaurantController.register);
router.post("/login", restaurantController.login);

// Protected routes
router.get("/profile", authenticateRestaurant, restaurantController.getProfile);
router.get("/:id", restaurantController.getRestaurantById);
router.put(
  "/profile",
  authenticateRestaurant,
  restaurantController.updateProfile
);
router.patch(
  "/:id",
  restaurantController.updateRestaurant
);
router.delete(
  "/profile",
  authenticateRestaurant,
  restaurantController.deleteProfile
);
router.get("/", authenticate, restaurantController.getAllRestaurants);
router.put(
  "/change-password",
  authenticate,
  restaurantController.changePassword
);

module.exports = router;
