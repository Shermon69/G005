const orderService = require("./service.js");

exports.createOrder = async (req, res, next) => {
  try {
    const orderData = {
      ...req.body,
      customer: req.customer.id,
    };
    const order = await orderService.createOrder(orderData);
    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

exports.getOrder = async (req, res, next) => {
  try {
    const order = await orderService.getOrderById(req.params.id);
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

exports.getCustomerOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getOrdersByCustomer(req.customer.id);
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getAllOrders();
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const updated = await orderService.updateOrderStatus(
      req.params.id,
      req.body.status
    );
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

exports.deleteOrder = async (req, res, next) => {
  try {
    const deleted = await orderService.softDeleteOrder(req.params.id);
    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
      order: deleted,
    });
  } catch (error) {
    next(error);
  }
};
exports.getByRestaurantId = async (req, res, next) => {
  try {
    const orders = await orderService.getOrdersByRestaurantId(
      req.params.restaurantId
    );
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};
