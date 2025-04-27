const mongoose = require("mongoose");

const restaurantItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Item name is required"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Item description is required"],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "Item price is required"],
    min: [0, "Price cannot be negative"],
  },
  imageUrl: {
    type: String,
    trim: true,
  },
  inStock: {
    type: Boolean,
    default: true,
  },
  deleteStatus: {
    type: Boolean,
    default: false,
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: [true, "Restaurant is required"],
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

// Update the updatedAt field before saving
restaurantItemSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const RestaurantItem = mongoose.model("RestaurantItem", restaurantItemSchema);

module.exports = RestaurantItem;
