const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'customerModel' // Allows referencing different customer models if needed
  },
  customerModel: {
    type: String,
    required: true,
    enum: ['Customer'], // Can extend if you have multiple customer types
    default: 'Customer'
  },
  orderedItems: [
    {
      itemId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      name: { // Denormalized for easier querying
        type: String,
        required: true
      },
      price: { // Denormalized to preserve historical data
        type: Number,
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
    },
  ],
  restaurantId: { // Reference to the restaurant
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  restaurantName: { // Denormalized for easier querying
    type: String,
    required: true
  },
  totalBilled: {
    type: Number,
    required: true,
    min: 0,
  },
  deliveryAddress: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "preparing", "out-for-delivery", "delivered", "cancelled"],
    default: "pending",
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed", "refunded"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

orderSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;