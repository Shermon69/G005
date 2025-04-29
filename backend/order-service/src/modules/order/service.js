const Order = require("./model.js");
const axios = require('axios'); // For inter-service communication

// Configure the restaurant service URL
const RESTAURANT_SERVICE_URL = process.env.RESTAURANT_SERVICE_URL || "http://restaurant-service:8081";

exports.createOrder = async (orderData) => {
  try {
    // Verify restaurant exists by calling restaurant service
    const restaurantResponse = await axios.get(
      `${RESTAURANT_SERVICE_URL}/v1/api/restaurants/${orderData.restaurantId}`
    );
    
    const restaurant = restaurantResponse.data;
    
    // Verify items exist by calling restaurant service
    const itemIds = orderData.orderedItems.map(item => item.itemId);
    const itemsResponse = await axios.post(
      `${RESTAURANT_SERVICE_URL}/v1/api/restaurant-items/verify`,
      { itemIds }
    );
    
    const items = itemsResponse.data;
    
    // Denormalize important data
    const order = new Order({
      ...orderData,
      restaurantName: restaurant.name,
      orderedItems: orderData.orderedItems.map(item => {
        const itemDetails = items.find(i => i._id === item.itemId.toString());
        return {
          itemId: item.itemId,
          name: itemDetails.name,
          price: itemDetails.price,
          quantity: item.quantity
        };
      })
    });
    
    return await order.save();
  } catch (error) {
    throw error;
  }
};

// Other service methods remain similar but may need to call restaurant service for additional data
exports.getOrderById = async (id) => {
  return await Order.findById(id);
};

exports.getOrdersByCustomer = async (customerId) => {
  return await Order.find({ customer: customerId }).sort({ createdAt: -1 });
};

exports.getOrdersByRestaurantId = async (restaurantId) => {
  return await Order.find({ restaurantId }).sort({ createdAt: -1 });
};

exports.updateOrderStatus = async (id, status) => {
  return await Order.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );
};