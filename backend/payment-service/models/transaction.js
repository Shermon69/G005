import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },

    amount: {
        type: Number,
        required: true
    },

    currency: {
        type: String,
        default: 'LKR'
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