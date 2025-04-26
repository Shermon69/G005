import express from 'express';
import { createPayment, updateTransactionStatus, getAllTransactions, handleStripeWebhook, getMyTransactions } from '../controllers/paymentController.js';
import { verifyToken, idAdmin } from '../middlewares/authMiddleware.js'

const router = express.Router();

router.post('/create-payment', createPayment);
router.patch('/:id/status', updateTransactionStatus); //for manually updating the status
router.get('/', verifyToken, idAdmin, getAllTransactions);
router.get('/my-transactions', verifyToken, getAllTransactions);

//stripe webhook
router.post('/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);


export default router;

