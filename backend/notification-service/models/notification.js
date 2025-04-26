import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['email', 'sms'],
        required: true
    },
    to: {
        type: String,
        required: true
    },
    subject: String,
    message: String,
    status: {
        type: String,
        enum: ['sent', 'failed'],
        default: 'sent'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Notification', notificationSchema);