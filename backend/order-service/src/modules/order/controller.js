const orderService = require('./service');
const { sendOrderConfirmation } = require('../../utils/notificationUtils');

exports.createOrder = async (req, res, next) => {
  try {
    const orderData = {
      ...req.body,
      customerId: req.user.id
    };
    
    const order = await orderService.createOrder(orderData);
    
    // Send notifications
    await sendOrderConfirmation(order);
    
    res.status(201).json({
      success: true,
      data: order
    });
  } catch (err) {
    next(err);
  }
};

exports.getOrder = async (req, res, next) => {
  try {
    const order = await orderService.getOrderById(req.params.id);
    res.status(200).json({
      success: true,
      data: order
    });
  } catch (err) {
    next(err);
  }
};

exports.getCustomerOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getOrdersByCustomer(req.user.id);
    res.status(200).json({
      success: true,
      data: orders
    });
  } catch (err) {
    next(err);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const order = await orderService.updateOrderStatus(
      req.params.id, 
      req.body.status
    );
    res.status(200).json({
      success: true,
      data: order
    });
  } catch (err) {
    next(err);
  }
};

exports.processPayment = async (req, res, next) => {
  try {
    const result = await orderService.processPayment(
      req.params.id,
      req.body.paymentDetails
    );
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (err) {
    next(err);
  }
};