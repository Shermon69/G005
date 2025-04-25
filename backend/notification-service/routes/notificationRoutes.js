import express from 'express';
import { sendEmail, sendSMS, notifyUser } from '../controllers/notificationController.js';

const router = express.Router();

router.post('/send-email', sendEmail);
router.post('/send-sms', sendSMS);

router.post('/notify-user', notifyUser);

export default router;