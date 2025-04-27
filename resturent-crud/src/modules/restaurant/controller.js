const restaurantService = require("./service.js");

exports.register = async (req, res, next) => {
  try {
    const restaurant = await restaurantService.registerRestaurant(req.body);
    res.status(201).json({
      success: true,
      data: restaurant,
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const result = await restaurantService.loginRestaurant(username, password);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

exports.getRestaurantById = async (req, res, next) => {
  try {
    const restaurant = await restaurantService.getRestaurantById(req.params.id);
    res.status(200).json(restaurant);
  } catch (error) {
    next(error);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const restaurant = await restaurantService.getRestaurantById(
      req.restaurant.id
    );
    res.status(200).json(restaurant);
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const restaurant = await restaurantService.updateRestaurant(
      req.restaurant.id,
      req.body
    );
    res.status(200).json(restaurant);
  } catch (error) {
    next(error);
  }
};

exports.updateRestaurant = async (req, res, next) => {
  try {
    const restaurant = await restaurantService.updateRestaurant(
      req.params.id,
      req.body
    );
    res.status(200).json(restaurant);
  } catch (error) {
    next(error);
  }
};

exports.deleteProfile = async (req, res, next) => {
  try {
    const restaurant = await restaurantService.deleteRestaurant(
      req.restaurant.id
    );
    res.status(200).json({
      success: true,
      data: restaurant,
      message: "Restaurant marked as deleted",
    });
  } catch (error) {
    next(error);
  }
};
exports.getAllRestaurants = async (req, res, next) => {
  try {
    const query = {};

    if (req.query.activeStatus !== undefined) {
      query.activeStatus = req.query.activeStatus === "true";
    }

    const restaurants = await restaurantService.getAllRestaurants(query);

    res.status(200).json(restaurants);
  } catch (error) {
    next(error);
  }
};
exports.changePassword = async (req, res, next) => {
  try {
    const { newPassword } = req.body;
    const result = await restaurantService.changePassword(
      req.restaurant.id,
      newPassword
    );
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
