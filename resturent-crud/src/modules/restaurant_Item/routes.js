const express = require("express");
const itemController = require("./controller");
const { authenticate } = require("../../middlwares/auth.middleware");

const router = express.Router();

// Public routes
router.get("/", authenticate, itemController.getAllItems);
router.get("/:id", authenticate, itemController.getItem);
router.get(
  "/restaurant/:restaurantId",
  authenticate,
  itemController.getItemsByRestaurantId
);
router.get(
  "/restaurant/:restaurantId/count",
  authenticate,
  itemController.getItemsCount
);

// Restaurant owner routes
router.get("/my/items", authenticate, itemController.getMyItems);

router.post("/", authenticate, itemController.createItem);

router.put("/:id", authenticate, itemController.updateItem);

router.patch("/:id/in-stock", authenticate, itemController.toggleInStock);

router.patch(
  "/:id/delete-status",
  authenticate,
  itemController.setDeleteStatus
);

router.delete("/:id", authenticate, itemController.deleteItem);

module.exports = router;
