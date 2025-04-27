const Admin = require("./model.js");
const {
  hashPassword,
  comparePassword,
  generateToken,
} = require("../../utils/passwordUtils");

exports.registerAdmin = async (adminData) => {
  try {
    const hashedPassword = await hashPassword(adminData.password);
    const admin = new Admin({
      ...adminData,
      password: hashedPassword,
    });
    return await admin.save();
  } catch (error) {
    throw error;
  }
};

exports.loginAdmin = async (employeeNumber, password) => {
  try {
    const admin = await Admin.findOne({ employeeNumber }).select("+password");

    if (!admin) {
      throw new Error("Admin not found");
    }

    const isMatch = await comparePassword(password, admin.password);

    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    const token = generateToken(admin);

    return {
      admin: {
        _id: admin._id,
        name: admin.name,
        employeeNumber: admin.employeeNumber,
        createdAt: admin.createdAt,
      },
      token,
    };
  } catch (error) {
    throw error;
  }
};
exports.getAllAdmins = async (req, res, next) => {
  try {
    const admins = await Admin.find();
    return admins;
  } catch (error) {
    next(error);
  }
};
exports.getAdminById = async (id) => {
  return await Admin.findById(id);
};

exports.updateAdmin = async (id, updateData) => {
  if (updateData.password) {
    updateData.password = await hashPassword(updateData.password);
  }
  return await Admin.findByIdAndUpdate(id, updateData, { new: true });
};

exports.deleteAdmin = async (id) => {
  return await Admin.findByIdAndDelete(id);
};
exports.changePassword = async (id, currentPassword, newPassword) => {
  const admin = await Admin.findById(id).select("+password");

  if (!admin) {
    throw new Error("Admin not found");
  }

  const isMatch = await comparePassword(currentPassword, admin.password);

  if (!isMatch) {
    throw new Error("Current password is incorrect");
  }

  admin.password = await hashPassword(newPassword);
  await admin.save();

  return { message: "Password changed successfully" };
};
