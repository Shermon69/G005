import express from 'express';
import {
  assignDelivery,
  updateDeliveryStatus,
  getDeliveries,
} from '../controllers/deliveryController.js';
import { deliveryAuthMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/my-deliveries', deliveryAuthMiddleware, getDeliveries);
router.post('/assign', deliveryAuthMiddleware, assignDelivery);
router.put('/:id', deliveryAuthMiddleware, updateDeliveryStatus);

export default router;
