const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { authenticate } = require('../../middlwares/auth.middleware');

// Customer routes
router.post('/', authenticate, controller.createOrder);
router.get('/customer', authenticate, controller.getCustomerOrders);
router.get('/:id', authenticate, controller.getOrder);

// Restaurant admin routes
router.patch('/:id/status', authenticate, controller.updateOrderStatus);

// Payment processing
router.post('/:id/payment', authenticate, controller.processPayment);

module.exports = router;