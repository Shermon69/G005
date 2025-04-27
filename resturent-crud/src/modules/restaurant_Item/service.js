const RestaurantItem = require("./model.js");
const Restaurant = require("../restaurant/model.js");

exports.createItem = async (itemData) => {
  try {
    // Check if restaurant exists
    const restaurant = await Restaurant.findById(itemData.restaurant);
    if (!restaurant) {
      throw new Error("Restaurant not found");
    }

    // Create the new item
    const newItem = new RestaurantItem(itemData);
    await newItem.save();
    return newItem;
  } catch (error) {
    throw error;
  }
};

exports.getAllItems = async () => {
  try {
    return await RestaurantItem.find({ deleteStatus: false })
      .populate("restaurant", "name restaurantId")
      .sort({ createdAt: -1 });
  } catch (error) {
    throw error;
  }
};

exports.getItemById = async (itemId) => {
  try {
    const item = await RestaurantItem.findById(itemId)
      .populate("restaurant", "name restaurantId")
      .exec();

    if (!item) {
      throw new Error("Item not found");
    }

    return item;
  } catch (error) {
    throw error;
  }
};

exports.getItemsByRestaurantId = async (
  restaurantId,
  includeDeleted = false
) => {
  try {
    // Validate that restaurant exists
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      throw new Error("Restaurant not found");
    }

    // Create query object
    const query = { restaurant: restaurantId };

    // Only include active items unless specified
    if (!includeDeleted) {
      query.deleteStatus = false;
    }

    return await RestaurantItem.find(query).sort({ createdAt: -1 });
  } catch (error) {
    throw error;
  }
};

exports.updateItem = async (itemId, updateData) => {
  try {
    const item = await RestaurantItem.findById(itemId);
    if (!item) {
      throw new Error("Item not found");
    }

    // If updating restaurant reference, verify the restaurant exists
    if (updateData.restaurant) {
      const restaurant = await Restaurant.findById(updateData.restaurant);
      if (!restaurant) {
        throw new Error("Restaurant not found");
      }
    }

    // Update the item
    const updatedItem = await RestaurantItem.findByIdAndUpdate(
      itemId,
      { ...updateData, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    return updatedItem;
  } catch (error) {
    throw error;
  }
};

exports.toggleInStock = async (itemId) => {
  try {
    const item = await RestaurantItem.findById(itemId);
    if (!item) {
      throw new Error("Item not found");
    }

    item.inStock = !item.inStock;
    item.updatedAt = Date.now();
    await item.save();

    return item;
  } catch (error) {
    throw error;
  }
};

exports.setDeleteStatus = async (itemId, status) => {
  try {
    const item = await RestaurantItem.findById(itemId);
    if (!item) {
      throw new Error("Item not found");
    }

    item.deleteStatus = status;
    item.updatedAt = Date.now();
    await item.save();

    return item;
  } catch (error) {
    throw error;
  }
};

exports.permanentlyDeleteItem = async (itemId) => {
  try {
    const item = await RestaurantItem.findByIdAndDelete(itemId);

    if (!item) {
      throw new Error("Item not found");
    }

    return item;
  } catch (error) {
    throw error;
  }
};

exports.getItemsCountByRestaurant = async (restaurantId) => {
  try {
    return await RestaurantItem.countDocuments({
      restaurant: restaurantId,
      deleteStatus: false,
    });
  } catch (error) {
    throw error;
  }
};
