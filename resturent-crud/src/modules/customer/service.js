const Customer = require("./model.js");
const {
  hashPassword,
  comparePassword,
  generateToken,
} = require("../../utils/passwordUtils");

exports.registerCustomer = async (customerData) => {
  const hashedPassword = await hashPassword(customerData.password);
  const customer = new Customer({
    ...customerData,
    password: hashedPassword,
  });
  return await customer.save();
};

exports.loginCustomer = async (email, password) => {
  const customer = await Customer.findOne({ email }).select("+password");

  if (!customer) throw new Error("Customer not found");

  const isMatch = await comparePassword(password, customer.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const token = generateToken(customer);

  return {
    customer: {
      _id: customer._id,
      name: customer.name,
      address: customer.address,
      email: customer.email,
    },
    token,
  };
};

exports.getCustomerById = async (id) => {
  return await Customer.findById(id);
};

exports.updateCustomer = async (id, updateData) => {
  if (updateData.password) {
    updateData.password = await hashPassword(updateData.password);
  }
  return await Customer.findByIdAndUpdate(id, updateData, { new: true });
};

exports.deleteCustomer = async (id) => {
  return await Customer.findByIdAndDelete(id);
};

exports.getAllCustomers = async () => {
  return await Customer.find();
};

exports.changePassword = async (id, currentPassword, newPassword) => {
  const customer = await Customer.findById(id).select("+password");

  if (!customer) throw new Error("Customer not found");

  const isMatch = await comparePassword(currentPassword, customer.password);
  if (!isMatch) throw new Error("Current password is incorrect");

  customer.password = await hashPassword(newPassword);
  await customer.save();

  return { message: "Password changed successfully" };
};
