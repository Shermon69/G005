const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Restaurant name is required"],
    trim: true,
  },
  username: {
    type: String,
    required: [true, "Restaurant username is required"],
    trim: true,
  },
  imageUrl: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
    required: [true, "Address is required"],
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Password must be at least 8 characters long"],
    select: false,
  },
  restaurantId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  ownerName: {
    type: String,
    required: [true, "Owner name is required"],
    trim: true,
  },
  businessRegistrationNumber: {
    type: String,
    required: [true, "Business registration number is required"],
    unique: true,
    trim: true,
  },
  activeStatus: {
    type: Boolean,
    default: false,
  },
  deleteStatus: {
    type: Boolean,
    default: false,
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
restaurantSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

module.exports = Restaurant;
