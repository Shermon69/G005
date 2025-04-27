const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const saltRounds = 10;

exports.hashPassword = async (password) => {
  return await bcrypt.hash(password, saltRounds);
};

exports.comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

exports.generateToken = (admin) => {
  return jwt.sign(
    { id: admin._id, employeeNumber: admin.employeeNumber },
    "asdadsisadhajkdhadahsid123jkassdjkad",
    { expiresIn: "1d" }
  );
};

exports.verifyToken = (token) => {
  return jwt.verify(token, "asdadsisadhajkdhadahsid123jkassdjkad");
};
