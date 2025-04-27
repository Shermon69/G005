const customerService = require("./service.js");

exports.register = async (req, res, next) => {
  try {
    const customer = await customerService.registerCustomer(req.body);
    res.status(201).json(customer);
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await customerService.loginCustomer(email, password);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const customer = await customerService.getCustomerById(req.customer.id);
    res.status(200).json(customer);
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const updated = await customerService.updateCustomer(
      req.customer.id,
      req.body
    );
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

exports.deleteProfile = async (req, res, next) => {
  try {
    await customerService.deleteCustomer(req.customer.id);
    res
      .status(200)
      .json({ success: true, message: "Customer deleted successfully" });
  } catch (error) {
    next(error);
  }
};

exports.getAllCustomers = async (req, res, next) => {
  try {
    const customers = await customerService.getAllCustomers();
    res.status(200).json(customers);
  } catch (error) {
    next(error);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const result = await customerService.changePassword(
      req.customer.id,
      currentPassword,
      newPassword
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
