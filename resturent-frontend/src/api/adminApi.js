import axios from "./axiosConfig";

// Set token if available
const setAuthToken = () => {
  const token = localStorage.getItem("token");
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export const registerAdmin = (adminData, token) => {
  if (token) setAuthToken(token);
  return axios.post("/admins/register", adminData);
};

export const loginAdmin = (credentials) => {
  return axios.post("/admins/login", credentials);
};

export const getAdminProfile = (token) => {
  setAuthToken(token);
  return axios.get("/admins/profile");
};

export const updateAdminProfile = (data, token) => {
  setAuthToken(token);
  return axios.put("/admins/profile", data);
};

export const deleteAdminProfile = (token) => {
  setAuthToken(token);
  return axios.delete("/admins/profile");
};

export const getAllAdmins = (token) => {
  setAuthToken(token);
  return axios.get("/admins/all");
};

export const changeAdminPassword = (newPassword, token) => {
  setAuthToken(token);
  return axios.put("/admins/change-password", { newPassword });
};
