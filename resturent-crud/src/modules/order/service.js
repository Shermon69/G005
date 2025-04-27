const Order = require("./model.js");
const mongoose = require("mongoose");

exports.createOrder = async (orderData) => {
  const order = new Order(orderData);
  return await order.save();
};

exports.getOrderById = async (id) => {
  return await Order.findById(id)
    .populate("customer")
    .populate("orderedItems.item");
};

exports.getOrdersByCustomer = async (customerId) => {
  return await Order.find({
    customer: customerId,
    deleteStatus: false,
  }).populate("orderedItems.item");
};

exports.getAllOrders = async () => {
  return await Order.find({ deleteStatus: false })
    .populate("customer")
    .populate("orderedItems.item");
};

exports.updateOrderStatus = async (id, status) => {
  return await Order.findByIdAndUpdate(id, { status }, { new: true });
};

exports.softDeleteOrder = async (id) => {
  return await Order.findByIdAndUpdate(
    id,
    { deleteStatus: true },
    { new: true }
  );
};
exports.getOrdersByRestaurantId = async (restaurantId) => {
  const RestaurantItem = mongoose.model("RestaurantItem");
  const restaurantItems = await RestaurantItem.find({
    restaurant: restaurantId,
  });
  const itemIds = restaurantItems.map((item) => item._id);

  // Then find orders that contain any of these items
  return await Order.find({
    "orderedItems.item": { $in: itemIds },
    deleteStatus: false,
  })
    .populate("customer")
    .populate("orderedItems.item");
};
