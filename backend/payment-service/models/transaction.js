import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },

    email: {
        type: String,
        require: true
    },

    phone: {
        type: String,
        required: true
    },

    amount: {
        type: Number,
        required: true
    },

    currency: {
        type: String,
        default: 'LKR'
    },

    orderId: {
        type: String,
        required: true
      },

      address: {
        type: String,
        required: true
      },

    status: {
        type: String,
        enum: ['success','failed','pending'],
        default: 'pending',
        required: true
    },

    stripePaymentId: {
        type: String,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;