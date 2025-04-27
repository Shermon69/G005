const itemService = require("./service.js");

exports.createItem = async (req, res) => {
  try {
    const itemData = req.body;

    // If the request is coming from a restaurant, set the restaurant ID
    if (req.restaurant) {
      itemData.restaurant = req.restaurant.id;
    }

    const newItem = await itemService.createItem(itemData);
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.getAllItems = async (req, res) => {
  try {
    const items = await itemService.getAllItems();
    res.status(200).json(items);
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.getItem = async (req, res) => {
  try {
    const item = await itemService.getItemById(req.params.id);
    res.status(200).json(item);
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.getItemsByRestaurantId = async (req, res) => {
  try {
    const restaurantId = req.params.restaurantId;
    const includeDeleted = req.query.includeDeleted === "true";

    const items = await itemService.getItemsByRestaurantId(
      restaurantId,
      includeDeleted
    );

    res.status(200).json(items);
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.getMyItems = async (req, res) => {
  try {
    if (!req.restaurant) {
      return res.status(401).json({
        status: "fail",
        message: "You are not logged in as a restaurant",
      });
    }

    const includeDeleted = req.query.includeDeleted === "true";
    const items = await itemService.getItemsByRestaurantId(
      req.restaurant.id,
      includeDeleted
    );

    res.status(200).json(items);
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.updateItem = async (req, res) => {
  try {
    // Check if current user can update this item
    if (req.restaurant) {
      const item = await itemService.getItemById(req.params.id);

      // If the item doesn't belong to this restaurant
      if (item.restaurant._id.toString() !== req.restaurant.id) {
        return res.status(403).json({
          status: "fail",
          message: "You are not authorized to update this item",
        });
      }
    }

    const updatedItem = await itemService.updateItem(req.params.id, req.body);

    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.toggleInStock = async (req, res) => {
  try {
    // Check if current user can update this item
    if (req.restaurant) {
      const item = await itemService.getItemById(req.params.id);

      // If the item doesn't belong to this restaurant
      if (item.restaurant._id.toString() !== req.restaurant.id) {
        return res.status(403).json({
          status: "fail",
          message: "You are not authorized to update this item",
        });
      }
    }

    const updatedItem = await itemService.toggleInStock(req.params.id);

    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.setDeleteStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (typeof status !== "boolean") {
      return res.status(400).json({
        status: "fail",
        message: "Status must be a boolean value",
      });
    }

    // Check if current user can update this item
    if (req.restaurant) {
      const item = await itemService.getItemById(req.params.id);

      // If the item doesn't belong to this restaurant
      if (item.restaurant._id.toString() !== req.restaurant.id) {
        return res.status(403).json({
          status: "fail",
          message: "You are not authorized to update this item",
        });
      }
    }

    const updatedItem = await itemService.setDeleteStatus(
      req.params.id,
      status
    );

    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    // Check if current user can delete this item
    if (req.restaurant) {
      const item = await itemService.getItemById(req.params.id);

      // If the item doesn't belong to this restaurant
      if (item.restaurant._id.toString() !== req.restaurant.id) {
        return res.status(403).json({
          status: "fail",
          message: "You are not authorized to delete this item",
        });
      }
    }

    await itemService.permanentlyDeleteItem(req.params.id);

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.getItemsCount = async (req, res) => {
  try {
    const restaurantId = req.params.restaurantId;
    const count = await itemService.getItemsCountByRestaurant(restaurantId);

    res.status(200).json({
      status: "success",
      data: { count },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};
