const Restaurant = require("./model.js");
const {
  hashPassword,
  comparePassword,
  generateToken,
} = require("../../utils/passwordUtils.js");

exports.registerRestaurant = async (restaurantData) => {
  try {
    const hashedPassword = await hashPassword(restaurantData.password);
    const restaurant = new Restaurant({
      ...restaurantData,
      password: hashedPassword,
    });
    return await restaurant.save();
  } catch (error) {
    throw error;
  }
};

exports.loginRestaurant = async (username, password) => {
  try {
    const restaurant = await Restaurant.findOne({ username }).select(
      "+password"
    );

    if (!restaurant) {
      throw new Error("Restaurant not found");
    }

    if (restaurant.deleteStatus) {
      throw new Error("This account has been deleted");
    }

    if (!restaurant.activeStatus) {
      throw new Error("This account is not active");
    }

    const isMatch = await comparePassword(password, restaurant.password);

    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    const token = generateToken(restaurant);

    return {
      restaurant: {
        _id: restaurant._id,
        name: restaurant.name,
        username: restaurant.username,
        restaurantId: restaurant.restaurantId,
        ownerName: restaurant.ownerName,
        activeStatus: restaurant.activeStatus,
      },
      token,
    };
  } catch (error) {
    throw error;
  }
};

exports.getRestaurantById = async (id) => {
  return await Restaurant.findById(id);
};

//update
exports.updateRestaurant = async (id, updateData) => {
  if (updateData.password) {
    updateData.password = await hashPassword(updateData.password);
  }
  return await Restaurant.findByIdAndUpdate(id, updateData, { new: true });
};

//delete
exports.deleteRestaurant = async (id) => {
  return await Restaurant.findByIdAndUpdate(
    id,
    { deleteStatus: true },
    { new: true }
  );
};
exports.getAllRestaurants = async (query = {}) => {
  const filter = { deleteStatus: { $ne: true }, ...query };
  return await Restaurant.find(filter).select("-password");
};
exports.changePassword = async (id, newPassword) => {
  const restaurant = await Restaurant.findById(id);

  if (!restaurant) {
    throw new Error("Restaurant not found");
  }

  restaurant.password = await hashPassword(newPassword);
  await restaurant.save();

  return { message: "Password changed successfully" };
};
