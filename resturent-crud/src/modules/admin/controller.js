const adminService = require("./service.js");

exports.register = async (req, res, next) => {
  try {
    const admin = await adminService.registerAdmin(req.body);
    res.status(201).json(admin);
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { employeeNumber, password } = req.body;
    const result = await adminService.loginAdmin(employeeNumber, password);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
exports.getAllAdmins = async (req, res, next) => {
  try {
    const admins = await adminService.getAllAdmins();
    res.status(200).json(admins);
  } catch (error) {
    next(error);
  }
};
exports.getProfile = async (req, res, next) => {
  try {
    const admin = await adminService.getAdminById(req.admin.id);
    res.status(200).json(admin);
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const admin = await adminService.updateAdmin(req.admin.id, req.body);
    res.status(200).json(admin);
  } catch (error) {
    next(error);
  }
};

exports.deleteProfile = async (req, res, next) => {
  try {
    await adminService.deleteAdmin(req.admin.id);
    res.status(200).json({
      success: true,
      message: "Admin deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const result = await adminService.changePassword(
      req.admin.id,
      currentPassword,
      newPassword
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
